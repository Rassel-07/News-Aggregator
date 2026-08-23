# AuraNews — Intelligent News Discovery & Editorial Aggregation Platform

> A fast, information-friendly personalized news discovery platform aggregating legitimate journalism from verified global publishers with multi-source perspective comparison, zero-dependency standalone persistence, and 24-hour inactivity session management.

---

## 1. Architectural Highlights

- **Multi-Source RSS/Atom Aggregation**: Ingests real-time metadata from 50+ verified publishers (*BBC News*, *The Verge*, *TechCrunch*, *Wired*, *Ars Technica*, *The Hindu*, *NDTV*, *NASA*, *ScienceDaily*, *ESPN*, *Polygon*, *Sky Sports*, etc.) across 14 categories without scraping full article bodies.
- **Story Clustering & Deduplication**: Groups near-duplicate coverage of breaking events using Jaccard token similarity ($\ge 0.45$) and a 48-hour time window into unified `StoryCluster` instances so readers can compare perspectives.
- **Personalized Heuristic Ranking Engine**: Scores articles dynamically using exponential freshness decay ($e^{-\text{hoursOld}/18}$), user topic preference boosts ($1.45\times$), country/regional weighting ($1.15\times$), multi-source verification significance, and publisher diversity interleaving (preventing source monopolization).
- **Inactivity-Based 24-Hour Automatic Logout**: Server-side tracking via `lastActivityAt` updated on meaningful user actions (throttled to 5-minute intervals). If $\text{currentTime} - \text{lastActivityAt} > 24\text{ hours}$, authenticated API requests reject with HTTP 401 `SESSION_INACTIVE`, prompting client interceptors to securely clear sessions and display re-authentication notices.
- **Zero-Dependency Standalone Mode**: Ultra-fast in-memory lookup maps paired with debounced local JSON persistence (`backend/data/store.json`), allowing instant local execution and deployment with zero external database dependencies.
- **Modern Editorial Design System**: Custom Vanilla CSS design tokens with font pairing (*Plus Jakarta Sans* + *Newsreader* serif), dark and light theme modes, hero composition grids, and content-shaped skeleton shimmer loaders.
- **Persistent Bookmarks & Instant Search**: Fast bookmarking with optimistic UI updates, debounced instant search, and category/source filters.

---

## 2. Tech Stack

- **Frontend**:
  - **Framework**: React 18
  - **Routing**: React Router v6 (`createBrowserRouter`, `RouterProvider`)
  - **HTTP Client**: Axios (configured with base URL and 24h inactivity response interceptor)
  - **Icons & Formatting**: `react-icons`, `react-time-ago`, `javascript-time-ago`
  - **Styling**: Vanilla CSS Design System (Light/Dark themes, CSS custom properties, responsive grids)
  - **Deployment**: Vercel SPA (`vercel.json`)
- **Backend**:
  - **Runtime**: Node.js
  - **Framework**: Express 4.19
  - **Feed Ingestion**: `rss-parser`
  - **Security & Auth**: `jsonwebtoken` (JWT), `bcryptjs`, `cookie-parser`, `express-rate-limit`, `cors`
  - **Persistence**: Zero-Dependency In-Memory Store with Debounced Local File Persistence (`backend/data/store.json`) + Optional MongoDB / Mongoose support
  - **Testing**: `jest`, `supertest`
  - **Deployment**: Render Web Service (`render.yaml`)

---

## 3. Directory Structure

