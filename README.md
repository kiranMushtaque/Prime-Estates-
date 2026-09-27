# Meridian Estates — Luxury Coastal Real Estate Showcase

An immersive, cinematic real estate showcase web application designed for ultra-luxury coastal properties in the fictional seaside enclave of **Azure Bay**. Built with React 19, TypeScript, Vite, Tailwind CSS v4, GSAP ScrollTrigger, and Lenis smooth scrolling.

---

## 1. Project Overview

### What is this?
**Meridian Estates** is a high-concept, photo-based architectural real estate showcase website. It is designed to demonstrate what a modern ultra-luxury real estate portal can look and feel like when combining editorial typography, cinematic video transitions, procedural ambient soundscapes, 3D mouse physics, and generative AI concierge assistance.

### Who is it for?
- **Architectural Developers & Luxury Agencies**: Looking for an experiential digital presentation to showcase flagship penthouses, cliffside villas, and sovereign coastal estates.
- **Designers & Engineers**: Demonstrating high-performance scroll storytelling, Web Audio synthesis, GSAP 3D transforms, and fluid micro-interactions.
- **Prospective Buyers & Investors**: Offering an interactive spatial walkthrough and analytical financial assessment before booking a private consultation.

### ⚠️ Important Notice — Entirely Fictional Data
This is a **concept demonstration website**. All data featured throughout the application is fictional:
- **Agency**: "Meridian Estates" is a fictional brokerage brand.
- **Location**: "Azure Bay" and its enclaves (Coral Ridge, Marina Crest, Palm Heights, Old Harbour) are fictional coastal geographies.
- **Properties & Pricing**: All residences, specifications, and prices (quoted in Pakistani Rupee Crores and USD equivalents) are fictional placeholders.
- **Agents & Testimonials**: All agent names, client reviews, press publications, and contact numbers (`+92 300 0000000`) are for demonstration purposes only.

---

## 2. Tech Stack & Dependencies

| Layer | Library / Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | **React** | `^19.0.1` | Modern concurrent component architecture |
| **Language** | **TypeScript** | `^7.0.2` | Strong type safety across data models & UI props |
| **Build Tool** | **Vite** | `^8.3.0` | Next-generation fast ES module dev server & bundler |
| **Styling** | **Tailwind CSS v4** | `^4.3.3` | Next-gen CSS framework with `@import "tailwindcss"` |
| **Animations** | **GSAP** | `^3.15.0` | Core motion engine |
| **Scroll Engine** | **GSAP ScrollTrigger** | `^3.15.0` | Pinned 600vh photographic walkthrough scroll staging |
| **Layout Morph** | **GSAP Flip** | `^3.15.0` | Seamless property card filter animations |
| **Smooth Scroll** | **Lenis** | `^1.3.26` | Momentum-based physics smooth scrolling |
| **Audio Engine** | **Web Audio API** | Native | Procedural crystal chimes & atmospheric spatial noise |
| **Icons** | **Lucide React** | `^0.546.0` | High-definition architectural icons |
| **AI Integration** | **@google/genai** | `^2.4.0` | Gemini API client with offline heuristic concierge fallback |
| **Server (Optional)** | **Express & tsx** | `^4.21.2` | Full-stack production serving & proxying capabilities |

---

## 3. Full Page Structure (Section by Section)

The single-page application is structured as a continuous architectural expedition from aerial construction down to fine interior details:

### 0. Cinematic Genesis Intro (`GenesisIntro.tsx`)
- **What it does**: A full-screen 4K construction-reveal video that plays automatically on a visitor's very first visit per session (stored in `sessionStorage`).
- **Telemetry**: Displays subtle gold phase indicators (`PHASE 01 // TOPOGRAPHICAL SITE GRID` through `PHASE 05 // THE CLIFFSIDE SANCTUARY`), a cinema audio toggle, a quick `Skip` action, and concludes with the headline *"Built for those who arrive."* before handing off to the walkthrough.

### Persistent Header: Floating Glassmorphism Navbar (`Navbar.tsx`)
- **Monogram Wordmark & Availability Pill**: Features the Meridian "M" seal and live enclave inventory status (`Azure Bay · 4 Sanctuaries Available`).
- **Live Search Bar (`NavbarSearch.tsx`)**: Quick fuzzy search by residence name, price, or district.
- **Full-Width Mega Menu (`.navbar-mega-menu`)**: Hovering over "Residences" deploys a 52px frosted-glass panel with staggered category typologies, neighborhood photo cards, spotlight residence preview, and direct advisory links.
- **Saved Indicator & Book Viewing CTA**: Dynamic favorite counter badge and magnetic viewing button.
- **Scroll Progress Line**: Real-time reading depth indicator along the bottom navbar border.

