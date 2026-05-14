#!/usr/bin/env python3
"""
Generate a per-vendor info packet from a Tayo canonical event JSON.

Usage:
    python generate_vendor_packet.py path/to/event.json VENDOR_ID [--out packet.md]

VENDOR_ID is the vendor_id field from the event (e.g., "v_kanlaon_studios").

Output: a markdown file following assets/vendor_packet_template.md, populated
only with the fields the vendor's service_type is permitted to see (per
references/sync-matrix.md). Privacy is enforced here — fields outside the
vendor's reads list are NEVER substituted into the template.
"""

from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timezone, timedelta
from pathlib import Path

MANILA_TZ = timezone(timedelta(hours=8))


# ---------------------------------------------------------------------------
# Sync matrix — kept here as code, mirroring the JSON tail of references/sync-matrix.md.
# When the matrix file changes, update this block. (We ship two copies on
# purpose: the markdown is canonical for humans, this dict is canonical for
# code paths. Tests check they stay in sync.)
# ---------------------------------------------------------------------------
SYNC_MATRIX: dict[str, dict] = {
    "photographer": {
        "needs_ceremony": True, "needs_reception": True,
        "needs_entourage_names": True, "needs_dietary": False,
        "needs_full_run_of_show": False, "needs_payment": True,
    },
    "videographer": {
        "needs_ceremony": True, "needs_reception": True,
        "needs_entourage_names": False, "needs_dietary": False,
        "needs_full_run_of_show": False, "needs_payment": True,
    },
    "caterer": {
        "needs_ceremony": False, "needs_reception": True,
        "needs_entourage_names": False, "needs_dietary": True,
        "needs_full_run_of_show": False, "needs_payment": True,
    },
    "florist": {
        "needs_ceremony": True, "needs_reception": True,
        "needs_entourage_names": True, "needs_dietary": False,
        "needs_full_run_of_show": False, "needs_payment": True,
    },
    "hmua": {
        "needs_ceremony": False, "needs_reception": False,
        "needs_entourage_names": True, "needs_dietary": False,
        "needs_full_run_of_show": False, "needs_payment": True,
        "needs_prep_locations": True,
    },
    "band_dj": {
        "needs_ceremony": False, "needs_reception": True,
        "needs_entourage_names": False, "needs_dietary": False,
        "needs_full_run_of_show": False, "needs_payment": True,
        "needs_playlist": True,
    },
    "host": {
        "needs_ceremony": False, "needs_reception": True,
        "needs_entourage_names": True, "needs_dietary": False,
        "needs_full_run_of_show": True, "needs_payment": True,
        "needs_acknowledgments": True,
    },
    "coordinator": {
        "needs_ceremony": True, "needs_reception": True,
        "needs_entourage_names": True, "needs_dietary": True,
        "needs_full_run_of_show": True, "needs_payment": True,
    },
}


def load_event(path: Path) -> dict:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def find_vendor(event: dict, vendor_id: str) -> dict:
    for v in event.get("vendors", []):
        if v.get("vendor_id") == vendor_id:
            return v
    raise SystemExit(f"vendor_id {vendor_id!r} not found in event")


def find_coordinator(event: dict) -> dict | None:
    for v in event.get("vendors", []):
        if v.get("service_type") == "coordinator":
            return v
    return None


def vendor_segments(event: dict, vendor: dict) -> list[dict]:
    """Return run-of-show segments where this vendor's service_type is lead or supporting."""
    st = vendor.get("service_type")
    out = []
    for seg in event.get("run_of_show", []):
        if st in seg.get("lead", []) or st in seg.get("supporting", []):
            out.append({**seg, "your_role": "Lead" if st in seg.get("lead", []) else "Supporting"})
    return out


def vendor_run_of_show_rows(event: dict, vendor: dict) -> str:
    rows = []
    for seg in vendor_segments(event, vendor):
        time = seg.get("time", "")
        end = _add_minutes(time, seg.get("duration_min", 0))
        rows.append(f"| {time}-{end} | {seg.get('segment','')} | {seg['your_role']} | {seg.get('notes','')} |")
    return "\n".join(rows) if rows else "| (no segments assigned to your service yet) | | | |"


