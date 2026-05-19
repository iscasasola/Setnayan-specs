#!/usr/bin/env python3
"""Parse raw SSR HTML for each captured route and build behavioral cross-reference docs."""

import json
import re
from pathlib import Path
from bs4 import BeautifulSoup

SNAP = Path("/Users/icecasasola/Documents/Claude/Projects/Setnayan/Live_Site_Snapshot_2026-05-18")
RAW = SNAP / "raw"

# Map raw filename → public URL path
ROUTES = {
    "home.html": "/",
    "vendors.html": "/vendors",
    "features.html": "/features",
    "for-vendors.html": "/for-vendors",
    "help.html": "/help",
    "login.html": "/login",
    "signup.html": "/signup",
    "signup-as-vendor.html": "/signup?as=vendor",
    "privacy.html": "/privacy",
    "terms.html": "/terms",
    "waitlist.html": "/waitlist",
    "pricing.html": "/pricing",
    "download.html": "/download",
}

def squash(t):
    return re.sub(r"\s+", " ", t or "").strip()

def extract(html_path):
    soup = BeautifulSoup(html_path.read_text(encoding="utf-8"), "html.parser")
    # remove script/style noise but KEEP rendered markup
    for s in soup(["script", "style", "noscript"]):
        s.decompose()

    links = []
    for a in soup.find_all("a"):
        href = a.get("href", "")
        text = squash(a.get_text())
        aria = a.get("aria-label", "")
        if not (text or aria):
            continue
        if href.startswith("data:") or href.startswith("#"):
            continue
        links.append({"text": text[:150], "href": href, "aria": aria[:100]})

    buttons = []
    for b in soup.find_all("button"):
        text = squash(b.get_text())
        aria = b.get("aria-label", "")
        btype = b.get("type", "button")
        if not (text or aria):
            continue
        buttons.append({"text": text[:150], "type": btype, "aria": aria[:100]})

    inputs = []
    for el in soup.find_all(["input", "select", "textarea"]):
        tag = el.name.upper()
        itype = el.get("type", "text")
        name = el.get("name", "")
        placeholder = el.get("placeholder", "")
        required = el.has_attr("required")
        # Look for label
        label = ""
        if el.get("id"):
            lab = soup.find("label", attrs={"for": el["id"]})
            if lab:
                label = squash(lab.get_text())
        if not label:
            parent_label = el.find_parent("label")
            if parent_label:
                label = squash(parent_label.get_text())
        # Skip hidden tracking inputs
        if itype == "hidden":
            continue
        inputs.append({
            "tag": tag,
            "type": itype,
            "name": name,
            "placeholder": placeholder[:100],
            "label": label[:150],
            "required": required,
        })

    headings = []
    for level in range(1, 5):
        for h in soup.find_all(f"h{level}"):
            text = squash(h.get_text())
            if text:
                headings.append({"level": level, "text": text[:250]})

    # Currency / FREE strings with surrounding context, scoped to visible text
    visible_text = squash(soup.get_text(separator=" "))
    price_records = []
    seen_keys = set()
    pattern = re.compile(r"(₱[\d,]+(?:\.\d{2})?(?:/\w+)?|\bFREE\b)")
    for m in pattern.finditer(visible_text):
        price = m.group(1)
        start = max(0, m.start() - 50)
        end = min(len(visible_text), m.end() + 60)
        context = visible_text[start:end].strip()
        key = (price, context[:80])
        if key in seen_keys:
            continue
        seen_keys.add(key)
        price_records.append({"price": price, "context": context})
        if len(price_records) >= 80:
            break
    prices = price_records

    return {
        "url": ROUTES[html_path.name],
        "title": squash(soup.find("title").get_text() if soup.find("title") else ""),
        "links": links,
        "buttons": buttons,
        "inputs": inputs,
        "headings": headings,
        "prices": prices,
    }

def main():
    inventories = {}
    for fname, url in ROUTES.items():
        path = RAW / fname
        if not path.exists():
            print(f"MISSING: {fname}")
            continue
        inventories[url] = extract(path)
        inv = inventories[url]
        print(f"{url:25s}  links={len(inv['links']):3d}  buttons={len(inv['buttons']):2d}  inputs={len(inv['inputs']):2d}  headings={len(inv['headings']):3d}  prices={len(inv['prices']):2d}")

    # Dump combined JSON
    (SNAP / "rendered" / "all-inventories.json").write_text(json.dumps(inventories, indent=2, ensure_ascii=False), encoding="utf-8")

    # === Build cross-reference docs ===
    build_buttons(inventories)
    build_forms(inventories)
    build_prices(inventories)
    build_functions(inventories)