### Section 1: The Pinned Photo Walkthrough (`PhotoWalkthrough.tsx`)
A ~600vh pinned stage that takes the visitor on a virtual tour through **The Cliffside Villa**:
1. **01 · Exterior**: Cliffside seafront villa at sunset with cantilevered lap pool and stone architecture.
2. **02 · Entrance**: 12ft architectural pivot teak door with quartzite gallery foyer.
3. **03 · Living Room**: Double-height salon with floor-to-ceiling panoramic ocean glass.
4. **04 · Chef's Kitchen**: Culinary atelier with Calacatta quartz island and fluted oak joinery.
5. **05 · Master Suite**: Ocean-facing sanctuary with private horizon balcony and wool rugs.
6. **06 · Spa Bathroom**: Travertine suite with freestanding soaking tub overlooking the bay.
7. **07 · Sunset Terrace**: Ocean pool deck with acquisition specs (PKR 28.5 Crore · 5 Beds · 4,800 sq ft) and the interactive Sun Path Simulator.
- **Walkthrough Controls**: Includes an Experience Toolbar with **Cinematic Reel Fullscreen Modal**, a **45-second Auto-Tour**, and a **Web Audio Ambient Toggle**.

### Section 2: Property Typologies (`PropertyTypes.tsx`)
- Showcases the 4 core architectural sectors:
  - **Coastal Villas**: Seafront mansions & cliffside estates (PKR 24 Cr – 65 Cr)
  - **Sky Residences**: High-altitude penthouses & duplex suites (PKR 12 Cr – 35 Cr)
  - **Prime Plots**: Custom oceanfront land parcels (PKR 8 Cr – 28 Cr)
  - **Commercial Hubs**: Boutique maritime offices & retail galleries (PKR 15 Cr – 80 Cr)
- Features interactive 3D cursor tilt with parallax gold glare and instant portfolio filtering.

### Section 3: Materials & Finishes Showcase (`MaterialsFinishes.tsx`)
- Interactive tactile library inspecting raw building finishes:
  - **Roman Travertine**, **Burmese Teak**, **Calacatta Quartzite**, **Fluted Acoustic Glass**, **Volcanic Basalt**, and **Brushed Champagne Brass**.
- Displays extraction provenance, durability ratings, application zones, and high-resolution zoomable macro imagery.

### Section 4: Designer Lookbook (`DesignerLookbook.tsx`)
- Editorial magazine-style spreads highlighting interior staging philosophies, lighting design, private wine cellars, and custom architectural millwork.

### Section 5: Featured Listings Carousel (`FeaturedListings.tsx`)
- Horizontal snap-scrolling showcase of premier turnkey residences with bedrooms, bathrooms, and square footage.
- **Enhanced Motion**: Equipped with context-aware **GSAP 3D magnetic tilt**, specular cursor tracking, and **GSAP Flip** animations when filtering by enclave or search term.
- Includes a comprehensive **Property Details Modal** with verified title clearance, amenity chips, and WhatsApp inquiry buttons.

### Section 6: Interactive Territory Coastline Map (`CityMap.tsx`)
- Vector GIS map depicting the coastline of Azure Bay.
- Animated pulsating topographical pins for **Coral Ridge**, **Marina Crest**, **Palm Heights**, **Azure Bay Airport**, and **Old Harbour District** with live travel times and coordinates.

### Section 7: Enclaves & Geography (`Neighborhoods.tsx`)
- Split-screen visual journey exploring Azure Bay's micro-districts.
- Displays average price per kanal, transit times to private airports, waterfront promenade lengths, and high-res photography.

### Section 8: Track Record & Agency Stats (`Stats.tsx`)
- Animated count-up statistics validating transaction volume:
  - **PKR 160B+** Acquisition Volume
  - **500+** Sovereign Residences Sold
  - **98.4%** Client Retention
  - **100%** CDA Verified Clear Escrow

### Section 9: Dual-Currency EMI & Mortgage Calculator (`EmiCalculator.tsx`)
- Real-time loan amortization calculator.
- Adjust property price, down payment percentage (10% to 50%), loan tenure (5 to 30 years), and interest rates.
- Automatically computes monthly installment, total interest payable, and total cost with live toggle between **PKR (Crores)** and **USD ($)**.

### Section 10: Global Benchmark Matrix (`BenchmarkMatrix.tsx`)
- Institutional-grade financial comparison table contrasting Azure Bay's capital appreciation and rental yield against prime global benchmarks:
  - **Azure Bay (Coral Ridge)** vs. **Dubai (Palm Jumeirah)**, **Singapore (Sentosa Cove)**, and **London (Mayfair)**.
  - Highlights price per square foot, gross rental yield (6.8%), and capital growth trends.

### Section 11: Private Wealth Advisory Desk (`ContactViewing.tsx`)
- Profiles of senior managing partners and wealth advisors specializing in discrete family office acquisitions.

### Section 12: Client Testimonials & Sovereign Reviews (`ContactViewing.tsx`)
- Verified quotes from family office principals, luxury architectural critics, and private wealth managers.

### Section 13: Frequently Asked Questions (FAQ) (`ContactViewing.tsx`)
- Accordion-based answers covering Overseas Pakistani remittances, title deeds, CDA verification, construction guarantees, and escrow mechanisms.

### Section 14: Private Consultation & Viewing Booking (`ContactViewing.tsx`)
- Confidential viewing schedule form with date selection, preferred communication channel (Phone / WhatsApp / In-Person), and automated reference code generation.

