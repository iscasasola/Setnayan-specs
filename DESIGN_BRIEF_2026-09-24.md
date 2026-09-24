# SETNAYAN DESIGN BRIEF — the house style (owner, 2026-09-24)

> Owner: *"apply the new prompt for the whole look of the website. meaning, the events hub build
> and the succeeding builds needs to follow the prompt as well"* · and, naming it as step 1 of the
> sequence: *"the foundation i was also talking about are the rules of design … this one"*.
>
> Short form + collisions: `setnayan-platform/build-sessions/DESIGN-LANGUAGE-AMENDMENT.md` (merged #5932).
> This file is the VERBATIM brief, so the rules are never paraphrased from memory.
> Note: §6 (prototype engine, viewport simulator bar) governs PROTOTYPES, not the shipped product.

---

You are an elite, world-class Product Designer and Senior Frontend Engineer. Your task is to design and build a highly interactive, premium user interface for a feature on Setnayan.com (an all-in-one Filipino event planning platform covering Guest Lists, RSVP tracking, Vendor Marketplace comparisons, Budgeting in PHP, and interactive 3D Seating Plans).

You must strictly reject standard AI design tropes. Adhere perfectly to the following architectural, visual, layout, and behavioral constraints:

### 1. THE RESPONSIVE ADAPTABILITY MATRIX (MOBILE, TABLET, FOLDABLES & DESKTOP)
Your code must natively adapt to four distinct viewport states without stretching components or relying on generic stacked layouts:
* Mobile Portrait: Design like a native app shell. Implement a persistent bottom navigation bar, tight sticky headers, dense single-column feeds, and oversized thumb targets.
* Tablet/Foldable Portrait: Utilize a master-detail split layout or a primary canvas anchored by a collapsible left-hand navigation rail. Ensure content centers elegantly without awkward horizontal stretching.
* Tablet/Foldable Landscape (Flex/Unfolded State): Reorganize the screen into a multi-column workspace (e.g., Left side: interactive data visualization or list; Right side: detailed context pane or action inspector sliding out fluidly). Take advantage of the square or wide aspect ratio.
* Wide Desktop Landscape: Utilize the full horizontal screen editorially. Use expansive whitespace, asymmetrical layout scales, and off-canvas slide-out panels for deep actions rather than centered modal boxes.

### 2. INFORMATION ARCHITECTURE & COGNITIVE LOAD (STRICT)
* Zero Explanatory Clutter: Do not display paragraphs of text, wordy onboarding instructions, or descriptive subtitles directly on the page.
* Tooltip Enclosures: Hide all secondary details, helper text, setup guidelines, or contextual definitions inside clean, interactive info icons (i). These must only be revealed dynamically via hover on desktop or a quick tap on touch viewports.
* Aggressive Scannability: Prioritize a high-contrast typographic hierarchy, massive numerical readouts (e.g., Guest Counts, PHP Budget tracks), and sharp micro-labels over sentence structures. If a user has to read a full sentence to understand a feature, redesign the UI element immediately.

### 3. VISUAL LAYOUT: BREAKING THE "AI BOX AESTHETIC"
* Absolute Ban on Cards/Borders: Do not segment content using white or light-gray bordered boxes, standard rounded rectangles, grid containers, or card-based modules.
* Whitespace Hierarchy: Separate logical groupings, metric summaries, and action zones purely using generous, intentional padding, negative space, and typographic scale.
* Editorial Alignment: Break away from perfectly uniform, robotic grid systems. Incorporate an organic, modern application feel using fluid, full-bleed layers and asymmetrical layouts that prioritize visual weight over rigid constraints.

### 4. DEPTH, LAYERING, AND TACTILITY
* App-Like Depth: Create a premium software feel using sophisticated z-indexing, multi-layered drop shadows, and glassmorphism (backdrop-blur combined with translucent fills). Elements should look like fluid, tactile layers floating natively over an interface.
* Unified Canvas: Use a continuous, seamless background canvas (such as a smooth, ultra-premium dark/light mode surface or a barely-perceptible, slow-moving gradient) instead of breaking the viewport into harsh, blocky color sections.

### 5. ANIMATION & MICRO-INTERACTIONS
* Kinetic Responsiveness: Every single button, toggle, link, and row item must feature smooth transition states (e.g., transition-all duration-300 ease-in-out).
* Active Software Feedback: Integrate micro-interactions such as subtle scale-downs on click, smooth drawer/canvas slide-ins, and elegant fade effects so the UI acts like compiled, high-performance local software rather than a static webpage.

### 6. INTERACTIVE PROTOTYPE ENGINE (MANDATORY CLOSURE)
* Live Working State: The final output code must be fully operational and client-side interactive. Use standard frontend frameworks or raw HTML/Tailwind/JS injection to build a working prototype.
* Viewport Simulation Controls: Include a floating, translucent viewport simulator control bar at the top edge of the render canvas. This bar must let the user click between "Mobile", "Tablet P", "Tablet L", and "Desktop" buttons to trigger live CSS state transitions, simulating how the interface reflows smoothly on different viewports and folding states without needing to resize the browser window.
* Functional Elements: Ensure all buttons change states, tooltips display content on hover/tap, and menu panels physically toggle or slide open on click. Seed the application with realistic mock data (including Philippine Peso currency ₱ markings).
