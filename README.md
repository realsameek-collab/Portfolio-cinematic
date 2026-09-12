Portfolio — Abdullah

A cinematic, scroll-driven personal portfolio built on Next.js 16 (App Router), React 19, Tailwind CSS v4, GSAP ScrollTrigger, Framer Motion, Lenis smooth-scroll, Three.js / Spline, and a handful of custom WebGL shaders. Designed to read like an editorial spread on desktop and to keep its rhythm intact on mobile, with every section choreographed against a single scroll timeline.

The site is deliberately heavy on motion and light on chrome: there is no navigation bar, no fold; the experience is the scroll. Each "chapter" introduces itself with a full-bleed curtain, plays a dedicated micro-scene, and hands the user off to the next chapter via a custom transition (warp portal, fold, zoom-parallax, tilted grid).

Live deploy

Deployed on Vercel from the main branch. Push-to-deploy. Static prerendering for the single route (/) plus on-demand image optimization through next/image.

Tech stack

Layer

Library / Tool

Version

Why it's here

Framework

Next.js

16.2.6 (App Router, Turbopack)

Static prerender of the single page, image optimization pipeline, font subsetting, route-level code splitting

UI runtime

React

19.2.4

Server Components for the root page; Client Components for every scroll-driven scene

Language

TypeScript

5.x (strict)

All app code is .tsx / .ts under strict: true

Styling

Tailwind CSS

4.x

Utility-first; theming via @theme tokens in globals.css

Component primitives

shadcn/ui, Radix

—

Buttons, dialog, tabs, sheet, switch, label

Scroll engine

Lenis

1.3.23

RAF-driven smooth scroll piped into GSAP's ticker so every ScrollTrigger reads from the same time source

Macro animation

GSAP + ScrollTrigger

3.15

Pinning, scrub, timeline choreography (FrameToFullscreen, ScrollWarpPortal, ScrollFoldTransition, ScrollRevealCurtain)

Micro animation

Framer Motion

12.38

Component-level enter/exit, cursor spring, hero parallax, modals

3D scene

Spline (@splinetool/react-spline)

4.1

The "Built Different" hero scene

WebGL shader

ogl

1.0.11

Custom light-rays fragment shader behind the design carousel

3D primitives

three, @react-three/fiber, @react-three/drei

0.184 / 9.6 / 10.7

Available for future scenes

Carousel

Swiper

12.1

Design carousel slider

Fonts

next/font/google — Cormorant Garamond, DM Sans

—

Two weights of Cormorant for display, three of DM Sans for body, all served via the Vercel font CDN

What's on the page

The single route at / is composed of these scenes, in order, all rendered as static HTML on first paint and progressively hydrated:

FrameToFullscreen → VSCodePortfolio
GSAP pin + perspective tilt that lifts a miniature VS Code window from the page and flattens it into the viewport. The IDE is a full replica — Mac OS menu bar, activity bar, explorer with a working FileTree, tabs, editor, right rail with ProjectModal cards driven by real project data, an animated TextType headline, and an embedded Apple-style SpotlightSearch (⌘K).

ScrollRevealCurtain → SplineSceneBasic
A black curtain peels away to reveal a Spline 3D scene with a Spotlight sweep. The Spline runtime is lazy-loaded behind an IntersectionObserver so the ~2 MB WebAssembly bundle never ships until the section is scrolled into view.

StoryScrollDemo
"About" chapter — long-form copy revealed through scroll-pinned typographic panels (story-scroll.tsx) with a prefers-reduced-motion opt-out.

ScrollWarpPortal (Chapter 02 — The Showcase)
Pinned section where text warps through a portal effect.

HeroParallaxDemo → HeroParallax
Three horizontally-translating rows of project cards driven by useScroll + useSpring. Real project thumbnails (KodaiRateIQ, ProofStack, CyberShield India, etc.) link out to live deploys.

ScrollMorphSection → ScrollMorphHero
Scatter → line → circle → bottom-strip flip-card morph animation cycling through every project image.

ScrollFoldTransition (Chapter 03 — Designed with Intent)
Origami-style fold transition between sections.

ScrollTiltedGridDemo → ScrollTiltedGrid
Each tile is a motion element with its own useScroll-driven blur, brightness, contrast, and 3D tilt. Backed by a starfield + dotted-grid + radial gold glow backdrop.

