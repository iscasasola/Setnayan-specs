#!/usr/bin/env python3
"""
Generate the master run-of-show timeline from a Tayo canonical event JSON.

Usage:
    python generate_timeline.py path/to/event.json [--out timeline.md]

Output: a markdown file following assets/timeline_template.md, written to stdout
or to the path passed in --out.

This script is deterministic. Same input -> same output. If you want to change
the output format, edit assets/timeline_template.md (it's parsed here as
plain string with field substitutions) and run again.
"""

from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timezone, timedelta
from pathlib import Path

MANILA_TZ = timezone(timedelta(hours=8))


def load_event(path: Path) -> dict:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def find_coordinator(event: dict) -> dict | None:
    for v in event.get("vendors", []):
        if v.get("service_type") == "coordinator":
            return v
    return None


def vendor_call_times_table(event: dict) -> str:
    rows = []
    for v in event.get("vendors", []):
        svc = v.get("service", {})
        call = svc.get("call_time_confirmed") or svc.get("call_time_requested") or "TBD"
        dur = svc.get("on_site_duration_hr")
        dur_str = f"{dur}h" if dur is not None else "TBD"
        loc = svc.get("primary_location") or _infer_primary_location(v, event)
        rows.append(f"| {v['business_name']} ({v['service_type']}) | {call} | {dur_str} | {loc} |")
    return "\n".join(rows) if rows else "| (no vendors yet) | | | |"


def _infer_primary_location(vendor: dict, event: dict) -> str:
    """Best-effort guess of a vendor's primary location for the at-a-glance table."""
    st = vendor.get("service_type")
    if st in {"hmua"}:
        return event.get("venues", {}).get("prep", {}).get("bride", {}).get("name", "Prep location")
    if st in {"officiant", "choir", "florist"}:
        return event.get("venues", {}).get("ceremony", {}).get("name", "Ceremony venue")
    if st in {"caterer", "host", "band_dj", "videographer"}:
        return event.get("venues", {}).get("reception", {}).get("name", "Reception venue")
    if st == "photographer":
        return "Prep -> Ceremony -> Reception"
    if st == "coordinator":
        return "Across all venues"
    if st == "bridal_car":
        return "Transit"
    return "TBD"


def run_of_show_rows(event: dict) -> str:
    rows = []
    venues = event.get("venues", {})
    vendor_lookup = {v["vendor_id"]: v["business_name"] for v in event.get("vendors", [])}

    def location_label(loc_token: str) -> str:
        if loc_token == "venues.ceremony":
            return venues.get("ceremony", {}).get("name", "Ceremony venue")
        if loc_token == "venues.reception":
            return venues.get("reception", {}).get("name", "Reception venue")
        if loc_token == "prep.bride":
            return venues.get("prep", {}).get("bride", {}).get("name", "Bride prep")
        if loc_token == "prep.groom":
            return venues.get("prep", {}).get("groom", {}).get("name", "Groom prep")
        if loc_token == "transit":
            return "Transit"
        return loc_token

    def vendor_label_list(types: list[str]) -> str:
        # types are like "photographer", "videographer" — find vendor business names
        names = []
        for t in types:
            for v in event.get("vendors", []):
                if v.get("service_type") == t:
                    names.append(v.get("business_name", t))
                    break
            else:
                names.append(t)
        return ", ".join(names) if names else "—"

    for seg in event.get("run_of_show", []):
        time = seg.get("time", "")
        end = _add_minutes(time, seg.get("duration_min", 0))
        time_label = f"{time}-{end}"
        loc = location_label(seg.get("location", ""))
        lead = vendor_label_list(seg.get("lead", []))
        sup = vendor_label_list(seg.get("supporting", []))
        notes = seg.get("notes", "")
        rows.append(f"| {time_label} | {seg.get('segment','')} | {loc} | {lead} | {sup} | {notes} |")
    return "\n".join(rows) if rows else "| | | | | | |"


def _add_minutes(hhmm: str, minutes: int) -> str:
    if not hhmm or ":" not in hhmm:
        return ""
    h, m = map(int, hhmm.split(":"))
    total = h * 60 + m + int(minutes)
    return f"{(total // 60) % 24:02d}:{total % 60:02d}"


def processional_order_list(event: dict) -> str:
    order = event.get("ceremony", {}).get("processional_order", [])
    return "\n".join(f"{i+1}. {step.replace('_', ' ').title()}" for i, step in enumerate(order))


def ceremony_segments(event: dict) -> str:
    """Generate the PH-specific ceremony detail section."""
    rites = event.get("ceremony", {}).get("unity_rites", [])
    bullets = [
        "- Liturgy of the Word (readings, gospel, homily)",
        "- Rite of Marriage (consent, vows, ring exchange)",
    ]
    if "coin" in rites:
        bullets.append("- **Coin (arras) ceremony** — Coin Bearer presents 13 coins; groom hands to bride")
    if "candle" in rites:
        bullets.append("- **Candle ceremony** — Candle Sponsors light tapers")
    if "veil" in rites:
        bullets.append("- **Veil ceremony** — Veil Sponsors place veil over couple")
    if "cord" in rites:
        bullets.append("- **Cord ceremony** — Cord Sponsors place yugal over couple")
    if event.get("ceremony", {}).get("ceremony_type") == "catholic_mass":
        bullets.append("- Liturgy of the Eucharist (full Mass)")
    bullets.append("- Signing of marriage contract")
    bullets.append("- Recessional")
    return "\n".join(bullets)


