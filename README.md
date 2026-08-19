# AuraNews — Intelligent News Discovery & Editorial Aggregation Platform

> A fast, information-friendly personalized news discovery platform aggregating legitimate journalism from verified global publishers with multi-source perspective comparison and 24-hour inactivity session management.

---

## 1. Architectural Highlights

- **Multi-Source RSS/Atom Aggregation**: Ingests real-time metadata from configured legitimate publishers (*BBC News*, *Reuters*, *The Verge*, *TechCrunch*, *Wired*, *Ars Technica*, *The Hindu*, *NDTV*, *NASA*, *ScienceDaily*, *ESPN*, *Polygon*, etc.) without scraping full article bodies.
- **Story Clustering & Deduplication**: Detects near-duplicate coverage of breaking events using Jaccard token similarity and canonical URL matching. Groups coverage into `StoryCluster` instances so readers can compare perspectives.
- **Personalized Ranking Engine**: Heuristic ranking incorporating exponential freshness decay, user topic preference boosts, multi-source significance weighting, and publisher diversity interleaving.
- **Inactivity-Based 24-Hour Automatic Logout**: Server-side tracking via `lastActivityAt` updated on meaningful user actions (throttled to 5-minute intervals). If `currentTime - lastActivityAt > 24 hours`, authenticated API requests reject with HTTP 401 `SESSION_INACTIVE`, clearing client sessions and presenting friendly re-authentication notifications.
- **Modern Editorial Design System**: Custom Vanilla CSS with font pairing (*Plus Jakarta Sans* + *Newsreader* serif), dark and light theme modes, hero composition grids, and content-shaped skeleton shimmer loaders.
- **Persistent Bookmarks & Instant Search**: Compound-indexed MongoDB bookmarks with optimistic UI and debounced search with category/date filters.

---

## 2. Tech Stack

- **Backend**: Node.js, Express, MongoDB / Mongoose, `rss-parser`, `jsonwebtoken`, `bcryptjs`, `express-rate-limit`, `cookie-parser`, `jest`, `supertest`.
- **Frontend**: React 18, React Router v6, Axios, React Icons, Vanilla CSS Design System.

---

## 3. Directory Structure

```text
News-Aggregator/
├── SOURCE_POLICY.md             # Legal attribution & content aggregation policy
├── .env.example                 # Root environment variables reference
├── backend/
│   ├── config/
│   │   └── newsSources.js       # Central registry of configured RSS feeds & categories
│   ├── controllers/
│   │   ├── authController.js    # Register, login, session validation, activity ping
│   │   ├── newsController.js    # Feeds, hero, trending, categories, coverage, search
│   │   ├── bookmarkController.js# User saved stories & optimistic sync
│   │   ├── preferenceController.js # Topic interests & theme customization
│   │   └── userProfileController.js # Reader profile & statistics
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT & 24-hour inactivity session verification
│   │   ├── rateLimiter.js       # Rate limiting for auth and search
│   │   └── errorMiddleware.js   # Centralized error handling
│   ├── models/
│   │   ├── userModel.js         # Reader model with preferences & lastActivityAt
│   │   ├── articleModel.js      # Indexed article schema with canonical deduplication
│   │   ├── storyClusterModel.js # Multi-source coverage clusters
│   │   └── bookmarkModel.js     # User-article bookmark relations
│   ├── services/
│   │   ├── normalizer.js        # HTML tag stripping, title cleanup, Jaccard similarity
│   │   ├── rssProvider.js       # Robust feed parser with image/media extraction
│   │   ├── mockProvider.js      # Fallback fixtures for offline development/tests
│   │   ├── clusteringService.js # Story cluster deduplication & grouping
│   │   ├── rankingService.js    # Heuristic personalization & source diversity
│   │   └── newsIngestionService.js # Periodic ingestion runner with error isolation
│   ├── routes/                  # Express route definitions
│   ├── tests/                   # Automated unit & integration tests
│   └── index.js                 # Express server & scheduled ingestion runner
└── frontend/
    ├── public/index.html        # Modern HTML shell with Google Fonts
    └── src/
        ├── components/          # Reusable editorial components & skeletons
        ├── context/             # UserContext with 24h inactivity interceptor
        ├── pages/               # Home, Discover, Category, Search, Saved, StoryOverview, Auth
        ├── index.css            # Complete editorial CSS design system (Light/Dark)
        └── index.js             # React Router configuration
```

---

## 4. Setup and Running Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (local instance running on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI)

### Backend Setup
1. Open a terminal in `/backend`:
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
   # Server will start on http://localhost:5001
   ```

### Frontend Setup
1. Open a new terminal in `/frontend`:
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
   # Application opens on http://localhost:3000
   ```

---

## 5. How the 24-Hour Inactivity Logout Works

1. **Server-Side Timestamp**:
   - The `User` MongoDB document maintains a `lastActivityAt` date field.
   - When a user logs in, `lastActivityAt` is initialized to the current time.
2. **Authenticated Request Verification**:
   - On every protected request, `authMiddleware` checks:
     $$\text{currentTime} - \text{user.lastActivityAt} > 24\text{ hours}$$
   - If greater than 24 hours (86,400,000 ms), the session is rejected with HTTP `401 Unauthorized` and payload:
     ```json
     {
       "message": "Your session expired after 24 hours of inactivity. Please sign in again.",
       "code": "SESSION_INACTIVE"
     }
     ```
3. **Throttled Database Updates**:
   - If the user is active, `lastActivityAt` is updated in MongoDB at most once every 5 minutes, preventing excessive write overhead on high-frequency requests.
4. **Client Interceptor & Notification**:
   - An Axios response interceptor intercepts `SESSION_INACTIVE`, clears local authentication state, and redirects the user to `/login?reason=inactive`, displaying a friendly toast notice.

---

## 6. Sourcing & Legal Compliance

AuraNews strictly complies with legal discovery and fair aggregation principles:
- No full article text reproduction.
- Prominent source badges on every story.
- Direct outbound links (`target="_blank" rel="noopener noreferrer"`) to original publisher journalism.
- For full details, see [SOURCE_POLICY.md](./SOURCE_POLICY.md).