def _add_minutes(hhmm: str, minutes: int) -> str:
    if not hhmm or ":" not in hhmm:
        return ""
    h, m = map(int, hhmm.split(":"))
    total = h * 60 + m + int(minutes)
    return f"{(total // 60) % 24:02d}:{total % 60:02d}"


def vendor_specific_section(event: dict, vendor: dict) -> str:
    """The body content unique to each service type. Privacy-filtered."""
    st = vendor.get("service_type", "")
    rules = SYNC_MATRIX.get(st, {})
    parts = []

    if st == "photographer":
        ent = event.get("entourage", {})
        ps_count = len(ent.get("principal_sponsors", []))
        ss = ent.get("secondary_sponsors", {})
        ss_count = sum(len(v) for v in ss.values()) if isinstance(ss, dict) else 0
        bm_count = len(ent.get("bridesmaids", [])) + len(ent.get("groomsmen", []))
        bearers = sum(1 for k in ("flower_girl", "ring_bearer", "coin_bearer", "bible_bearer") if ent.get(k))
        parts.append("### Entourage at a glance")
        parts.append(f"- Principal Sponsors (Ninongs/Ninangs): **{ps_count}** people")
        parts.append(f"- Secondary Sponsors (candle/veil/cord): **{ss_count}** people")
        parts.append(f"- Bridesmaids + Groomsmen: **{bm_count}** people")
        parts.append(f"- Bearers (flower girl, ring/coin/bible): **{bearers}**")
        parts.append("")
        parts.append("### Couple's shot list")
        for s in event.get("shot_list", []):
            parts.append(f"- {s}")

    elif st == "videographer":
        sde = event.get("reception", {}).get("traditions", {}).get("sde_screening")
        sde_time = event.get("reception", {}).get("traditions", {}).get("sde_screening_target_time")
        if sde:
            parts.append(f"### Same-Day-Edit (SDE)")
            parts.append(f"SDE is contracted. Target screening time: **{sde_time}**.")
            parts.append(f"Reception AV setup: {json.dumps(event.get('reception',{}).get('av_setup',{}))}")
        parts.append("### Couple's must-capture moments")
        for s in event.get("shot_list", []):
            parts.append(f"- {s}")

    elif st == "caterer":
        g = event.get("guests", {})
        bd = g.get("breakdown", {})
        diet = g.get("dietary_aggregated", {})
        parts.append("### Headcount and meal planning")
        parts.append(f"- Estimated guests: **{g.get('estimated_count','TBD')}**")
        parts.append(f"  - Adults: {bd.get('adults','—')}")
        parts.append(f"  - Children: {bd.get('children','—')}")
        parts.append(f"  - Vendor allowance (vendors to be fed): **{bd.get('vendor_allowance','—')}**")
        parts.append("")
        parts.append("### Dietary breakdown (aggregated, no names)")
        if diet:
            for k, v in diet.items():
                parts.append(f"- {k.replace('_', ' ').title()}: **{v}**")
        else:
            parts.append("- (none reported yet)")
        parts.append("")
        parts.append(f"### Service format")
        parts.append(f"- Format: **{event.get('reception',{}).get('service_format','TBD')}**")
        parts.append(f"- Reception time: {event.get('reception',{}).get('start_time','—')}–{event.get('reception',{}).get('end_time','—')}")
        parts.append(f"- Headcount lock date: **{vendor.get('service',{}).get('headcount_lock_date','TBD')}**")

    elif st == "florist":
        ent = event.get("entourage", {})
        ps = len(ent.get("principal_sponsors", []))
        ss = ent.get("secondary_sponsors", {})
        ss_total = sum(len(v) for v in ss.values()) if isinstance(ss, dict) else 0
        bm = len(ent.get("bridesmaids", []))
        gm = len(ent.get("groomsmen", []))
        rec = event.get("reception", {})
        theme = event.get("event", {}).get("theme", {})
        parts.append("### Floral count from entourage")
        parts.append(f"- 1 bridal bouquet")
        parts.append(f"- {ps} corsages/boutonnieres for Principal Sponsors")
        parts.append(f"- {ss_total} smaller corsages/boutonnieres for Secondary Sponsors")
        parts.append(f"- {bm} bridesmaids' bouquets")
        parts.append(f"- {gm} groomsmen's boutonnieres")
        parts.append(f"- 1 flower girl basket / petals")
        parts.append("")
        parts.append("### Reception arrangements")
        parts.append(f"- Tables: **{rec.get('table_count','TBD')}** × {rec.get('table_type','—')}")
        parts.append(f"- Color palette: {', '.join(theme.get('color_palette', [])) or '—'}")
        parts.append(f"- Love list: {', '.join(theme.get('flower_preferences',{}).get('love', [])) or '—'}")
        parts.append(f"- Avoid list: {', '.join(theme.get('flower_preferences',{}).get('avoid', [])) or '—'}")

    elif st == "hmua":
        ent = event.get("entourage", {})
        prep = event.get("venues", {}).get("prep", {})
        heads = (
            1  # bride
            + 2  # parents (mothers)
            + (1 if ent.get("moh") else 0)
            + len(ent.get("bridesmaids", []))
            + (1 if ent.get("flower_girl") else 0)
        )
        parts.append("### Heads to prepare (estimate)")
        parts.append(f"- Bride")
        parts.append(f"- Mother of bride + Mother of groom (2)")
        if ent.get("moh"): parts.append(f"- Maid of Honor: {ent['moh'].get('name','—')}")
        parts.append(f"- Bridesmaids: {len(ent.get('bridesmaids', []))}")
        if ent.get("flower_girl"): parts.append(f"- Flower Girl: {ent['flower_girl'].get('name','—')} (age {ent['flower_girl'].get('age','—')})")
        parts.append("")
        parts.append(f"**Total estimated heads:** {heads}")
        parts.append("")
        parts.append("### Prep locations")
        parts.append(f"- Bride prep: {prep.get('bride',{}).get('name','—')} — {prep.get('bride',{}).get('address','—')}")
        parts.append(f"- Groom prep: {prep.get('groom',{}).get('name','—')} — {prep.get('groom',{}).get('address','—')}")
        parts.append("")
        parts.append("### Touch-up windows")
        parts.append("- Pre-ceremony, after travel to church")
        parts.append("- Pre-reception (after ceremony portraits)")
        parts.append("- Before garter & bouquet toss (optional)")

    elif st == "band_dj":
        rec = event.get("reception", {})
        pl = event.get("playlist", {})
        host = next((v for v in event.get("vendors", []) if v.get("service_type") == "host"), None)
        parts.append("### Reception music windows")
        parts.append(f"- Reception: **{rec.get('start_time','—')} – {rec.get('end_time','—')}**")
        parts.append(f"- Allowed dB: {rec.get('av_setup',{}).get('allowed_db','—')}")
        parts.append(f"- AV setup: {json.dumps(rec.get('av_setup',{}))}")
        parts.append("")
        parts.append("### Music windows that need cue points (coordinate with Host)")
        for seg in event.get("run_of_show", []):
            if "band_dj" in seg.get("lead", []) or "band_dj" in seg.get("supporting", []):
                parts.append(f"- **{seg.get('time','')}** — {seg.get('segment','')}")
        parts.append("")
        parts.append("### Playlist")
        parts.append(f"- **Do play:** {', '.join(pl.get('do_play', [])) or '—'}")
        parts.append(f"- **Do not play:** {', '.join(pl.get('do_not_play', [])) or '—'}")
        if host:
            parts.append(f"\n### Host")
            parts.append(f"- {host.get('business_name','—')}: {host.get('primary_contact',{}).get('name','—')} — {host.get('primary_contact',{}).get('phone','—')}")

    elif st == "host":
        couple = event.get("couple", {})
        ent = event.get("entourage", {})
        ack = event.get("acknowledgments", {})
        parts.append("### Couple")
        parts.append(f"- Preferred names: **{couple.get('preferred_couple_name','—')}**")
        prn = couple.get("names_pronunciation", {})
        if prn:
            parts.append("- Pronunciation:")
            for name, hint in prn.items():
                parts.append(f"  - {name}: {hint}")
        parts.append("")
        parts.append("### Principal Sponsors (introduce by full name + title in processional)")
        for ps in ent.get("principal_sponsors", []):
            title = f"{ps.get('title','')} " if ps.get("title") else ""
            parts.append(f"- {title}{ps.get('name','')} ({ps.get('role','—')}, {ps.get('side','—')} side)")
        parts.append("")
        parts.append("### Special acknowledgments")
        for d in ack.get("deceased", []):
            parts.append(f"- In memoriam: {d.get('name','')}")
        for a in ack.get("absent", []):
            parts.append(f"- Sorely missed: {a.get('name','')}")
        for s in ack.get("special_thanks", []):
            parts.append(f"- Thanks: {s}")
        parts.append("")
        parts.append("### Full reception run-of-show (cue points)")
        for seg in event.get("run_of_show", []):
            if seg.get("location") == "venues.reception":
                parts.append(f"- **{seg.get('time','')}** — {seg.get('segment','')}")

    elif st == "coordinator":
        parts.append("### You read everything")
        parts.append("Coordinator packets are the full event view; no privacy filtering applies.")
        parts.append("Use the master timeline (`generate_timeline.py`) and the dashboard for working state.")

    else:
        parts.append(f"_(Vendor type `{st}` is not yet in the sync matrix. Propose entries to references/sync-matrix.md before generating a real packet for this vendor.)_")

    return "\n".join(parts)