def reception_flow(event: dict) -> str:
    bullets = []
    for seg in event.get("run_of_show", []):
        if seg.get("location") == "venues.reception":
            time = seg.get("time", "")
            bullets.append(f"- **{time}** — {seg.get('segment','')}")
    return "\n".join(bullets) if bullets else "- (no reception segments scheduled yet)"


def traditions_list(event: dict) -> str:
    t = event.get("reception", {}).get("traditions", {}) or {}
    items = []
    if t.get("first_dance"): items.append("First dance")
    if t.get("parents_dance"): items.append("Parents' dance")
    if t.get("money_dance"): items.append("Money dance")
    if t.get("garter_bouquet"): items.append("Garter & bouquet toss")
    if t.get("prosperity_dance"): items.append("Prosperity dance / Pangalay")
    if t.get("sde_screening"): items.append(f"SDE screening (target {t.get('sde_screening_target_time','—')})")
    return "\n".join(f"- {x}" for x in items) if items else "- (no traditions confirmed yet)"


def contact_rows(event: dict) -> str:
    rows = []
    coord = find_coordinator(event)
    if coord:
        c = coord.get("primary_contact", {})
        rows.append(f"| Coordinator | {c.get('name','')} | {c.get('phone','')} | First point of contact |")
    couple = event.get("couple", {})
    rows.append(f"| Couple — {couple.get('preferred_couple_name','')} | {couple.get('partner_a',{}).get('name','')} | {couple.get('partner_a',{}).get('phone','')} | |")
    rows.append(f"| | {couple.get('partner_b',{}).get('name','')} | {couple.get('partner_b',{}).get('phone','')} | |")
    off = event.get("ceremony", {}).get("officiant", {})
    if off:
        rows.append(f"| Officiant | {off.get('name','')} | {off.get('contact','')} | Ceremony lead |")
    for v in event.get("vendors", []):
        if v.get("service_type") == "coordinator":
            continue
        c = v.get("primary_contact", {})
        rows.append(f"| {v.get('service_type','').replace('_',' ').title()} | {c.get('name','')} ({v.get('business_name','')}) | {c.get('phone','')} | |")
    return "\n".join(rows)


def render(event: dict, template_text: str) -> str:
    couple = event.get("couple", {})
    venues = event.get("venues", {})
    rec = event.get("reception", {})
    vendor_allowance = event.get("guests", {}).get("breakdown", {}).get("vendor_allowance", 0)
    coord = find_coordinator(event)

    fields = {
        "couple_name": couple.get("preferred_couple_name", ""),
        "date": event.get("event", {}).get("date", ""),
        "religion": event.get("event", {}).get("religion", "").title(),
        "coordinator_name": (coord or {}).get("primary_contact", {}).get("name", "TBD"),
        "ceremony_venue": venues.get("ceremony", {}).get("name", "TBD"),
        "reception_venue": venues.get("reception", {}).get("name", "TBD"),
        "guest_count": event.get("guests", {}).get("estimated_count", "TBD"),
        "vendor_allowance_count": vendor_allowance,
        "version": event.get("version", "?"),
        "generated_at": datetime.now(MANILA_TZ).strftime("%Y-%m-%d %H:%M %z"),
        "vendor_call_times_table": vendor_call_times_table(event),
        "run_of_show_rows": run_of_show_rows(event),
        "officiant_name": event.get("ceremony", {}).get("officiant", {}).get("name", "TBD"),
        "officiant_contact": event.get("ceremony", {}).get("officiant", {}).get("contact", "TBD"),
        "unity_rites_list": ", ".join(event.get("ceremony", {}).get("unity_rites", [])) or "—",
        "processional_order_list": processional_order_list(event),
        "ceremony_segments": ceremony_segments(event),
        "service_format": rec.get("service_format", "TBD"),
        "table_count": rec.get("table_count", "TBD"),
        "table_type": rec.get("table_type", "TBD"),
        "av_setup_summary": json.dumps(rec.get("av_setup", {})),
        "allowed_db": rec.get("av_setup", {}).get("allowed_db", "TBD"),
        "traditions_list": traditions_list(event),
        "reception_flow": reception_flow(event),
        "ceremony_venue_type": venues.get("ceremony", {}).get("type", "TBD"),
        "ceremony_rain_plan": venues.get("ceremony", {}).get("rain_plan", "—"),
        "reception_venue_type": venues.get("reception", {}).get("type", "TBD"),
        "reception_rain_plan": venues.get("reception", {}).get("rain_plan", "—"),
        "contact_rows": contact_rows(event),
        "event_id": event.get("event_id", ""),
        "coordinator_approval_status": "—",
        "couple_approval_status": "—",
    }

    out = template_text
    for k, v in fields.items():
        out = out.replace("{" + k + "}", str(v))
    return out


def main() -> int:
    p = argparse.ArgumentParser(description="Generate Tayo wedding-day timeline from event JSON.")
    p.add_argument("event_json", type=Path, help="Path to canonical event JSON")
    p.add_argument("--out", type=Path, default=None, help="Write output here; default stdout")
    p.add_argument("--template", type=Path, default=None, help="Override template path")
    args = p.parse_args()

    event = load_event(args.event_json)
    template_path = args.template or (Path(__file__).resolve().parent.parent / "assets" / "timeline_template.md")
    template_text = template_path.read_text(encoding="utf-8")
    out = render(event, template_text)

    if args.out:
        args.out.write_text(out, encoding="utf-8")
        print(f"Wrote {args.out}", file=sys.stderr)
    else:
        sys.stdout.write(out)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
