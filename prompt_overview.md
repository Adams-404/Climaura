🧠 Prompt for AI Model — GaiaPrompt: The Interactive Climate Intelligence Experience

Instruction:
You are an expert full-stack web developer and UI/UX designer. Your task is to build a high-quality, production-ready web application called GaiaPrompt — an AI-powered interactive 3D experience that lets users explore the planet Earth, learn about environmental changes, and interact with AI-generated insights through prompts and natural conversation.

Follow this specification meticulously. Write clean, maintainable, TypeScript-based code, with modular and well-documented components. Do not generate placeholder or dummy apps — build a fully working, professional-grade web app ready for deployment.

1. 🌍 Product Overview

GaiaPrompt transforms climate education into an interactive and intelligent experience.
Users can rotate a 3D Earth globe, click on continents, and ask natural-language questions about climate change, sustainability, energy, or population impacts. The AI responds visually (through animations and data overlays) and verbally (through text-to-speech narration).

The concept fuses:

Environmental data visualization

AI question-answering & storytelling

Immersive 3D user interface

Inclusive usability design for all audiences

2. 🎯 Core Objectives

Make global climate awareness intuitive, engaging, and AI-interactive.

Use prompts as the main way users explore the Earth.

Present complex data in a beautiful, digestible format.

Ensure accessibility for low-literacy and low-bandwidth users.

Deliver an experience that feels alive, cinematic, and informative.

3. 🧩 Core Features and Behavior
A. 3D Interactive Earth

Render a realistic 3D globe that rotates slowly by default.

Users can drag to rotate, zoom in/out, and click on any continent marker.

Smooth camera transitions and auto-rotation pause on interaction.

Globe background should feature subtle stars or atmospheric glow.

Each continent marker displays an info card with AI-generated insights and visuals.

B. AI Prompt System

Prominent text input field labeled: “Ask the Earth anything...”

When the user submits a prompt (e.g. “Show me the impact of deforestation in Africa”), the following happens:

The globe animates to focus on the relevant continent.

The AI generates a contextual explanation — short, engaging, educational.

A panel slides in showing text response, related data, and optional images.

A text-to-speech engine narrates the response in natural voice.

The AI should handle prompts across topics: deforestation, CO₂, water, agriculture, biodiversity, etc.

C. Climate Data Visualization

Integrate live or sample datasets (CO₂ emissions, temperature change, renewable energy share, etc.).

Use dynamic charts (line or bar graphs) to visualize change over time.

Animate data updates in sync with AI explanations.

Optionally color the globe regions based on intensity of a metric (e.g., emissions heat map).

D. Audio Narration & Accessibility

Every AI response can be played via text-to-speech.

Provide a mute/unmute toggle and playback controls.

Use simple, legible typography, scalable layouts, and accessible color contrast.

E. Pledge & Share Feature

At the end of some interactions, users can take a “Climate Pledge” — e.g. “I’ll reduce plastic waste.”

Show celebratory animation (confetti, particle burst).

Allow sharing a generated image or quote (OpenGraph-style) to social platforms.

F. Gamified Learning

Add short quizzes after major topics: “Which continent emits the most CO₂?”

Correct answers reward visual effects (e.g., aurora glow on the globe).

Track quiz scores locally.

G. Optional AR/VR Mode

Provide a toggle for immersive viewing using WebXR if available.

Maintain fallback for devices that don’t support WebXR.

4. 🧱 Technical Specifications
Frontend

Framework: Next.js with TypeScript (App Router)

3D Visualization: react-globe.gl + Three.js

UI Library: shadcn/ui + TailwindCSS

Animation: Framer Motion

Charts: Recharts or Chart.js

State Management: React Hooks and Context API

Backend / API Layer

Use serverless functions (Next.js API routes) to:

Handle AI prompt requests via OpenAI API (or Hugging Face Inference API)

Fetch or store user pledges

Serve climate data (mock JSON if no live API)

Add error handling, caching, and loading indicators.

AI Integration

Use an LLM API for climate-related question answering.

Format prompt inputs with context (continent, topic, tone: educational and hopeful).

Parse and present output cleanly with markdown or HTML formatting.

Text-to-Speech

Use Web Speech API for in-browser narration fallback.

Support additional APIs (ElevenLabs, gTTS) for richer voice options.

Performance & Optimization

Use dynamic imports for 3D and heavy components.

Optimize assets with lazy loading.

Ensure globe remains performant on mid-range mobile devices.

Deployment

Ready for deployment on Vercel.

Include environment variables for API keys.

Add SEO tags, OpenGraph meta, and site manifest for PWA capabilities.

5. 🖌️ UI/UX Design Philosophy

Theme: Futuristic yet natural — mix of deep blues, glowing greens, and soft gradients.

Layout: Clean and centered, with focus on the globe as hero element.

Animations: Smooth, physics-based transitions (no jerky motion).

Typography: Sans-serif fonts; large titles; simple readability.

Accessibility: WCAG-compliant contrast, keyboard navigation, alt text for images.

Mobile: Responsive layout with simplified interactions (tap instead of drag).

Feedback: Subtle hover, click, and loading states.

6. 🧭 User Journey Flow

Landing Screen:

Earth slowly rotating in background

Floating text: “Prompt the planet to tell you its story.”

“Ask the Earth anything...” input visible below

User Interaction:

User enters prompt

Globe zooms to relevant region

AI explanation appears + narration begins

Information Display:

Side drawer with tabs: Overview, Data, Quiz, References

Charts animate to show related metrics

Engagement:

Quiz popups appear periodically

Correct answers yield visual rewards

Wrap-up:

User can take a “Climate Pledge” and share their result

Exit:

Earth zooms out, user encouraged to explore again

7. 🧩 Future Extensions (Optional)

Real-time global events (NASA wildfire, flood, deforestation maps)

User accounts and leaderboard for climate pledges

Localization in multiple languages (English, French, Swahili, Arabic)

Integration with educational NGOs or environmental APIs

8. 🧠 Developer Notes

Follow component-driven architecture with reusable UI parts.

Maintain strict TypeScript types for props and API responses.

Use environment variables for API keys and configuration.

Implement loading skeletons and smooth fallback UI.

Add inline comments explaining logic for key sections.

9. 🪄 Final Goal

Deliver a polished, deployable web application that feels alive — merging AI, 3D visualization, and environmental storytelling into a single interactive experience.
It should impress hackathon judges visually, technically, and emotionally.