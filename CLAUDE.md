# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🌟 **STRATEGIC NORTH STAR**

**📋 All development decisions should align with our strategic roadmap: [`STRATEGIC_ROADMAP.md`](./STRATEGIC_ROADMAP.md)**

This roadmap outlines our transformation from a generic idea platform into **Korea's first regulatory intelligence & expert network platform**. Before implementing any features, review the roadmap to ensure alignment with our 90-day strategic goals.

---

## Project Overview

IdeaOasis is evolving from a Korean business idea platform into **Korea's essential business intelligence platform** - the definitive resource for entrepreneurs to navigate Korean regulatory landscape and access expert insights.

### **Strategic Evolution: Generic Ideas → Korean Business Intelligence**

| Phase | Focus | Timeline |
|-------|-------|----------|
| **MVP** (Current) | Basic idea curation with Korea Fit scoring | Completed |
| **Phase 1** (Days 1-30) | Expert network building + regulatory intelligence | In Progress |
| **Phase 2** (Days 31-60) | Content authority + community building | Planned |
| **Phase 3** (Days 61-90) | Monetization + expert marketplace | Planned |

### **New Core Mission** 
Transform from "Korean business idea discovery" to **"Preventing business failures in Korea through regulatory intelligence and expert validation"**

### **Strategic Differentiators**:
- **Regulatory Intelligence First**: Real-time Korean government policy monitoring with automated alerts
- **50+ Korean Expert Network**: Direct access to validated business expertise (vs. AI-generated content)
- **Regulatory Risk Scoring**: Proprietary 0-100 system preventing compliance failures
- **Expert-Validated Insights**: Every idea validated by Korean business experts through video analysis
- **Community-Driven Intelligence**: Peer-to-peer regulatory knowledge sharing platform

## Development Commands

### Core Development
- **Start dev server**: `npm run dev` (runs on port 3000)
- **Build production**: `npm run build`
- **Start production**: `npm start`
- **Pre-deploy checks**: `npm run predeploy:check`
- **Vercel build**: `npm run vercel-build` (includes predeploy checks)

### Testing & Validation
- **Run predeploy script**: `node scripts/predeploy.mjs`
- **Test ingest API**: Use `scripts/test-ingest.http` with your HTTP client

## Architecture & Key Patterns

### Feature-First Architecture
The codebase follows a Feature-First architecture as defined in `.cursorrules`. Key principles:

- **Features** (`features/`): Independent, reusable business modules with UI/API/Model/Lib structure
- **App** (`app/`): Next.js App Router pages that compose Features
- **Shared** (`shared/`): Global utilities, layouts, and common UI components
- **Components** (`components/ui/`): External UI library components (shadcn/ui) - never modify directly

### Project Structure
```
features/[feature]/     # Feature modules with ui/, api/, model/, lib/, index.ts
shared/                 # Global shared systems
├── ui/components/      # Common UI components
├── ui/layouts/         # Reusable layout components  
├── lib/               # Utilities, API client, types, hooks
└── config/            # Environment configuration
app/                   # Next.js App Router pages
├── api/               # API routes
├── (auth)/            # Route groups by functionality
└── ideas/[id]/        # Dynamic routing
components/ui/         # shadcn/ui components (DO NOT MODIFY)
lib/                   # Core business logic (db, types, utils)
```

### Database & State Management
- **Data Layer**: In-memory storage with Firestore migration path (`lib/db.ts`)
- **Type System**: Centralized types in `lib/types.ts` and `shared/lib/types.ts`
- **State**: Feature-level state in `features/*/model/`, global state in `shared/lib/`

### Authentication & Security
- **Auth Provider**: Google OAuth only (`NEXT_PUBLIC_ADMIN_EMAILS` for admin access)
- **API Security**: Bearer token authentication for ingest APIs (`INGEST_TOKEN`)
- **Firebase**: Client config in `shared/lib/firebase.ts`, admin in `lib/firebaseAdmin.ts`

## Data Model & Evaluation Framework

The core `Idea` type supports a comprehensive evaluation system based on IdeaOasis's guiding principles:

### Core Fields
- **Basic**: `id`, `title`, `sourceUrl`, `summary3`, `tags[]`
- **Evaluation Scores**: `koreaFit` (0-10), `effort` (1-5), `votesUp/Down` 
- **Multi-Dimensional Metrics**: `marketOpportunity`, `executionDifficulty`, `revenuePotential`, `timingScore`, `regulatoryRisk`
- **Korean Context**: `whyNow`, `risks[]`, `partnershipStrategy[]`, `trendData`

### Seven-Dimensional Evaluation System
Each idea is assessed across standardized dimensions to reduce subjective bias:

1. **Opportunity Size**: Market potential in Korean context
2. **Problem Severity**: How urgent/painful the problem is for Korean users
3. **Feasibility**: Technical and business viability given Korean constraints
4. **Timing ("Why Now")**: Market readiness and trend momentum
5. **Revenue Potential**: Monetization pathways suited to Korean consumer behavior
6. **Go-to-Market Difficulty**: Regulatory barriers, competition, distribution challenges
7. **Founder Fit**: Required skills, network, and cultural understanding

### Korean Cultural Adaptations
- **Respectful Feedback**: Private/anonymized critique to avoid public embarrassment
- **Hierarchical Considerations**: Emphasis on building credibility and chaebol partnerships
- **Risk-Averse Approach**: Conservative scoring with clear uncertainty indicators

## API Endpoints