CardCarouselDemo with LightRays backdrop
Design portfolio carousel with a custom ogl-based fragment shader projecting low-saturation gold rays from the top of the section.

ZoomParallaxDemo → ZoomParallax
Sticky 300vh container where seven images zoom independently into the viewport on a single scroll arc.

ProfileCard (Contact)
Tilted holographic business card with pointer-tracked shine, mini avatar, status pill, and a LinkedIn CTA.

FooterDemo → Footer
Brand mark, social grid (LinkedIn, Resume, GitHub, Mail), nav row, and a giant blurred wordmark backdrop.

A global MouseFollower (dual-spring cursor) and a PageReveal curtain animate over the whole experience, and a SmoothScrollProvider (Lenis) drives the page's scroll.

Project structure

.
├─ app/
│  ├─ layout.tsx              Root layout — fonts, viewport, metadata, providers
│  ├─ page.tsx                Single route, composed of every scene in order
│  ├─ globals.css             Tailwind v4 theme tokens, scrollbar hide, noise overlay
│  └─ favicon.ico
│
├─ components/
│  ├─ animations/             Scroll choreography + page-wide motion primitives
│  │  ├─ FrameToFullscreen.tsx          GSAP pin + perspective unfold (IDE intro)
│  │  ├─ ScrollRevealCurtain.tsx        Color curtain peel
│  │  ├─ ScrollWarpPortal.tsx           Warp-through-portal transition
│  │  ├─ ScrollFoldTransition.tsx       Origami fold between sections
│  │  ├─ ScrollReveal.tsx               Drop-in reveal-on-scroll wrapper
│  │  ├─ ScrollFloat.tsx + .css         Per-character staggered float
│  │  ├─ ScrollExpand.tsx               Width/height expand on scroll
│  │  ├─ ParallaxSection.tsx            Y-translate parallax helper
│  │  ├─ MaskRevealText.tsx             Clip-path masked text reveal
│  │  ├─ StaggerTextReveal.tsx          Word-by-word stagger
│  │  ├─ VelocityScroll.tsx             Scroll-velocity skew
│  │  ├─ MagneticButton.tsx             Pointer-attractive button
│  │  ├─ HoverDistortionCard.tsx        Pointer-driven RGB-split card
│  │  ├─ MouseFollower.tsx              Dual-spring cursor (mix-blend-difference)
│  │  ├─ PageTransition.tsx             Page reveal + AnimatePresence route fade
│  │  ├─ SmoothScrollProvider.tsx       Lenis + GSAP ticker hookup
│  │  └─ SectionWrapper.tsx             Standardized section padding/layout
│  │
│  └─ ui/                     Scene components, shadcn primitives, and one-offs
│     ├─ vscode-portfolio.tsx           VS Code window replica (1119 LOC)
│     ├─ apple-spotlight.tsx            ⌘K spotlight with shortcuts + search
│     ├─ mac-os-menu-bar.tsx            Top menu bar, clock, weather
│     ├─ file-tree.tsx                  Animated file tree
│     ├─ project-modal.tsx              Project detail modal
│     ├─ project-showcase.tsx           Cursor-tracked project hover preview
│     ├─ hero-parallax.tsx              Three-row horizontal parallax
│     ├─ scroll-morph-hero.tsx          Scatter → line → circle morph
│     ├─ scroll-tilted-grid.tsx         Per-tile scroll-driven 3D tilt
│     ├─ zoom-parallax.tsx              Seven-image zoom-into-viewport
│     ├─ story-scroll.tsx               Pinned chapter typography
│     ├─ scroll-stack.tsx + .css        Sticky stacked cards
│     ├─ card-carousel.tsx              Design portfolio carousel
│     ├─ LightRays.tsx + .css           ogl-based fragment shader
│     ├─ ProfileCard.tsx + .css         Tilted holographic card
│     ├─ spline-scene-basic.tsx         Spline scene + Spotlight sweep
│     ├─ splite.tsx                     Lazy Suspense wrapper for Spline
│     ├─ spotlight.tsx                  SVG radial spotlight
│     ├─ lamp.tsx                       Conic-gradient lamp glow
│     ├─ logo-loop.tsx + .css           Infinite logo marquee
│     ├─ modem-animated-footer.tsx      Footer chrome
│     ├─ footer-demo.tsx                Footer composition
│     ├─ text-type.tsx + .css           Typewriter effect
│     ├─ ruler-carousel.tsx             Ruler-style carousel
│     ├─ container-scroll-animation.tsx Shared context for FrameToFullscreen
│     ├─ safari-01.tsx                  Safari-window chrome
│     ├─ ScrollProgressBar.tsx          Top scroll-progress bar
│     └─ shadcn primitives              badge, button, card, dialog, input, sheet,
│                                       tabs, button-shiny
│
├─ hooks/
│  ├─ useLenis.ts             Lenis RAF + GSAP ticker glue + global accessor
│  ├─ useInView.ts            IntersectionObserver hook
│  ├─ useMousePosition.ts     Pointer tracking
│  └─ useScrollProgress.ts    Scroll progress in [0,1]
│
├─ lib/
│  ├─ gsap.ts                 GSAP + ScrollTrigger registration, ease/duration tokens, createScrollReveal
│  ├─ motion.ts               Framer Motion variants and timing tokens
│  └─ utils.ts                cn() class merger
│
├─ constants/
│  └─ index.ts                Site metadata, nav links, project / skill / experience seed data
│
├─ public/                    Project thumbnails, design carousel images, profile assets, fonts
├─ next.config.ts             Image pipeline, package import optimization, cache + security headers
├─ tsconfig.json              strict TS, ES2017 target, `@/*` path alias
├─ eslint.config.mjs          Flat config layering eslint-config-next core-web-vitals + TS rules
├─ postcss.config.mjs         Tailwind v4 PostCSS plugin
├─ components.json            shadcn config
├─ package.json               Dependencies, scripts
├─ AGENTS.md / CLAUDE.md      Agent guard-rails (Next.js 16 has breaking changes — read node_modules/next/dist/docs)
└─ README.md                  You are here