def vendor_specific_response_items(vendor: dict) -> str:
    st = vendor.get("service_type", "")
    if st == "photographer":
        return "- Confirm shot list edits (or note we missed any)\n- Confirm second-shooter assignment"
    if st == "videographer":
        return "- Confirm SDE delivery time\n- Confirm equipment list"
    if st == "caterer":
        return "- Confirm menu and any kitchen-impact dietary items\n- Confirm vendor allowance count"
    if st == "florist":
        return "- Confirm final stem count and palette\n- Confirm setup access window at both venues"
    if st == "hmua":
        return "- Confirm head count and time-per-head\n- Confirm trial date if not done"
    if st == "band_dj":
        return "- Confirm setup duration and equipment requirements\n- Confirm coordination with host"
    if st == "host":
        return "- Send draft script for couple review\n- Confirm pronunciation of all names"
    return "- Confirm scope and contract terms"


def render(event: dict, vendor: dict, template_text: str) -> str:
    venues = event.get("venues", {})
    coord = find_coordinator(event)
    payment = vendor.get("payment", {})

    fields = {
        "vendor_business_name": vendor.get("business_name", ""),
        "couple_name": event.get("couple", {}).get("preferred_couple_name", ""),
        "event_date": event.get("event", {}).get("date", ""),
        "version": event.get("version", "?"),
        "generated_at": datetime.now(MANILA_TZ).strftime("%Y-%m-%d %H:%M %z"),
        "service_type": vendor.get("service_type", "").replace("_", " ").title(),
        "call_time": vendor.get("service", {}).get("call_time_confirmed") or vendor.get("service", {}).get("call_time_requested", "TBD"),
        "on_site_duration": f"{vendor.get('service',{}).get('on_site_duration_hr','—')}h",
        "primary_location": vendor.get("service", {}).get("primary_location") or "(see your run-of-show)",
        "preferred_couple_name": event.get("couple", {}).get("preferred_couple_name", ""),
        "ceremony_venue_name": venues.get("ceremony", {}).get("name", "TBD"),
        "ceremony_venue_address": venues.get("ceremony", {}).get("address", ""),
        "ceremony_access_window": f"{venues.get('ceremony',{}).get('access_window',{}).get('start','—')}–{venues.get('ceremony',{}).get('access_window',{}).get('end','—')}",
        "ceremony_parking_notes": venues.get("ceremony", {}).get("parking_notes", "—"),
        "reception_venue_name": venues.get("reception", {}).get("name", "TBD"),
        "reception_venue_address": venues.get("reception", {}).get("address", ""),
        "reception_access_window": f"{venues.get('reception',{}).get('access_window',{}).get('start','—')}–{venues.get('reception',{}).get('access_window',{}).get('end','—')}",
        "reception_parking_notes": venues.get("reception", {}).get("parking_notes", "—"),
        "rain_plan_summary": f"Ceremony: {venues.get('ceremony',{}).get('rain_plan','—')}. Reception: {venues.get('reception',{}).get('rain_plan','—')}.",
        "vendor_specific_section": vendor_specific_section(event, vendor),
        "vendor_run_of_show_rows": vendor_run_of_show_rows(event, vendor),
        "coordinator_name": (coord or {}).get("primary_contact", {}).get("name", "TBD"),
        "coordinator_phone": (coord or {}).get("primary_contact", {}).get("phone", "—"),
        "other_coordination_contacts": _other_coord_contacts(event, vendor),
        "response_deadline": _seven_days_before(event.get("event", {}).get("date", "")),
        "vendor_specific_response_items": vendor_specific_response_items(vendor),
        "reservation_amount": payment.get("reservation_amount_php", "—"),
        "reservation_due": payment.get("reservation_paid_date", "—"),
        "reservation_status": "Paid ✓" if payment.get("reservation_paid") else "Outstanding",
        "down_amount": payment.get("down_amount_php", "—"),
        "down_due": payment.get("down_due_date", "—"),
        "down_status": "Paid ✓" if payment.get("down_paid") else "Outstanding",
        "balance_amount": payment.get("balance_amount_php", "—"),
        "balance_due": payment.get("balance_due_date", "—"),
        "balance_status": "Paid ✓" if payment.get("balance_paid") else "Outstanding",
        "total_amount": payment.get("total_php", "—"),
        "couple_contact": event.get("couple", {}).get("partner_a", {}).get("phone", "—"),
        "coordinator_contact": (coord or {}).get("primary_contact", {}).get("phone", "—"),
        "event_id": event.get("event_id", ""),
    }

    out = template_text
    for k, v in fields.items():
        out = out.replace("{" + k + "}", str(v))
    return out


