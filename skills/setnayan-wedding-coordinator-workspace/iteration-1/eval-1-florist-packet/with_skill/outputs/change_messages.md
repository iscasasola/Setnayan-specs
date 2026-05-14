# Change propagation — Mariel & Joaquin (evt_2026_dela_cruz_santos)

**Change:** Added one more pair of Principal Sponsors on the bride's side:
- **Atty. Margarita Borja** (Ninang, bride side)
- **Mr. Felix Borja** (Ninong, bride side)

Principal Sponsor count moved from **6 → 8**. Event version `v17 → v18`.

---

## Who is affected (per `references/sync-matrix.md`)

The trigger `entourage.principal_sponsors` notifies four vendor service types. The Borja pair does not change guest count, dietary, venue, timing, AV, or any other field, so no other vendors fan out.

| # | Vendor | Service type | Why they care |
|---|--------|--------------|---------------|
| 1 | **Dahon Florals** (`v_dahon_florals`) | Florist | Floral count for Principal Sponsors changes (+2 corsages/boutonnieres). New packet attached. |
| 2 | **Kanlaon Studios** (`v_kanlaon_studios`) | Photographer | Two more people in the entourage processional, the pre-ceremony sponsor portraits, and any "each Principal Sponsor pair with couple" shots. |
| 3 | **Ikot Films** (`v_ikot_films`) | Videographer | Same reason as the photographer — two more bodies in the processional and entourage portraits to capture. |
| 4 | **Tito Henry Hosts** (`v_tito_henry`) | Host / Emcee | Two more names + titles to introduce during the entourage processional. Pronunciation confirmation needed. |

The following vendors are **not** affected and should not be messaged: Lutong Hapag Catering (no impact on guest/headcount or dietary — Principal Sponsors were already counted in the existing guest list), Aliw Glam Studio (HMUA scope is bride + 2 mothers + MOH + bridesmaids + flower girl; Ninangs are not in the booked package), Bagong Himig Band (reception music only), Lakad Wedding Coordination (reads everything; will see the change automatically through the dashboard, no separate ping needed).

---

## Drafted vendor messages (Setnayan voice)

Each message is short, Filipino-comfortable, and assumes the vendor does **not** have the old packet open. Coordinator can paste straight into Viber/Messenger or attach the regenerated packet.

### 1. Dahon Florals — Joel Aquino — `v_dahon_florals`

> Hi Joel, salamat po — quick update on Mariel & Joaquin's wedding (Nov 14).
>
> The couple just added one more pair of Principal Sponsors on the bride's side: **Atty. Margarita Borja** (Ninang) and **Mr. Felix Borja** (Ninong). Principal Sponsor count is now **8** (was 6).
>
> What this means for your scope:
> - **+2 Principal Sponsor corsages/boutonnieres** (1 corsage for the Ninang, 1 boutonniere for the Ninong) — total now **8**.
> - All other counts unchanged: 1 bridal bouquet, 6 secondary sponsor corsages, 4 bridesmaids' bouquets, 4 groomsmen's boutonnieres, 1 flower girl basket, 28 centerpieces.
> - Color palette and the love/avoid list are the same.
>
> An updated packet (event v18) is attached. Please confirm the new stem count and let us know if there's any cost or sourcing impact.
>
> Coordinator: Pat Esguerra · +63 917 000 0008

### 2. Kanlaon Studios — Aira Mendoza — `v_kanlaon_studios`

> Hi Aira, heads up po on Mariel & Joaquin (Nov 14).
>
> Two more Principal Sponsors on the bride's side: **Atty. Margarita Borja** (Ninang) and **Mr. Felix Borja** (Ninong). Total Ninongs/Ninangs is now **8**.
>
> Please update your portrait shot list:
> - "Principal Sponsors group photo" now has 8 people instead of 6
> - "Each Principal Sponsor pair with couple" — that's now 4 pairs (was 3)
> - Two more bodies in the entourage processional at 16:00
>
> Call time, venues, and reception flow are unchanged. No new contact info to log.
>
> Coordinator: Pat Esguerra · +63 917 000 0008

### 3. Ikot Films — Jamie Cruz — `v_ikot_films`

> Hi Jamie, quick update po on Mariel & Joaquin (Nov 14).
>
> Two more Principal Sponsors on the bride's side: **Atty. Margarita Borja** (Ninang) and **Mr. Felix Borja** (Ninong). Total is now **8**.
>
> For your reference: two more people in the processional and in the post-ceremony entourage portraits. SDE timing, call time, and reception flow are unchanged.
>
> Coordinator: Pat Esguerra · +63 917 000 0008

### 4. Tito Henry Hosts — Henry Domingo — `v_tito_henry`

> Hi Tito Henry, salamat po — small entourage update for Mariel & Joaquin (Nov 14).
>
> Two new Principal Sponsors to introduce during the processional, both bride side:
> - **Atty. Margarita Borja** (Ninang)
> - **Mr. Felix Borja** (Ninong)
>
> Total Principal Sponsors is now 8 (was 6). Please add them to the script and let us know if you need pronunciation confirmation for "Borja" (we'll check with the family).
>
> Run-of-show is otherwise unchanged.
>
> Coordinator: Pat Esguerra · +63 917 000 0008

---

## Notes for the planner

- The auto-generated diffs from `compute_sync_diffs.py` (saved to `diffs.json`) flagged exactly these four vendors. The messages above are the human-friendly versions, expanded with vendor-specific detail rather than the generic "recompute floral/headcount as needed" template line.
- Only Dahon Florals gets the regenerated packet (`florist_packet.md`). The other three vendors get the change ping only — their packets don't include the Principal Sponsor count as a delta-sensitive field worth re-issuing for two new names.
- Coordinator (Lakad Wedding Coordination) sees the change automatically via the dashboard per the sync matrix; no separate message needed.
- HMUA (Aliw Glam Studio) is intentionally **not** notified: the contracted package is bride + 2 mothers + MOH + 4 bridesmaids + 1 flower girl. Ninangs are not in scope. If the couple wants the new Ninang to be glammed by Aliw, that's a scope-add conversation, not a sync ping.
- Caterer (Lutong Hapag) is intentionally **not** notified: Principal Sponsors were already counted in the 280-pax guest estimate. No headcount change.
