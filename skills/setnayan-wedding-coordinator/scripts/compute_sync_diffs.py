#!/usr/bin/env python3
"""
Compute per-vendor change messages from a before/after snapshot of a Tayo event.

Usage:
    python compute_sync_diffs.py before.json after.json [--out diffs.json]

For each meaningful change between `before` and `after`, this script:
  1. Identifies which fields changed
  2. Looks up which vendors are affected (using the sync triggers from
     references/sync-matrix.md)
  3. Produces a short, Tayo-voice change message per affected vendor

Output is JSON: a list of {vendor_id, vendor_name, service_type, message, fields_changed}.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any


# ---------------------------------------------------------------------------
# Sync triggers — which fields, when changed, notify which service types.
# Mirrors references/sync-matrix.md "Sync triggers" sections.
# ---------------------------------------------------------------------------

# Each entry: dotted path on event -> list of service_types to notify
TRIGGERS: dict[str, list[str]] = {
    "ceremony.start_time": ["photographer", "videographer", "florist", "hmua", "host"],
    "reception.start_time": ["caterer", "band_dj", "host", "videographer", "photographer"],
    "reception.end_time": ["caterer", "band_dj", "host"],
    "venues.ceremony.name": ["photographer", "videographer", "florist", "host", "band_dj", "officiant"],
    "venues.ceremony.address": ["photographer", "videographer", "florist"],
    "venues.reception.name": ["caterer", "band_dj", "host", "florist", "videographer", "photographer"],
    "venues.reception.address": ["caterer", "band_dj", "host", "florist"],
    "venues.reception.av_setup": ["videographer", "band_dj", "host"],
    "venues.prep.bride.name": ["hmua", "photographer"],
    "guests.estimated_count": ["caterer", "florist"],
    "guests.final_guest_count": ["caterer"],
    "guests.dietary_aggregated": ["caterer"],
    "guests.breakdown.vendor_allowance": ["caterer"],
    "event.theme.color_palette": ["florist"],
    "event.theme.flower_preferences": ["florist"],
    "playlist.do_not_play": ["band_dj"],
    "playlist.do_play": ["band_dj"],
    "reception.table_count": ["florist", "caterer"],
    "reception.service_format": ["caterer"],
    "reception.traditions.sde_screening": ["videographer", "host"],
    "reception.traditions.sde_screening_target_time": ["videographer", "host"],
    "acknowledgments": ["host"],
    "shot_list": ["photographer", "videographer"],
    # entourage triggers (handled specially because they're nested + count-sensitive)
    "entourage.principal_sponsors": ["photographer", "videographer", "florist", "host"],
    "entourage.secondary_sponsors": ["florist", "host"],
    "entourage.bridesmaids": ["hmua", "florist", "photographer"],
    "entourage.groomsmen": ["florist", "photographer"],
    "entourage.moh": ["hmua", "host"],
    "entourage.flower_girl": ["hmua", "florist"],
    "ceremony.unity_rites": ["host", "florist"],
}


# ---------------------------------------------------------------------------
# Diff helpers
# ---------------------------------------------------------------------------

def get_path(obj: Any, path: str) -> Any:
    cur = obj
    for part in path.split("."):
        if isinstance(cur, dict):
            cur = cur.get(part)
        else:
            return None
    return cur


def is_changed(before: Any, after: Any, path: str) -> bool:
    return get_path(before, path) != get_path(after, path)


def _fmt(v: Any) -> str:
    if v is None:
        return "—"
    if isinstance(v, list):
        return ", ".join(map(str, v)) if v else "—"
    if isinstance(v, dict):
        return json.dumps(v, ensure_ascii=False)
    return str(v)


# ---------------------------------------------------------------------------
# Message templates — keep these in Tayo voice.
# ---------------------------------------------------------------------------

def message_for(field: str, before: dict, after: dict, service_type: str) -> str:
    b = get_path(before, field)
    a = get_path(after, field)

    # Time changes — adjust call time per service_type
    if field == "ceremony.start_time":
        return (
            f"Heads up — the ceremony moved from **{b}** to **{a}**. "
            f"Your call time and on-site window may shift accordingly. "
            f"Coordinator will confirm the exact new call time."
        )
    if field == "reception.start_time":
        return f"Reception now starts at **{a}** (was {b}). Cocktail and dinner cues shift with it."
    if field == "reception.end_time":
        return f"Reception now ends at **{a}** (was {b}). Adjust your set / service window."

    if field == "venues.ceremony.name":
        addr = get_path(after, "venues.ceremony.address") or "—"
        return f"Ceremony venue changed to **{a}** ({addr}). Updated access window in the new packet."
    if field == "venues.reception.name":
        addr = get_path(after, "venues.reception.address") or "—"
        return f"Reception venue changed to **{a}** ({addr}). Power and AV details to confirm."

    if field == "guests.estimated_count":
        if service_type == "caterer":
            return f"Guest count is now **{a}** (was {b}). Headcount lock date approaches; please flag any capacity impact."
        if service_type == "florist":
            return f"Guest count is now **{a}** (was {b}). If table count adjusts, centerpiece order may change."

    if field == "guests.dietary_aggregated":
        return f"Updated dietary breakdown: {_fmt(a)}. Please flag any kitchen impact."

    if field == "guests.breakdown.vendor_allowance":
        return f"Vendor allowance count is now **{a}** (was {b}). This is meals for vendors, not guests."

    if field == "event.theme.color_palette":
        return f"Color palette updated. Old: {_fmt(b)}. New: {_fmt(a)}. Flag any stems already on order that need to swap."
    if field == "event.theme.flower_preferences":
        return f"Flower preferences updated: {_fmt(a)}."

    if field == "playlist.do_not_play":
        return f"Do-not-play list updated: {_fmt(a)}."
    if field == "playlist.do_play":
        return f"Do-play list updated: {_fmt(a)}."

    if field == "reception.table_count":
        return f"Reception tables now **{a}** (was {b}). Centerpiece count and meal count both shift."
    if field == "reception.service_format":
        return f"Service format is now **{a}** (was {b}). Confirm staffing and prep impact."

    if field == "reception.traditions.sde_screening":
        if a:
            t = get_path(after, "reception.traditions.sde_screening_target_time") or "TBD"
            return f"SDE is now contracted. Target screening time **{t}**."
        return "SDE has been removed from the program."

    if field == "reception.traditions.sde_screening_target_time":
        return f"SDE screening target time updated to **{a}** (was {b})."

    if field == "shot_list":
        return f"Shot list updated. Latest: {_fmt(a)}"

    if field == "acknowledgments":
        return f"Special acknowledgments updated. Latest: {_fmt(a)}"

    if field.startswith("entourage."):
        b_count = len(b) if isinstance(b, (list, dict)) else (1 if b else 0)
        a_count = len(a) if isinstance(a, (list, dict)) else (1 if a else 0)
        sub = field.split(".", 1)[1].replace("_", " ")
        return f"Entourage updated — {sub} count is now **{a_count}** (was {b_count}). Recompute floral/headcount as needed."

    if field == "ceremony.unity_rites":
        return f"Unity rites set: **{_fmt(a)}** (was {_fmt(b)}). Adjust floral and host script accordingly."

    if field == "venues.reception.av_setup":
        return f"Reception AV setup updated: {_fmt(a)}."

    if field == "venues.prep.bride.name":
        addr = get_path(after, "venues.prep.bride.address") or "—"
        return f"Bride prep location changed to **{a}** ({addr}). New call address."

    return f"Field `{field}` changed from {_fmt(b)} to {_fmt(a)}."


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def compute_diffs(before: dict, after: dict) -> list[dict]:
    """Return a list of {vendor_id, vendor_name, service_type, fields_changed, message}."""
    # Step 1: find changed fields
    changed: list[str] = [f for f in TRIGGERS if is_changed(before, after, f)]

    if not changed:
        return []

    # Step 2: find vendor objects keyed by service_type (multiple vendors may share a type)
    vendors_by_type: dict[str, list[dict]] = {}
    for v in after.get("vendors", []):
        st = v.get("service_type")
        if st:
            vendors_by_type.setdefault(st, []).append(v)

    # Step 3: per vendor, accumulate the messages for fields they care about
    results: dict[str, dict] = {}
    for field in changed:
        affected_types = TRIGGERS[field]
        for st in affected_types:
            for vendor in vendors_by_type.get(st, []):
                vid = vendor.get("vendor_id")
                if vid not in results:
                    results[vid] = {
                        "vendor_id": vid,
                        "vendor_name": vendor.get("business_name"),
                        "service_type": st,
                        "fields_changed": [],
                        "messages": [],
                    }
                results[vid]["fields_changed"].append(field)
                results[vid]["messages"].append(message_for(field, before, after, st))

    # Step 4: collapse messages into one combined block per vendor
    out = []
    for vid, r in results.items():
        body = "\n\n".join(f"- {m}" for m in r["messages"])
        combined = (
            f"Hi {r['vendor_name']} — quick update on {after.get('couple',{}).get('preferred_couple_name','the wedding')}:\n\n"
            f"{body}\n\n"
            f"Salamat po. Coordinator: {_coordinator_contact(after)}"
        )
        r["message"] = combined
        del r["messages"]
        out.append(r)
    return out


def _coordinator_contact(event: dict) -> str:
    for v in event.get("vendors", []):
        if v.get("service_type") == "coordinator":
            c = v.get("primary_contact", {})
            return f"{c.get('name','—')} {c.get('phone','—')}"
    return "—"


def main() -> int:
    p = argparse.ArgumentParser(description="Compute per-vendor change messages from event before/after JSON.")
    p.add_argument("before_json", type=Path)
    p.add_argument("after_json", type=Path)
    p.add_argument("--out", type=Path, default=None)
    args = p.parse_args()

    before = json.loads(Path(args.before_json).read_text(encoding="utf-8"))
    after = json.loads(Path(args.after_json).read_text(encoding="utf-8"))
    diffs = compute_diffs(before, after)

    payload = json.dumps(diffs, indent=2, ensure_ascii=False)
    if args.out:
        args.out.write_text(payload, encoding="utf-8")
        print(f"Wrote {args.out}", file=sys.stderr)
    else:
        sys.stdout.write(payload + "\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