def _other_coord_contacts(event: dict, vendor: dict) -> str:
    """Return relevant other-vendor contacts based on the sync matrix's coordination expectations."""
    st = vendor.get("service_type")
    rows = []
    if st in {"photographer", "videographer", "host", "band_dj"}:
        # photographer/videographer coordinate with each other; host with band/dj
        for v in event.get("vendors", []):
            ot = v.get("service_type")
            if v.get("vendor_id") == vendor.get("vendor_id"):
                continue
            if (st == "photographer" and ot == "videographer") or (st == "videographer" and ot == "photographer"):
                rows.append(f"| Other media | {v.get('primary_contact',{}).get('name','')} ({v.get('business_name','')}) | {v.get('primary_contact',{}).get('phone','')} | Coordinates movement on the day |")
            if (st == "host" and ot == "band_dj") or (st == "band_dj" and ot == "host"):
                rows.append(f"| Reception co-lead | {v.get('primary_contact',{}).get('name','')} ({v.get('business_name','')}) | {v.get('primary_contact',{}).get('phone','')} | Cue point sync |")
    if st == "hmua":
        for v in event.get("vendors", []):
            if v.get("service_type") == "photographer":
                rows.append(f"| Photographer (prep shots) | {v.get('primary_contact',{}).get('name','')} ({v.get('business_name','')}) | {v.get('primary_contact',{}).get('phone','')} | Coordinates prep window |")
    return "\n".join(rows)


def _seven_days_before(date_str: str) -> str:
    if not date_str:
        return "TBD"
    try:
        d = datetime.fromisoformat(date_str)
        return (d - timedelta(days=7)).date().isoformat()
    except Exception:
        return "TBD"


def main() -> int:
    p = argparse.ArgumentParser(description="Generate per-vendor info packet from event JSON.")
    p.add_argument("event_json", type=Path)
    p.add_argument("vendor_id", type=str)
    p.add_argument("--out", type=Path, default=None)
    p.add_argument("--template", type=Path, default=None)
    args = p.parse_args()

    event = load_event(args.event_json)
    vendor = find_vendor(event, args.vendor_id)
    template_path = args.template or (Path(__file__).resolve().parent.parent / "assets" / "vendor_packet_template.md")
    template_text = template_path.read_text(encoding="utf-8")
    out = render(event, vendor, template_text)

    if args.out:
        args.out.write_text(out, encoding="utf-8")
        print(f"Wrote {args.out}", file=sys.stderr)
    else:
        sys.stdout.write(out)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