def build_buttons(inv):
    out = ["# Buttons & links — site-wide connection map",
           "",
           f"Every link and button across all 13 public routes, with destination. Source: SSR HTML, captured 2026-05-18.",
           "",
           "## Broken targets",
           "",
           "Routes referenced as link destinations that return non-200 on the live site:",
           "",
           "| Target | Status | Source page(s) |",
           "|--------|--------|----------------|",
           "| `/apply` | 404 | `/features` (primary CTA, twice) |",
           "| `/blog`  | 404 | (none yet — robots.txt only) |",
           "| `/supplies`  | 404 | (none yet — robots.txt only) |",
           "| `/suppliers` | 404 | (none yet — robots.txt only) |",
           "",
           "---",
           ""]

    for url in inv.keys():
        page = inv[url]
        out.append(f"## `{url}` — {page['title']}")
        out.append("")
        if page["links"]:
            out.append("### Links")
            out.append("")
            out.append("| Text | Destination | aria-label |")
            out.append("|------|-------------|------------|")
            seen = set()
            for l in page["links"]:
                key = (l["text"], l["href"])
                if key in seen:
                    continue
                seen.add(key)
                text = l["text"] or "(empty)"
                href = l["href"] or "(none)"
                aria = l["aria"] or ""
                out.append(f"| {text} | `{href}` | {aria} |")
            out.append("")
        if page["buttons"]:
            out.append("### Buttons")
            out.append("")
            out.append("| Text | Type | aria-label |")
            out.append("|------|------|------------|")
            seen = set()
            for b in page["buttons"]:
                key = (b["text"], b["type"])
                if key in seen:
                    continue
                seen.add(key)
                text = b["text"] or "(empty)"
                aria = b["aria"] or ""
                out.append(f"| {text} | {b['type']} | {aria} |")
            out.append("")
    (SNAP / "_BUTTONS.md").write_text("\n".join(out), encoding="utf-8")

def build_forms(inv):
    out = ["# Forms & data input/output — site-wide",
           "",
           f"Every form input across all 13 public routes. Source: SSR HTML, captured 2026-05-18.",
           "",
           "Use this to validate against the spec: which fields are collected, which are required, what they're named in the DOM.",
           "",
           "---",
           ""]
    for url, page in inv.items():
        if not page["inputs"]:
            continue
        out.append(f"## `{url}` — {page['title']}")
        out.append("")
        out.append("| Tag | Type | Label | Placeholder | Name (DOM) | Required |")
        out.append("|-----|------|-------|-------------|------------|----------|")
        for i in page["inputs"]:
            label = i["label"] or "(no label)"
            ph = i["placeholder"] or ""
            name = i["name"] or "(no name)"
            req = "yes" if i["required"] else ""
            out.append(f"| {i['tag']} | {i['type']} | {label} | {ph} | `{name}` | {req} |")
        out.append("")
    out.append("---")
    out.append("")
    out.append("## Pages with no public forms")
    out.append("")
    for url, page in inv.items():
        if not page["inputs"]:
            out.append(f"- `{url}` — {page['title']}")
    (SNAP / "_FORMS.md").write_text("\n".join(out), encoding="utf-8")

def build_prices(inv):
    out = ["# Pricing — site-wide PHP figures and FREE claims",
           "",
           "Every currency string and 'FREE' claim across all 13 public routes, with the surrounding context. Source: SSR HTML, captured 2026-05-18.",
           "",
           "Use this to reconcile against `0003_service_catalog` (source of truth per CLAUDE.md decision log).",
           "",
           "---",
           ""]
    # Group: price → list of (page, context)
    grouped = {}
    for url, page in inv.items():
        for rec in page["prices"]:
            grouped.setdefault(rec["price"], []).append({"page": url, "context": rec["context"]})

    out.append("## By price (each unique price → where it appears)")
    out.append("")
    for price in sorted(grouped.keys(), key=lambda p: (0, p) if p == "FREE" else (1, p)):
        out.append(f"### {price}")
        out.append("")
        out.append("| Page | Context |")
        out.append("|------|---------|")
        for r in grouped[price]:
            ctx = r["context"].replace("|", "\\|")
            out.append(f"| `{r['page']}` | {ctx} |")
        out.append("")

    out.append("---")
    out.append("")
    out.append("## By page (every price on each page)")
    out.append("")
    for url, page in inv.items():
        if not page["prices"]:
            continue
        out.append(f"### `{url}`")
        out.append("")
        out.append("| Price | Context |")
        out.append("|-------|---------|")
        for r in page["prices"]:
            ctx = r["context"].replace("|", "\\|")
            out.append(f"| **{r['price']}** | {ctx} |")
        out.append("")
    (SNAP / "_PRICES.md").write_text("\n".join(out), encoding="utf-8")

def build_functions(inv):
    out = ["# Functions & features — site-wide",
           "",
           f"Every heading across all 13 public routes (H1 → H4). Source: SSR HTML, captured 2026-05-18.",
           "",
           "This is the 'what the site says it does' inventory. Reconcile each section against its owning iteration folder.",
           "",
           "---",
           ""]
    for url, page in inv.items():
        if not page["headings"]:
            continue
        out.append(f"## `{url}` — {page['title']}")
        out.append("")
        for h in page["headings"]:
            indent = "  " * (h["level"] - 1)
            out.append(f"{indent}- **H{h['level']}** {h['text']}")
        out.append("")
    (SNAP / "_FUNCTIONS.md").write_text("\n".join(out), encoding="utf-8")

if __name__ == "__main__":
    main()
