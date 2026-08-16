# Video Context — Design Direction

## Three possible directions

### Theme Name: Paper Signal
Very brief intro: A research-notebook interface where transcript text feels tangible and timestamp markers behave like editorial annotations. The mood is focused, calm, and unusually human for an AI tool.
Probability: 0.04

### Theme Name: Broadcast Grid
Very brief intro: A sharper control-room interface built around timelines, signal bars, and compact monitoring panels. The mood is technical, fast, and operational.
Probability: 0.07

### Theme Name: Night Cut
Very brief intro: A dark cinematic workspace with electric accents, designed for people who think in scenes and edits. The mood is immersive and energetic.
Probability: 0.03

## Chosen approach: Paper Signal

### Design Movement
Contemporary editorial design blended with Swiss information graphics and tactile research-notebook materials.

### Core Principles
1. Transcript is the primary surface; video is the evidence layer.
2. Every timestamp should feel actionable and legible.
3. Warm paper surfaces and deep ink framing create trust without looking corporate.
4. Visual inspection is progressive disclosure, not ambient noise.

### Color Philosophy
Deep ink navy is the anchor for focus and technical credibility. Paper cream makes long-form transcript reading comfortable. A single muted amber marks actions, citations, and moments worth inspecting. The amber is intentionally scarce so it reads as a signal, not decoration.

### Layout Paradigm
An offset two-column workspace: a narrow context rail carries product logic and status while the main canvas stages the video, transcript, and evidence cards. The page should feel like a desk with notes placed around a central artifact, not a centered SaaS landing page.

### Signature Elements
1. Amber timestamp pins with a tiny vertical tick.
2. Paper cards with offset dark rules and marginal labels.
3. A compact “vision budget” indicator showing that visual context is requested only when needed.

### Interaction Philosophy
Clicks on transcript segments move the player and visibly promote the selected passage. Timestamp links are always keyboard reachable. Visual inspection requires an explicit user or AI request and returns a clear evidence label.

### Animation
Use short, spring-like transitions for selected transcript rows, 160–220ms. Let the hero timeline drift subtly only on initial load. Never animate core reading content continuously. Respect reduced-motion preferences.

### Typography System
Use Fraunces for display headlines and expressive labels; use IBM Plex Sans for body copy, controls, and metadata. Headlines are compact and editorial. Body text is 15–16px with generous line-height. Timestamp labels use IBM Plex Mono.

### Brand Essence
The low-cost visual memory layer for AI video conversations—made for builders, researchers, and curious people who want answers without replaying everything. Personality: **observant, economical, quietly bold**.

### Brand Voice
Headlines are direct and slightly knowing. CTAs say what will happen, not what the product is “helping” with. Microcopy is honest about evidence quality.

Example lines:
- “Give the model the moment, not the whole movie.”
- “Transcript first. Vision on request.”

### Wordmark & Logo
A compact glyph combining a play triangle, transcript bracket, and one timestamp tick. The wordmark is set in a high-contrast editorial serif with a small amber signal bar under “Context.”

### Signature Brand Color
Signal Amber: `#E6A24A`.

## Functional contract

Primary workflow: paste a YouTube URL, load the workspace, select transcript passages, jump the player to timestamps, and request a visual inspection at a specific moment.

Real in this frontend prototype: URL parsing, demo transcript search, transcript-row seeking, timestamp link generation, evidence mode toggles, and an AI tool contract drawer.

Deferred and labeled honestly: live transcript retrieval, exact server-side frame extraction, and real model invocation. The API schema is documented so the static prototype can become the client for a backend later.