### Ingest API (`/api/ingest-bulk`)
- **Authentication**: Bearer token via `x-ingest-token` header
- **Single item**: JSON object with idea properties
- **Batch import**: Array of idea objects
- **Upsert logic**: Creates new or updates existing ideas by `sourceURL`

### Required Environment Variables
```bash
# Firebase Client (NEXT_PUBLIC_*)
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_ADMIN_EMAILS

# Firebase Admin SDK
FIREBASE_PROJECT_ID
FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY

# API Security
INGEST_TOKEN
```

## UI Component Guidelines

### Mobile-First Korean UX Principles
Following IdeaOasis's mobile-first strategy for Korea's smartphone-heavy usage patterns:

- **Dense Information Cards**: Summarize key metrics on cards with drill-down details
- **Touch-Optimized Interface**: Larger tap targets, swipe gestures, thumb-friendly navigation
- **Fast Loading**: Optimize for Korean mobile networks and data usage patterns
- **Intuitive Hierarchy**: Clear information architecture respecting Korean reading patterns

### shadcn/ui Integration
- **Never modify** `components/ui/` files directly (CLI-managed)
- **Extend components** in `shared/ui/components/` by wrapping shadcn components
- **Theme system** uses CSS variables compatible with shadcn design tokens
- **Standard props**: All components must support `className` and `{...props}` forwarding

### Styling Patterns
1. **Theme variables** (primary): `bg-primary`, `text-foreground`
2. **CVA patterns** (system): Component variants using class-variance-authority
3. **Arbitrary values** (exceptions): `w-[300px]` for special cases only

### Layout Principles
- **Mobile-first responsive**: Design for Korean smartphone usage first
- **Relative positioning first**: Use Flexbox/Grid instead of absolute positioning
- **Information density**: Balance between readability and information richness
- **Consistent spacing**: Use Tailwind's spacing scale (space-4, gap-6, etc.)

## Development Workflow

### Adding Features
1. Create feature in `features/[name]/` with proper structure
2. Export public API via `features/[name]/index.ts`
3. Import features in app pages, never direct internal file access
4. Use shared utilities from `shared/lib/` for common functionality

### Styling New Components
1. Start with shadcn/ui base components from `@/components/ui`
2. Create custom wrappers in `shared/ui/components/` if needed
3. Follow theme variable system for consistent colors/spacing
4. Always support `className` prop for external customization

### Database Changes
1. Update type definitions in `lib/types.ts`
2. Modify database functions in `lib/db.ts`
3. Update ingest API mapping in `app/api/ingest-bulk/route.ts`
4. Test with both in-memory and eventual Firestore implementation

## Product Development Guidelines

### Core Feature Implementation Priorities

Based on IdeaOasis's long-term vision, implement features in this order:

1. **MVP Phase**: Basic idea curation with simple evaluation metrics
2. **Analytics Phase**: Trend data integration (Naver Search API, community signals)
3. **Personalization Phase**: User bookmarking, recommendations, notifications
4. **Advanced Phase**: Execution roadmaps, value ladders, API access

### Korean Market Context for Development

- **Regulatory Awareness**: Consider Korean business regulations when designing features
- **Cultural Sensitivity**: Implement feedback systems that respect Korean harmony values
- **Local Data Sources**: Plan integrations with Naver DataLab, KakaoTalk, Korean forums
- **Business Network Focus**: Design features supporting chaebol partnerships and credibility building

### Monetization Implementation Strategy

Implement tiered subscription model gradually:
- **Free Tier**: Basic browsing and high-level metrics (current MVP)
- **Premium Tier**: Full analytics, execution guides, data downloads (~₩10,000-20,000/month)
- **Enterprise Tier**: API access, trend exports, custom research for corporations

## Deployment Notes

- **Vercel deployment**: Use `vercel-build` script (includes predeploy checks)
- **Environment setup**: Configure all required env vars in Vercel dashboard
- **Firestore rules**: Deploy `firestore.rules` to Firebase project
- **Build validation**: Predeploy script checks for required files and builds project

## Key Files to Understand

- `lib/types.ts` - Core data models including seven-dimensional evaluation system
- `lib/db.ts` - Database abstraction layer with Firestore migration path
- `shared/lib/firebase.ts` - Firebase client configuration
- `app/api/ingest-bulk/route.ts` - Webhook API for data ingestion with Korean context mapping
- `.cursorrules` - Comprehensive Feature-First architecture guidelines
- `scripts/predeploy.mjs` - Build validation and deployment checks

## Development Philosophy

### Contrarian Thinking & Risk Assessment
- **Encourage unconventional ideas**: Highlight emerging opportunities outside mainstream Korean industries
- **Balanced evaluation**: Provide realistic challenge assessments while fostering experimentation
- **Data-driven confidence**: Use objective metrics to help risk-averse founders feel comfortable taking action

### Cultural Integration Principles
- **Respectful but honest feedback**: Direct assessments delivered through private/anonymized channels
- **Hierarchical business awareness**: Features should support building credibility and forming strategic alliances
- **Iterative MVP approach**: Build incrementally, gather Korean user feedback, adapt accordingly

### Future Expansion Vision
- **Beyond U.S. ideas**: Plan for curating ideas from Japan, Southeast Asia with comparative analyses
- **Community-driven discovery**: Automated analysis of Korean social channels for unmet pain points
- **Local ecosystem integration**: Deep partnerships with Korean accelerators, government programs, chaebol innovation units