### Section 15: Footer (`Footer.tsx`)
- Official registration numbers, enclave index, legal copyright, and prominent demo disclaimer.

### Persistent Global Widgets
- **Custom Gold Cursor & Spotlight (`CustomCursor.tsx`)**: Dual-tier physics cursor with an ambient radial flashlight illuminating dark interior photographs on desktop.
- **AI Architectural Concierge (`AIConcierge.tsx`)**: Floating chat assistant in the bottom right corner with suggested prompt pills and smart offline answering.
- **Scroll to Top (`ScrollToTop.tsx`)**: Floating gold arrow at the bottom-left edge for instant return to top.

---

## 4. Key Interactive Features Explained

1. **Auto-Tour (45s Automated Journey)**:
   - Located in the walkthrough toolbar. Clicking **"Tour"** triggers a smoothly interpolated programmatic scroll through all 7 rooms with auto-playing room narrations. Pressing **"Stop"** or manually scrolling releases control back to the user instantly.

2. **Sun Path Celestial Simulator**:
   - On the Sunset Terrace (Room 07), visitors can toggle between **Dawn**, **Midday**, **Golden Hour**, and **Twilight**. The terrace lighting, sky exposure, and shadow tones crossfade to illustrate orientation relative to the setting sun.

3. **Room Hotspots**:
   - Interactive glowing gold markers located in the Living Room, Kitchen, and Terrace. Hovering or clicking reveals architectural material tags (e.g., *"Calacatta Marble Island — Bookmatched Italy"* or *"12ft Pivot Mechanism"*).

4. **Web Audio Soundscape Engine**:
   - Features zero external MP3 dependencies. Uses native Web Audio oscillators to proceduralize soft bandpass air whooshes and celestial pentatonic crystal chimes when crossing room boundaries.

5. **GSAP 3D Magnetic Tilt**:
   - Featured property cards calculate mouse distance from card center in real-time, subtly pitching up to ±5.5° and translating up to ±7px toward the cursor with a moving specular gold highlight.

6. **AI Concierge with Offline Heuristic Fallback**:
   - Connects to Google's Gemini Flash model when an API key is provided.
   - If offline or unconfigured, an intelligent heuristic engine answers common questions regarding property prices, enclaves, tax incentives, and booking procedures without crashing.

---

## 5. Known Limitations Before Production Use

To deploy this project as a real commercial enterprise website, the following items must be resolved:

1. **No Backend Database or Authentication**:
   - Viewing booking requests and saved favorites are stored in browser memory/session only. They are not persisted to a database (e.g., PostgreSQL, MongoDB, or Firestore).
2. **AI Concierge API Key**:
   - Live Gemini responses require configuring `VITE_GEMINI_API_KEY` or hosting an authenticated backend proxy route (`/api/chat`).
3. **Fictional Data & Placeholder Contacts**:
   - All properties, prices, phone numbers (`+92 300 0000000`), agent headshots, and enclave names must be replaced with verified real estate assets and licensed broker information.
4. **Static Email & Lead Capture**:
   - The booking form generates a reference ID locally; it must be hooked into an email service (SendGrid, Resend) or CRM (HubSpot, Salesforce).
5. **Asset Hosting**:
   - Walkthrough images and the Genesis reveal video are served from the local `/assets` directory. For a production site with global traffic, these should be hosted on a global Edge CDN (Cloudflare R2, AWS CloudFront).

---

## 6. Recommended Next Steps for Production

- [ ] **Database & CRM Integration**: Integrate a PostgreSQL/Cloud SQL or Supabase backend to persist viewing appointments and visitor inquiries.
- [ ] **Headless CMS Setup**: Connect Sanity, Strapi, or Contentful so real estate brokers can publish, edit, and archive listings without code edits.
- [ ] **3D Floor Plan / Matterport Embeds**: Add embedded 3D digital twins (Matterport or Three.js/WebGL spatial viewer) into the Property Details Modal.
- [ ] **Multi-Currency Converter**: Integrate live exchange rates (EUR, GBP, AED, USD) via a financial API.
- [ ] **Multi-Language Support (i18n)**: Implement English, Arabic, and Urdu localization for international family offices.
- [ ] **SEO & Meta Tags**: Add dynamic OpenGraph cards and Schema.org `RealEstateListing` structured data.

---

## 7. How to Run the Project Locally

### Prerequisites
- **Node.js**: Version `18.0.0` or higher
- **npm** or **pnpm** / **yarn**

### Installation
Clone the repository and install all dependencies:
```bash
# Clone the repository
git clone <repository-url>
cd meridian-estates

# Install dependencies
npm install
```

### Development Server
Run the local development server:
```bash
npm run dev
```
The application will launch at:
```
http://localhost:3000
```

### Production Build
To create an optimized, minified production build:
```bash
npm run build
```
To preview the production build locally:
```bash
npm run preview
```

### Code Quality & Type Checking
To run the TypeScript linter:
```bash
npm run lint
```

---

## 8. License & Attribution

Designed and engineered for **Meridian Estates Architectural Advisory**. All photography and architectural renders are used strictly for concept and evaluation purposes.