Getting started

Prerequisites

Node.js 20+ (Next.js 16 dropped Node 18)

pnpm 9+ (the repo ships a pnpm-lock.yaml and a pnpm-workspace.yaml)

Install

pnpm install

Local development

pnpm dev

Open http://localhost:3000. Turbopack is the default in Next.js 16; HMR is wired through next dev. Edit app/page.tsx and any imported scene to iterate live.

Production build

pnpm build
pnpm start

pnpm build runs Turbopack-powered production compilation, type-checks the project with tsc --noEmit (via Next), collects route data, and prerenders the single / route to static HTML. The output is in .next/.

Lint

pnpm lint

ESLint flat config layers eslint-config-next/core-web-vitals and eslint-config-next/typescript. Lint is decoupled from next build (so an in-flight stylistic warning does not block deploys), but the type checker still runs during build and will fail the build on any TS error.

Architecture decisions

Single scroll timeline

The whole experience is driven by one source of truth for time:

useLenis (hooks/useLenis.ts) instantiates Lenis with duration: 1.2, an exponential-ease wheel, and pipes its scroll event straight into ScrollTrigger.update.

The Lenis RAF loop is registered with gsap.ticker.add(tick) — the same tick reference is removed in cleanup (early commits had a leak here where gsap.ticker.add and gsap.ticker.remove were given different inline closures, so the RAF survived hot-reloads).

Every animated section uses GSAP ScrollTrigger or Framer Motion's useScroll, both reading from window.scrollY, which Lenis now owns. There is no second scroll loop anywhere.

Code splitting

The root app/page.tsx is a Server Component. Every interactive scene is a Client Component ("use client") imported into it. Next.js automatically code-splits each client component into its own chunk.

The Spline runtime (~2 MB compressed, includes WebAssembly for physics + opentype) is wrapped in splite.tsx with React.lazy() + <Suspense>. The Spline scene component then guards its render behind an IntersectionObserver so the runtime is not even fetched until the user scrolls to it.