```text
News-Aggregator/
├── SOURCE_POLICY.md             # Legal attribution & content aggregation policy
├── README.md                    # Project documentation and architecture guide
├── render.yaml                  # Render deployment configuration for backend API
├── vercel.json                  # Vercel deployment configuration for frontend SPA
├── backend/
│   ├── config/
│   │   └── newsSources.js       # Verified registry of 50+ RSS feeds & 14 categories
│   ├── controllers/
│   │   ├── authController.js    # Register, login, session validation, activity ping
│   │   ├── newsController.js    # Feeds, hero, trending, categories, coverage, search
│   │   ├── bookmarkController.js# User saved stories & optimistic sync
│   │   ├── preferenceController.js # Topic interests & theme customization
│   │   └── userProfileController.js # Reader profile & statistics
│   ├── data/
│   │   └── store.json           # Standalone persistent store (users, articles, bookmarks, clusters)
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT & 24-hour inactivity session verification
│   │   ├── rateLimiter.js       # Rate limiting for auth and search
│   │   └── errorMiddleware.js   # Centralized error handling
│   ├── models/
│   │   ├── userModel.js         # Reader model schema & lastActivityAt
│   │   ├── articleModel.js      # Article schema with canonical deduplication
│   │   ├── storyClusterModel.js # Multi-source coverage clusters
│   │   ├── bookmarkModel.js     # User-article bookmark relations
│   │   └── errorModel.js        # HttpError representation
│   ├── services/
│   │   ├── storageService.js    # In-memory fast maps + debounced disk persistence
│   │   ├── normalizer.js        # HTML tag stripping, title cleanup, Jaccard similarity
│   │   ├── rssProvider.js       # Feed parser with image/media extraction & timeout safety
│   │   ├── mockProvider.js      # Fallback fixtures for offline development/tests
│   │   ├── clusteringService.js # Story cluster deduplication & grouping algorithm
│   │   ├── rankingService.js    # Heuristic personalization & source diversity engine
│   │   └── newsIngestionService.js # Periodic ingestion runner with error isolation
│   ├── routes/                  # Express route definitions (auth, news, bookmarks, users, preferences)
│   ├── tests/                   # Automated unit & integration tests
│   └── index.js                 # Express server & scheduled ingestion runner
└── frontend/
    ├── public/index.html        # Modern HTML shell with Google Fonts
    └── src/
        ├── components/          # AppShell, Navbar, NewsCard, StoryModal, Skeleton loaders
        ├── context/             # UserContext with 24h inactivity interceptor & optimistic state
        ├── pages/               # Home, Discover, Category, Search, Saved, StoryOverview, Auth, Profile
        ├── index.css            # Complete editorial CSS design system (Light/Dark)
        └── index.js             # React Router configuration
```

---

## 4. Setup and Running Instructions

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Backend Setup
1. Navigate to `/backend`:
   ```bash
   cd backend
   npm install
   ```
2. Create your `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```
3. Run automated tests:
   ```bash
   npm test
   ```
4. Start the backend server:
   ```bash
   npm start
   # Server will start on http://localhost:5001 (Zero-Dependency Standalone Mode)
   ```

### Frontend Setup
1. Navigate to `/frontend`:
   ```bash
   cd frontend
   npm install
   ```
2. Create your `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```
3. Start the React development server:
   ```bash
   npm start
   # Application will open on http://localhost:3000
   ```

---

## 5. How the 24-Hour Inactivity Logout Works

1. **Server-Side Timestamp**:
   - The user record maintains a `lastActivityAt` timestamp.
   - When a user logs in or registers, `lastActivityAt` is initialized to the current time.
2. **Authenticated Request Verification**:
   - On every protected request, `authMiddleware` checks:
     $$\text{currentTime} - \text{user.lastActivityAt} > 24\text{ hours}$$
   - If greater than 24 hours (86,400,000 ms), the session is rejected with HTTP `401 Unauthorized`:
     ```json
     {
       "message": "Your session expired after 24 hours of inactivity. Please sign in again.",
       "code": "SESSION_INACTIVE"
     }
     ```
3. **Throttled Updates**:
   - If the user is active, `lastActivityAt` is updated at most once every 5 minutes, eliminating write overhead on frequent requests.
4. **Client Interceptor & Notification**:
   - An Axios response interceptor intercepts `SESSION_INACTIVE`, clears local authentication state, and displays a friendly notice prompting the user to sign back in.

---

## 6. Sourcing & Legal Compliance

AuraNews strictly complies with legal discovery and fair aggregation principles:
- **No Full-Text Scraping**: Only RSS headlines, metadata summaries, and publisher links are ingested.
- **Prominent Attribution**: Every card displays verified publisher badges and domain metadata.
- **Direct Outbound Journalism Links**: Readers can click through directly (`target="_blank" rel="noopener noreferrer"`) to the original publication.
- For full details, see [SOURCE_POLICY.md](./SOURCE_POLICY.md).
