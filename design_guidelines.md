# Climaura Design Guidelines (Compacted)

## Core Philosophy
**Immersive Earth Visualization** inspired by Google Earth and NASA interfaces. Balance futuristic aesthetics with organic elements—cinematic, accessible, and solution-oriented climate storytelling.

**Principles**: Cinematic immersion • Clarity through beauty • Hopeful futurism • Universal accessibility

---

## Typography

**Primary**: Inter/DM Sans
- Hero: 3xl-6xl (48-60px), bold (700), tight tracking
- Sections: 2xl-3xl (30-36px), semibold (600)
- Body: base-lg (16-18px), regular (400), line-height 1.6
- AI Text: lg (18px), medium (500)
- Labels: sm-base (14-16px), medium (500), uppercase

**Technical**: JetBrains Mono for data values, timestamps, metrics

---

## Layout & Spacing

**Spacing Scale**: 2, 4, 6, 8, 12, 16, 20, 24, 32 (Tailwind units)
- Micro: 2-4 | Internal: 6-8 | Separation: 12-16 | Sections: 20-24 | Major: 32

**Structure**:
- Globe: Absolute positioned, full viewport (z-0)
- UI overlays: Max-w-7xl centered, backdrop-blur-xl
- Side drawer: 400-500px desktop, full width mobile

---

## Core Components

### 3D Globe Canvas
```javascript
// Full-viewport background, z-0
// Atmospheric glow: radial gradient overlay
// Starfield: scattered dots, opacity 0.3-0.8
// Auto-rotation: 0.5 deg/sec, pauses on interaction
// Markers: 12-16px, pulse animation (scale 1→1.1, opacity 1→0.6, 2s)
// Hover: scale(1.2), smooth transitions
```

### Prompt Input
```javascript
// Fixed bottom center, 40px from edge
// Width: 600px desktop, 90vw mobile (max-w-2xl)
// Height: 60px, rounded-full
// Glassmorphic: backdrop-blur-2xl, border-white/20
// Submit: Circular button, right-aligned, gradient bg
```

### AI Response Drawer
```javascript
// Slide-in from right, Framer Motion spring (stiffness: 300, damping: 30)
// Width: 480px desktop, full mobile
// bg-gray-900/95, backdrop-blur-xl
// Header: 2xl gradient text (blue-400→green-400), close button top-right
// Tabs: border-b white/10, animated underline (2px gradient)
// Audio: Fixed bottom, play/pause, speed (1x, 1.5x, 2x), waveform viz
```

### Data Visualization Cards
```javascript
// Container: rounded-2xl, bg-gray-800/50, backdrop-blur-md, p-6
// Recharts styling:
  - Line: gradient stroke (blue-400→green-400)
  - Grid: stroke-white/5
  - Tooltip: bg-gray-900/95, rounded-lg, p-3
  - Axis: text-sm text-gray-400
// Animation: Stagger 50ms, opacity + scale transforms
```

### Climate Pledge Modal
```javascript
// Overlay: fixed, bg-black/60, backdrop-blur-sm
// Card: centered, max-w-md, rounded-3xl
// Gradient bg: deep-blue-900→purple-900→green-900
// Textarea: h-32, personal commitment placeholder
// Success: react-confetti + particle burst animation
// Share: Grid of social buttons with brand colors
```

### Quiz Interface
```javascript
// Fixed center, scale-in animation
// Container: rounded-2xl, max-w-lg, gradient bg (blue-500/20→green-500/20)
// Options: p-4, rounded-xl, border-2 white/20
  - Hover: scale-105, border-white/40
  - Correct: bg-green-500/20 + check icon
  - Wrong: bg-red-500/20 + shake animation
// Reward: Aurora glow on globe (radial gradient pulse)
```

### Navigation Bar
```javascript
// Fixed top, h-16, backdrop-blur-xl, bg-black/40
// Logo: Left, "Climaura" + Earth icon (24px), font-bold
// Controls (right): Zoom (±), Reset, Mute, Settings (all 40px circular)
// Mobile: Hamburger → slide-out drawer
```

### Continent Info Cards
```javascript
// Width: 320px, backdrop-blur-xl, bg-gray-900/90, rounded-xl
// Fade-in + scale animation on click
// Header image: 120px, gradient overlay
// Stats: 3-metric grid (CO₂, temp, population)
// Pointer arrow connects to marker
```

---

## Color System (Intent-Based)

**Structure over specification**—use semantic tokens:
- Background layers: Deep semi-transparent
- Interactive: Subtle glows, border highlights
- Data viz: Gradient transitions
- Status: Distinct success/error/warning states
- Atmospheric: Soft diffused lighting, particles

**Contrast Requirements**: Text 4.5:1, UI 3:1 minimum

---

## Animation Standards

**Timings**:
- Micro (hover): 150-200ms
- UI reveals: 300-400ms
- Globe camera: 1000-1500ms easeInOut
- Data: 800-1200ms stagger (50-100ms per item)

**Key Patterns**:
```javascript
// Spring physics (Framer Motion) for organic movement
// Opacity + scale for depth
// Respect prefers-reduced-motion
// Globe zoom: smooth camera interpolation
// Panels: translateX with spring
// Charts: staggered fade-in, scale 0.95→1
// Pulse: infinite (scale 1→1.1, opacity 1→0.6, 2s)
```

---

## Accessibility (WCAG AA+)

- **Keyboard**: Full tab order, visible focus rings (ring-2 ring-blue-400)
- **ARIA**: Labels on all icons, semantic HTML, live regions for AI
- **Touch**: Minimum 44×44px (56×56px mobile)
- **Motion**: Toggle for non-essential animations
- **Scaling**: Support 200% zoom without breaking

---

## Responsive Breakpoints

**Desktop (1024px+)**: Globe full viewport, 480px drawer, 600px input, 2-3 column grids

**Tablet (768-1023px)**: 400px/60vw drawer, 90vw input (max-w-xl), 2-column grids

**Mobile (<768px)**: Full-width slide-up panels, rounded-t-3xl active input, single column, 56×56px targets, bottom tab bar (Home, Explore, Pledges, Profile)

---

## Images

**Assets**:
1. 3D Earth: 8k day/night textures + atmosphere glow layer
2. Continent markers: SVG regional icons
3. Info headers: Region-specific photos (Amazon, Sahara, etc.)
4. Data viz: Low-opacity topographic overlays
5. Pledge success: Celebratory Earth imagery
6. Quiz rewards: Animated SVG climate actions

**Treatment**: Gradient overlays for legibility, lazy load non-critical, WebP + JPEG fallbacks, responsive srcset

---

## Technical Specs

**Z-Index**: Globe (0) → UI (10) → Modals (50) → Tooltips (100)

**Glassmorphism**: `backdrop-filter: blur(24px)`, bg-opacity 0.8-0.95

**Border Radius**: 8px (sm), 12px (base), 16px (lg), 24px (xl), 32px (2xl), 9999px (full)

**Shadows**: Tailwind shadows + custom blue-tinted glows

**Gradients**: 135deg diagonal for depth, radial for spotlights

**Performance**:
- Dynamic imports for 3D globe
- Skeleton loaders (shimmer)
- 300ms debounce on globe drag
- requestAnimationFrame for particles
- Lazy load charts/fonts
- Preload critical assets (textures)

---

**Loading State**: Spinning globe icon with orbital animation (rotate + scale pulse)