next.config.ts declares experimental.optimizePackageImports for framer-motion, gsap, lucide-react, @radix-ui/*, @react-three/drei, and lenis — only the named exports actually used get bundled.

Image pipeline

next/image is used for every non-decorative image, with explicit sizes matched to the actual visual width.

next.config.ts declares formats: ['image/avif', 'image/webp'] and tuned deviceSizes / imageSizes arrays, so the heavy PNGs (oldportfolio-1.png at 4.5 MB, profilecard.png at 4.1 MB) stream as AVIF/WebP at viewport size rather than as raw PNG.

A response-header rule applies Cache-Control: public, max-age=31536000, immutable to fonts and images.

Fonts

Two next/font/google families: Cormorant Garamond (display, weights 400/500) and DM Sans (body, weights 400/500/600). Both with display: 'swap'.

Cormorant has preload: false because it appears only in a handful of card titles — eagerly preloading every weight blocks the critical font request for DM Sans.

Cursor & input

MouseFollower (components/animations/MouseFollower.tsx) uses Framer Motion springs for the outer ring and an inner dot at different stiffness, blended with mix-blend-difference.

It detects coarse pointers via matchMedia('(pointer: coarse)') in a useEffect (no SSR mismatches) and short-circuits the whole component on touch devices.

Hover-state tracking uses document-level event delegation (mouseover / mouseout with e.target.closest(...)) rather than per-element listeners, so links and buttons added later in the scroll lifecycle (modals, spotlight results, project cards) get the hover treatment automatically without re-scanning the DOM.

The mousemove listener is registered with { passive: true }.

Mailto / external links

The footer and the ⌘K spotlight detect protocol URLs (mailto:, tel:, sms:) and render plain <a> without target="_blank". The earlier behavior — target="_blank" on a mailto: — opens a blank tab that the OS then tries to redirect, which Safari and some Chromium builds drop silently.

Security headers

next.config.ts sets:

X-Content-Type-Options: nosniff

X-Frame-Options: SAMEORIGIN

Referrer-Policy: strict-origin-when-cross-origin

X-DNS-Prefetch-Control: on

poweredByHeader: false

Reduced motion

prefers-reduced-motion: reduce is honored where motion is critical: story-scroll.tsx reads the media query and disables transforms, scroll-tilted-grid.tsx swaps to a static layout via Framer's useReducedMotion, and the starfield in the tilted grid CSS animation pauses.

Build configuration highlights

// next.config.ts
reactStrictMode: true
poweredByHeader: false
compress: true
productionBrowserSourceMaps: false  // smaller deploy, no client maps
images: {
  formats: ['image/avif', 'image/webp'],
  minimumCacheTTL: 60 * 60 * 24 * 30,
  deviceSizes: [360, 640, 750, 828, 1080, 1200, 1440, 1920, 2560],
  imageSizes:  [16, 32, 48, 64, 96, 128, 256, 384, 512, 768],
}
experimental.optimizePackageImports: [
  'framer-motion', 'gsap', 'lucide-react',
  '@radix-ui/react-label', '@radix-ui/react-switch',
  '@react-three/drei', 'lenis',
]

Deployment (Vercel)

The project is configured to deploy zero-config on Vercel:

Connect the GitHub repo (realsameek-collab) to a Vercel project.

Framework preset: Next.js (auto-detected).

Install command: pnpm install (auto).

Build command: pnpm build (auto).

Output: .next/ (auto).

Set the metadataBase in app/layout.tsx to your final deploy URL for correct OG image resolution.

Static pages prerender at build time; next/image requests are served via Vercel's edge image optimizer.

Conventions

All scene components use a "use client" directive at the top.

Server-only logic stays in app/page.tsx and app/layout.tsx.

Animations register on useLayoutEffect (to avoid flicker) and clean up via gsap.context().

GSAP ScrollTriggers are created inside gsap.context() blocks so they're collected and disposed together on unmount.

Class-name composition goes through lib/utils.ts cn() (clsx + tailwind-merge).

Path alias @/* resolves to the project root (see tsconfig.json).

Known constraints

The site is desktop-first by design — many scenes (the VS Code IDE, Spline 3D, the horizontal hero parallax) are authored at a 1440-wide canvas. They render on mobile but the design is not flowed for it.

metadataBase in app/layout.tsx currently points at a placeholder Vercel URL; update before going to a custom domain so Open Graph image URLs resolve correctly.

Credits

Smooth scroll — Lenis by darkroom.engineering

Animation engines — GSAP and Framer Motion

3D scene — Spline

WebGL primitives — ogl

Component primitives — shadcn/ui on Radix

Aceternity, motion-primitives, and 21st.dev for several pattern references the scenes were authored against

Built with care by Abdullah — LinkedIn · GitHub · ameek263@gmail.com
