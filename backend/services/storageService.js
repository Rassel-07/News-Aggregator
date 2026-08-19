/**
 * Standalone Zero-Dependency Persistent Storage Service
 * 
 * Completely independent of external MongoDB databases.
 * Stores Users, Bookmarks, Preferences, Clusters, and Articles in memory
 * and persists to local JSON storage (backend/data/store.json).
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, '..', 'data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-Memory storage maps
const store = {
  articles: new Map(), // canonicalUrl -> Article
  clusters: new Map(), // clusterId -> StoryCluster
  users: new Map(),    // email -> User
  bookmarks: new Map() // userId:articleId -> Bookmark
};

/**
 * Generate unique ID
 */
function generateId() {
  return crypto.randomBytes(12).toString('hex');
}

/**
 * Load store from disk on startup
 */
function loadStore() {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const raw = fs.readFileSync(STORE_FILE, 'utf8');
      const data = JSON.parse(raw);

      if (data.users && Array.isArray(data.users)) {
        for (const u of data.users) {
          store.users.set(u.email.toLowerCase(), u);
        }
      }

      if (data.bookmarks && Array.isArray(data.bookmarks)) {
        for (const b of data.bookmarks) {
          store.bookmarks.set(`${b.userId}:${b.articleId}`, b);
        }
      }

      if (data.articles && Array.isArray(data.articles)) {
        for (const a of data.articles) {
          store.articles.set(a.canonicalUrl, a);
        }
      }

      if (data.clusters && Array.isArray(data.clusters)) {
        for (const c of data.clusters) {
          store.clusters.set(c._id, c);
        }
      }

      console.log(`[Storage] Loaded persistent store: ${store.articles.size} articles, ${store.users.size} users, ${store.bookmarks.size} bookmarks.`);
    }
  } catch (err) {
    console.warn('[Storage] Notice loading store:', err.message);
  }
}

/**
 * Save store to disk (throttled)
 */
let saveTimeout = null;
function persistStore() {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    try {
      const serializable = {
        users: Array.from(store.users.values()),
        bookmarks: Array.from(store.bookmarks.values()),
        articles: Array.from(store.articles.values()).slice(-3000), // keep latest 3000 articles
        clusters: Array.from(store.clusters.values()).slice(-500)
      };
      fs.writeFileSync(STORE_FILE, JSON.stringify(serializable, null, 2), 'utf8');
    } catch (err) {
      console.warn('[Storage] Error persisting store to disk:', err.message);
    }
  }, 1000);
}

// Initial load
loadStore();

/**
 * Save or update article
 */
async function saveArticle(articleData) {
  let existing = store.articles.get(articleData.canonicalUrl);
  if (!existing) {
    const id = articleData._id || generateId();
    const doc = {
      _id: id,
      ...articleData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    store.articles.set(articleData.canonicalUrl, doc);
    persistStore();
    return doc;
  }
  return existing;
}

/**
 * Find articles with query filters, sorting, and pagination
 */
async function findArticles(query = {}, options = {}) {
  const { sort = { publishedAt: -1 }, limit = 20, skip = 0 } = options;
  let results = Array.from(store.articles.values());

  if (query.category && query.category !== 'All') {
    const catRegex = new RegExp(query.category, 'i');
    results = results.filter(a => catRegex.test(a.category));
  }

  if (query.sourceName && query.sourceName !== 'All') {
    const srcRegex = new RegExp(query.sourceName, 'i');
    results = results.filter(a => srcRegex.test(a.sourceName));
  }

  if (query.$or) {
    results = results.filter(a => {
      return query.$or.some(condition => {
        if (condition.title) return condition.title.test(a.title);
        if (condition.description) return condition.description.test(a.description);
        if (condition.sourceName) return condition.sourceName.test(a.sourceName);
        if (condition.category) return condition.category.test(a.category);
        return false;
      });
    });
  }

  if (query.publishedAt && query.publishedAt.$gte) {
    const gteTime = new Date(query.publishedAt.$gte).getTime();
    results = results.filter(a => new Date(a.publishedAt).getTime() >= gteTime);
  }

  // Sort
  results.sort((a, b) => {
    const timeA = new Date(a.publishedAt).getTime();
    const timeB = new Date(b.publishedAt).getTime();
    return sort.publishedAt === 1 ? timeA - timeB : timeB - timeA;
  });

  return results.slice(skip, skip + limit);
}

/**
 * Count articles
 */
async function countArticles(query = {}) {
  const matches = await findArticles(query, { limit: 100000, skip: 0 });
  return matches.length;
}

/**
 * Find single article by ID
 */
async function findArticleById(id) {
  if (!id) return null;
  for (const article of store.articles.values()) {
    if (article._id.toString() === id.toString()) {
      return article;
    }
  }
  return null;
}

/**
 * Find clusters
 */
async function findClusters(query = {}, options = {}) {
  const { limit = 10 } = options;
  return Array.from(store.clusters.values())
    .sort((a, b) => (b.sourceCount || 1) - (a.sourceCount || 1))
    .slice(0, limit);
}

/**
 * Save or update cluster
 */
async function saveCluster(clusterData) {
  const id = clusterData._id || generateId();
  const doc = {
    ...clusterData,
    _id: id,
    updatedAt: new Date()
  };
  store.clusters.set(id, doc);
  persistStore();
  return doc;
}

module.exports = {
  generateId,
  saveArticle,
  findArticles,
  countArticles,
  findArticleById,
  findClusters,
  saveCluster,
  persistStore,
  store,
  memStore: store
};
