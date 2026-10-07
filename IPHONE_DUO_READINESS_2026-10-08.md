# iPhone Duo readiness — Level 1 checklist (before the Apple check)

Source: Apple's "Preparing your app for iPhone Duo" (owner pasted 2026-10-08). iPhone Duo is a foldable phone: a compact OUTER display and a large INNER display, plus partially-folded poses; content moves between displays, and the fold and camera are "reserved regions". Our iOS app is a Capacitor shell around the web app (WKWebView), so most native advice translates to the web layer.

## Native shell (apps/mobile, Xcode)
1. Build with the LATEST Xcode, so the app fills the whole screen (older builds don't extend under the status bar or camera).
2. Allow every orientation and resizing (no locked portrait, no fixed scene size); test in the iPhone Duo simulator: closed (outer), open (inner), partially folded, rotated.
3. App Store screenshots at the iPhone Duo sizes (per Apple's screenshot specifications).

## Web layer (apps/web) — every page
4. Layout sizes come from the viewport/container, never fixed phone widths; the page reflows LIVE on resize (no reload, no lost state, open sheets and drafts kept). Test resize while the Maker, the Guests Select mode, sheets and the RSVP form are open.
5. Safe areas: `env(safe-area-inset-*)` on fixed bars (bottom nav, the Maker's lower third, frosted rows, the top bar), so nothing sits under the camera.
6. The fold: check whether WKWebView exposes the fold to the web (the Viewport Segments / Device Posture CSS env vars, e.g. `env(viewport-segment-*)`); if yes, keep controls and text off the fold; if not, keep critical controls away from the centre line on the inner display when partially folded.
7. Wide inner display = the desktop/tablet layout: the planned Desktop three-column adaptation must ALSO trigger at the inner-display width (one breakpoint system, not device sniffing).
8. Bars: our bars are custom web bars, so the system won't move them to the side. Ensure the bottom bar and the thumb-zone rows still fit and stay reachable at the outer-display width and in landscape; icons + words (button rule) degrade to icons when narrow.
9. Camera (Papic, Patiktok, scan): when the phone opens or closes, the active camera may switch display and face the other way. On resize/visibility change, re-check `getUserMedia` facingMode and restart the stream cleanly; never show a frozen preview.

## Done when
A walk-through in the iPhone Duo simulator (all poses, rotations) of: onboarding, Home, Guests, Suppliers, the Maker (Stages + Studio), the guest Event Hub, Papic camera — with screenshots, no clipped or unreachable controls, no reloads on fold/unfold. Part of the Level 1 quality sweep.

## From Apple's "Interface fundamentals" (owner pasted 2026-10-08) — also in the Level 1 sweep
10. **Automatic layout:** every screen adapts to every iPhone and iPad size and orientation (iPad = the Desktop three-column layout at its width).
11. **Dark Mode:** if the app supports dark (globals has `html.dark` tokens), every screen must look right in it (contrast, the frosted rows, look cards); if not fully ready, force light consistently rather than half-dark.
12. **Dynamic Type (iOS text size):** the app's text must stay readable and not break layouts when the iPhone's text size is larger (test at the largest accessibility sizes); in WKWebView, honour the system text size where possible.
13. **Accessibility (VoiceOver):** every button has a spoken name (ActionButton's aria-label = its word), images have alt text or are hidden from VoiceOver, picture-card looks are labelled, and the focus order follows the screen.
14. **Language:** English + Tagalog are already supported for public pages; dates, times and pesos formatted for the Philippines (en-PH).
15. **Undo:** the Maker's ↺ Undo covers every edit, including gestures (the Logo maker).
16. **Copy and paste:** links, the Event Hub address and codes are copyable with one tap (the Share/Copy pattern).
17. **App bundle:** the shell launches without the network failing silently; offline shows an honest "no connection" screen, never a blank or stale page (the service-worker stale-copy trap seen 08 Oct).
