/**
 * News Sources Configuration Registry
 *
 * All feeds below are VERIFIED LIVE as of Aug 2026.
 * Dead feeds (Reuters, AP, Bleacher, Politico, HBR, Inc, Nature, Scroll.in etc.) are excluded.
 * Google News RSS feeds pull real browser trending stories.
 */

const CATEGORIES = [
  'Technology',
  'AI',
  'Science',
  'Business',
  'World',
  'India',
  'Politics',
  'Sports',
  'Entertainment',
  'Gaming',
  'Startups',
  'Health',
  'Climate',
  'Space'
];

const NEWS_SOURCES = [
  // ── Google News Trending RSS (real browser trending right now) ────────────
  {
    id: 'gnews-top',
    name: 'Google News',
    domain: 'news.google.com',
    feedUrl: 'https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en',
    category: 'World',
    country: 'US',
    language: 'en',
    enabled: true,
    reliabilityWeight: 1.0
  },
  {
    id: 'gnews-tech',
    name: 'Google News Tech',
    domain: 'news.google.com',
    feedUrl: 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGRqTVhZU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en',
    category: 'Technology',
    country: 'US',
    language: 'en',
    enabled: true,
    reliabilityWeight: 1.0
  },
  {
    id: 'gnews-business',
    name: 'Google News Business',
    domain: 'news.google.com',
    feedUrl: 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx6TVdZU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en',
    category: 'Business',
    country: 'US',
    language: 'en',
    enabled: true,
    reliabilityWeight: 1.0
  },
  {
    id: 'gnews-science',
    name: 'Google News Science',
    domain: 'news.google.com',
    feedUrl: 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRFp0Y1RjU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en',
    category: 'Science',
    country: 'US',
    language: 'en',
    enabled: true,
    reliabilityWeight: 1.0
  },
  {
    id: 'gnews-health',
    name: 'Google News Health',
    domain: 'news.google.com',
    feedUrl: 'https://news.google.com/rss/topics/CAAqIQgKIhtDQkFTRGdvSUwyMHZNR3QwTlRFU0FtVnVLQUFQAQ?hl=en-US&gl=US&ceid=US:en',
    category: 'Health',
    country: 'US',
    language: 'en',
    enabled: true,
    reliabilityWeight: 1.0
  },
  {
    id: 'gnews-entertainment',
    name: 'Google News Entertainment',
    domain: 'news.google.com',
    feedUrl: 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNREpxYW5RU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en',
    category: 'Entertainment',
    country: 'US',
    language: 'en',
    enabled: true,
    reliabilityWeight: 1.0
  },
  {
    id: 'gnews-sports',
    name: 'Google News Sports',
    domain: 'news.google.com',
    feedUrl: 'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRFp1ZEdvU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en',
    category: 'Sports',
    country: 'US',
    language: 'en',
    enabled: true,
    reliabilityWeight: 1.0
  },
  {
    id: 'gnews-india',
    name: 'Google News India',
    domain: 'news.google.com',
    feedUrl: 'https://news.google.com/rss?hl=en-IN&gl=IN&ceid=IN:en',
    category: 'India',
    country: 'IN',
    language: 'en',
    enabled: true,
    reliabilityWeight: 1.0
  },

  // ── Technology ────────────────────────────────────────────────────────────
  {
    id: 'theverge-tech',
    name: 'The Verge',
    domain: 'theverge.com',
    feedUrl: 'https://www.theverge.com/rss/index.xml',
    category: 'Technology',
    country: 'US',
    language: 'en',
    enabled: true,
    reliabilityWeight: 1.0
  },
  {
    id: 'wired-tech',
    name: 'Wired',
    domain: 'wired.com',
    feedUrl: 'https://www.wired.com/feed/rss',
    category: 'Technology',
    country: 'US',
    language: 'en',
    enabled: true,
    reliabilityWeight: 1.0
  },
  {
    id: 'arstechnica',
    name: 'Ars Technica',
    domain: 'arstechnica.com',
    feedUrl: 'https://feeds.arstechnica.com/arstechnica/index',
    category: 'Technology',
    country: 'US',
    language: 'en',
    enabled: true,
    reliabilityWeight: 0.95
  },
  {
    id: 'zdnet',
    name: 'ZDNet',
    domain: 'zdnet.com',
    feedUrl: 'https://www.zdnet.com/news/rss.xml',
    category: 'Technology',
    country: 'US',
    language: 'en',
    enabled: true,
    reliabilityWeight: 0.9
  },
  {
    id: 'mit-tech-review',
    name: 'MIT Technology Review',
    domain: 'technologyreview.com',
    feedUrl: 'https://www.technologyreview.com/feed/',
    category: 'Technology',
    country: 'US',
    language: 'en',
    enabled: true,
    reliabilityWeight: 1.0
  },
  {
    id: 'guardian-tech',
    name: 'The Guardian Tech',
    domain: 'theguardian.com',
    feedUrl: 'https://www.theguardian.com/technology/rss',
    category: 'Technology',
    country: 'GB',
    language: 'en',
    enabled: true,
    reliabilityWeight: 1.0
  },
  {
    id: 'engadget',
    name: 'Engadget',
    domain: 'engadget.com',
    feedUrl: 'https://www.engadget.com/rss.xml',
    category: 'Technology',
    country: 'US',
    language: 'en',
    enabled: true,
    reliabilityWeight: 0.9
  },
  {
    id: 'gizmodo',
    name: 'Gizmodo',
    domain: 'gizmodo.com',
    feedUrl: 'https://gizmodo.com/feed/rss',
    category: 'Technology',
    country: 'US',
    language: 'en',
    enabled: true,
    reliabilityWeight: 0.9
  },

  // ── AI ────────────────────────────────────────────────────────────────────
  {
    id: 'venturebeat-ai',
    name: 'VentureBeat AI',
    domain: 'venturebeat.com',
    feedUrl: 'https://venturebeat.com/category/ai/feed/',
    category: 'AI',
    country: 'US',
    language: 'en',
    enabled: true,
    reliabilityWeight: 1.0
  },
  {
    id: 'techcrunch-ai',
    name: 'TechCrunch AI',
    domain: 'techcrunch.com',
    feedUrl: 'https://techcrunch.com/category/artificial-intelligence/feed/',
    category: 'AI',
    country: 'US',
    language: 'en',
    enabled: true,
    reliabilityWeight: 1.0
  },
  {
    id: 'deepmind-blog',
    name: 'Google DeepMind',
    domain: 'deepmind.google',
    feedUrl: 'https://deepmind.google/blog/rss.xml',
    category: 'AI',
    country: 'US',
    language: 'en',
    enabled: true,
    reliabilityWeight: 1.0
  },

  // ── Startups ──────────────────────────────────────────────────────────────
  {
    id: 'techcrunch',
    name: 'TechCrunch',
    domain: 'techcrunch.com',
    feedUrl: 'https://techcrunch.com/feed/',
    category: 'Startups',
    country: 'US',
    language: 'en',
    enabled: true,
    reliabilityWeight: 1.0
  },
  {
    id: 'techcrunch-startups',
    name: 'TechCrunch Startups',
    domain: 'techcrunch.com',
    feedUrl: 'https://techcrunch.com/category/startups/feed/',
    category: 'Startups',
    country: 'US',
    language: 'en',
    enabled: true,
    reliabilityWeight: 1.0
  },

  // ── Business ──────────────────────────────────────────────────────────────
  {
    id: 'marketwatch',
    name: 'MarketWatch',
    domain: 'marketwatch.com',
    feedUrl: 'https://feeds.content.dowjones.io/public/rss/mw_topstories',
    category: 'Business',
    country: 'US',
    language: 'en',
    enabled: true,
    reliabilityWeight: 1.0
  },
  {
    id: 'fortune',
    name: 'Fortune',
    domain: 'fortune.com',
    feedUrl: 'https://fortune.com/feed/',
    category: 'Business',
    country: 'US',
    language: 'en',
    enabled: true,
    reliabilityWeight: 0.95
  },
  {
    id: 'fast-company',
    name: 'Fast Company',
    domain: 'fastcompany.com',
    feedUrl: 'https://www.fastcompany.com/rss',
    category: 'Business',
    country: 'US',
    language: 'en',
    enabled: true,
    reliabilityWeight: 0.9
  },
  {
    id: 'cnbc-top',
    name: 'CNBC',
    domain: 'cnbc.com',
    feedUrl: 'https://www.cnbc.com/id/100003114/device/rss/rss.html',
    category: 'Business',
    country: 'US',
    language: 'en',
    enabled: true,
    reliabilityWeight: 1.0
  },
  {
    id: 'bbc-business',
    name: 'BBC Business',
    domain: 'bbc.com',
    feedUrl: 'https://feeds.bbci.co.uk/news/business/rss.xml',
    category: 'Business',
    country: 'GB',
    language: 'en',
    enabled: true,
    reliabilityWeight: 1.0
  },
  {
    id: 'axios-news',
    name: 'Axios',
    domain: 'axios.com',
    feedUrl: 'https://api.axios.com/feed/',
    category: 'Business',
    country: 'US',
    language: 'en',
    enabled: true,
    reliabilityWeight: 1.0
  },

  // ── World News ────────────────────────────────────────────────────────────
  {
    id: 'bbc-world',
    name: 'BBC News',
    domain: 'bbc.com',
    feedUrl: 'https://feeds.bbci.co.uk/news/world/rss.xml',
    category: 'World',
    country: 'GB',
    language: 'en',
    enabled: true,
    reliabilityWeight: 1.0
  },
  {
    id: 'bbc-top',
    name: 'BBC Top Stories',
    domain: 'bbc.com',
    feedUrl: 'https://feeds.bbci.co.uk/news/rss.xml',
    category: 'World',
    country: 'GB',
    language: 'en',
    enabled: true,
    reliabilityWeight: 1.0
  },
  {
    id: 'guardian-world',
    name: 'The Guardian World',
    domain: 'theguardian.com',
    feedUrl: 'https://www.theguardian.com/world/rss',
    category: 'World',
    country: 'GB',
    language: 'en',
    enabled: true,
    reliabilityWeight: 1.0
  },
  {
    id: 'npr-world',
    name: 'NPR World',
    domain: 'npr.org',
    feedUrl: 'https://feeds.npr.org/1004/rss.xml',
    category: 'World',
    country: 'US',
    language: 'en',
    enabled: true,
    reliabilityWeight: 0.95
  },
  {
    id: 'aljazeera',
    name: 'Al Jazeera',
    domain: 'aljazeera.com',
    feedUrl: 'https://www.aljazeera.com/xml/rss/all.xml',
    category: 'World',
    country: 'QA',
    language: 'en',
    enabled: true,
    reliabilityWeight: 0.95
  },
  {
    id: 'dw-world',
    name: 'Deutsche Welle',
    domain: 'dw.com',
    feedUrl: 'https://rss.dw.com/rdf/rss-en-all',
    category: 'World',
    country: 'DE',
    language: 'en',
    enabled: true,
    reliabilityWeight: 0.95
  },

  // ── Politics ──────────────────────────────────────────────────────────────
  {
    id: 'thehill',
    name: 'The Hill',
    domain: 'thehill.com',
    feedUrl: 'https://thehill.com/homenews/feed/',
    category: 'Politics',
    country: 'US',
    language: 'en',
    enabled: true,
    reliabilityWeight: 0.9
  },
  {
    id: 'guardian-us',
    name: 'The Guardian US',
    domain: 'theguardian.com',
    feedUrl: 'https://www.theguardian.com/us-news/rss',
    category: 'Politics',
    country: 'US',
    language: 'en',
    enabled: true,
    reliabilityWeight: 1.0
  },

  // ── India ─────────────────────────────────────────────────────────────────
  {
    id: 'thehindu-national',
    name: 'The Hindu',
    domain: 'thehindu.com',
    feedUrl: 'https://www.thehindu.com/news/national/feeder/default.rss',
    category: 'India',
    country: 'IN',
    language: 'en',
    enabled: true,
    reliabilityWeight: 1.0
  },
  {
    id: 'ndtv-india',
    name: 'NDTV News',
    domain: 'ndtv.com',
    feedUrl: 'https://feeds.feedburner.com/ndtvnews-top-stories',
    category: 'India',
    country: 'IN',
    language: 'en',
    enabled: true,
    reliabilityWeight: 0.95
  },
  {
    id: 'indiatoday',
    name: 'India Today',
    domain: 'indiatoday.in',
    feedUrl: 'https://www.indiatoday.in/rss/1206514',
    category: 'India',
    country: 'IN',
    language: 'en',
    enabled: true,
    reliabilityWeight: 0.9
  },
  {
    id: 'hindustantimes',
    name: 'Hindustan Times',
    domain: 'hindustantimes.com',
    feedUrl: 'https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml',
    category: 'India',
    country: 'IN',
    language: 'en',
    enabled: true,
    reliabilityWeight: 0.9
  },

  // ── Sports ────────────────────────────────────────────────────────────────
  {
    id: 'espn-nfl',
    name: 'ESPN NFL',
    domain: 'espn.com',
    feedUrl: 'https://www.espn.com/espn/rss/news',
    category: 'Sports',
    country: 'US',
    language: 'en',
    enabled: true,
    reliabilityWeight: 1.0
  },
  {
    id: 'bbc-sport',
    name: 'BBC Sport',
    domain: 'bbc.com',
    feedUrl: 'https://feeds.bbci.co.uk/sport/rss.xml',
    category: 'Sports',
    country: 'GB',
    language: 'en',
    enabled: true,
    reliabilityWeight: 1.0
  },
  {
    id: 'skysports-news',
    name: 'Sky Sports',
    domain: 'skysports.com',
    feedUrl: 'https://www.skysports.com/rss/11095',
    category: 'Sports',
    country: 'GB',
    language: 'en',
    enabled: true,
    reliabilityWeight: 1.0
  },
  {
    id: 'skysports-football',
    name: 'Sky Sports Football',
    domain: 'skysports.com',
    feedUrl: 'https://www.skysports.com/rss/12040',
    category: 'Sports',
    country: 'GB',
    language: 'en',
    enabled: true,
    reliabilityWeight: 1.0
  },
  {
    id: 'guardian-sport',
    name: 'The Guardian Sport',
    domain: 'theguardian.com',
    feedUrl: 'https://www.theguardian.com/sport/rss',
    category: 'Sports',
    country: 'GB',
    language: 'en',
    enabled: true,
    reliabilityWeight: 1.0
  },
  {
    id: 'cbssports',
    name: 'CBS Sports',
    domain: 'cbssports.com',
    feedUrl: 'https://www.cbssports.com/rss/headlines/',
    category: 'Sports',
    country: 'US',
    language: 'en',
    enabled: true,
    reliabilityWeight: 0.95
  },
  {
    id: 'cricinfo',
    name: 'ESPN Cricinfo',
    domain: 'espncricinfo.com',
    feedUrl: 'https://www.espncricinfo.com/rss/content/story/feeds/0.xml',
    category: 'Sports',
    country: 'GB',
    language: 'en',
    enabled: true,
    reliabilityWeight: 0.95
  },

  // ── Science ───────────────────────────────────────────────────────────────
  {
    id: 'sciencedaily',
    name: 'ScienceDaily',
    domain: 'sciencedaily.com',
    feedUrl: 'https://www.sciencedaily.com/rss/top/science.xml',
    category: 'Science',
    country: 'US',
    language: 'en',
    enabled: true,
    reliabilityWeight: 0.95
  },
  {
    id: 'guardian-science',
    name: 'The Guardian Science',
    domain: 'theguardian.com',
    feedUrl: 'https://www.theguardian.com/science/rss',
    category: 'Science',
    country: 'GB',
    language: 'en',
    enabled: true,
    reliabilityWeight: 1.0
  },
  {
    id: 'phys-org-science',
    name: 'Phys.org Science',
    domain: 'phys.org',
    feedUrl: 'https://phys.org/rss-feed/breaking/',
    category: 'Science',
    country: 'US',
    language: 'en',
    enabled: true,
    reliabilityWeight: 0.95
  },

  // ── Space ─────────────────────────────────────────────────────────────────
  {
    id: 'nasa-breaking',
    name: 'NASA',
    domain: 'nasa.gov',
    feedUrl: 'https://www.nasa.gov/news-release/feed/',
    category: 'Space',
    country: 'US',
    language: 'en',
    enabled: true,
    reliabilityWeight: 1.0
  },

  // ── Climate ───────────────────────────────────────────────────────────────
  {
    id: 'phys-org-climate',
    name: 'Phys.org Earth',
    domain: 'phys.org',
    feedUrl: 'https://phys.org/rss-feed/earth-news/environment/',
    category: 'Climate',
    country: 'US',
    language: 'en',
    enabled: true,
    reliabilityWeight: 0.95
  },
  {
    id: 'guardian-climate',
    name: 'The Guardian Climate',
    domain: 'theguardian.com',
    feedUrl: 'https://www.theguardian.com/environment/climate-crisis/rss',
    category: 'Climate',
    country: 'GB',
    language: 'en',
    enabled: true,
    reliabilityWeight: 1.0
  },
  {
    id: 'carbon-brief',
    name: 'Carbon Brief',
    domain: 'carbonbrief.org',
    feedUrl: 'https://www.carbonbrief.org/feed',
    category: 'Climate',
    country: 'GB',
    language: 'en',
    enabled: true,
    reliabilityWeight: 1.0
  },

  // ── Health ────────────────────────────────────────────────────────────────
  {
    id: 'bbc-health',
    name: 'BBC Health',
    domain: 'bbc.com',
    feedUrl: 'https://feeds.bbci.co.uk/news/health/rss.xml',
    category: 'Health',
    country: 'GB',
    language: 'en',
    enabled: true,
    reliabilityWeight: 1.0
  },
  {
    id: 'medicalxpress',
    name: 'Medical Xpress',
    domain: 'medicalxpress.com',
    feedUrl: 'https://medicalxpress.com/rss-feed/',
    category: 'Health',
    country: 'US',
    language: 'en',
    enabled: true,
    reliabilityWeight: 0.9
  },
  {
    id: 'healthline',
    name: 'Healthline',
    domain: 'healthline.com',
    feedUrl: 'https://www.healthline.com/rss/health-news',
    category: 'Health',
    country: 'US',
    language: 'en',
    enabled: true,
    reliabilityWeight: 0.9
  },

  // ── Entertainment ─────────────────────────────────────────────────────────
  {
    id: 'variety-ent',
    name: 'Variety',
    domain: 'variety.com',
    feedUrl: 'https://variety.com/feed/',
    category: 'Entertainment',
    country: 'US',
    language: 'en',
    enabled: true,
    reliabilityWeight: 0.95
  },
  {
    id: 'hollywoodreporter',
    name: 'Hollywood Reporter',
    domain: 'hollywoodreporter.com',
    feedUrl: 'https://www.hollywoodreporter.com/feed/',
    category: 'Entertainment',
    country: 'US',
    language: 'en',
    enabled: true,
    reliabilityWeight: 0.95
  },
  {
    id: 'rollingstone',
    name: 'Rolling Stone',
    domain: 'rollingstone.com',
    feedUrl: 'https://www.rollingstone.com/feed/',
    category: 'Entertainment',
    country: 'US',
    language: 'en',
    enabled: true,
    reliabilityWeight: 0.9
  },
  {
    id: 'deadline',
    name: 'Deadline',
    domain: 'deadline.com',
    feedUrl: 'https://deadline.com/feed/',
    category: 'Entertainment',
    country: 'US',
    language: 'en',
    enabled: true,
    reliabilityWeight: 0.95
  },

  // ── Gaming ────────────────────────────────────────────────────────────────
  {
    id: 'polygon-gaming',
    name: 'Polygon',
    domain: 'polygon.com',
    feedUrl: 'https://www.polygon.com/rss/index.xml',
    category: 'Gaming',
    country: 'US',
    language: 'en',
    enabled: true,
    reliabilityWeight: 0.95
  },
  {
    id: 'eurogamer',
    name: 'Eurogamer',
    domain: 'eurogamer.net',
    feedUrl: 'https://www.eurogamer.net/feed',
    category: 'Gaming',
    country: 'GB',
    language: 'en',
    enabled: true,
    reliabilityWeight: 0.95
  },
  {
    id: 'pcgamer',
    name: 'PC Gamer',
    domain: 'pcgamer.com',
    feedUrl: 'https://www.pcgamer.com/rss/',
    category: 'Gaming',
    country: 'US',
    language: 'en',
    enabled: true,
    reliabilityWeight: 0.9
  },
  {
    id: 'gamespot',
    name: 'GameSpot',
    domain: 'gamespot.com',
    feedUrl: 'https://www.gamespot.com/feeds/mashup/',
    category: 'Gaming',
    country: 'US',
    language: 'en',
    enabled: true,
    reliabilityWeight: 0.9
  },
  {
    id: 'kotaku',
    name: 'Kotaku',
    domain: 'kotaku.com',
    feedUrl: 'https://kotaku.com/feed/rss',
    category: 'Gaming',
    country: 'US',
    language: 'en',
    enabled: true,
    reliabilityWeight: 0.85
  },
  {
    id: 'ign',
    name: 'IGN',
    domain: 'ign.com',
    feedUrl: 'https://feeds.ign.com/ign/all',
    category: 'Gaming',
    country: 'US',
    language: 'en',
    enabled: true,
    reliabilityWeight: 0.9
  }
];

// Google News keyword-based trending search feeds (always fresh from browser)
const GOOGLE_NEWS_SEARCH_FEEDS = [
  { keyword: 'artificial intelligence 2026', category: 'AI' },
  { keyword: 'startup funding venture capital', category: 'Startups' },
  { keyword: 'climate change environment', category: 'Climate' },
  { keyword: 'India news today', category: 'India' },
  { keyword: 'space exploration NASA', category: 'Space' },
  { keyword: 'stock market economy', category: 'Business' },
  { keyword: 'cricket match', category: 'Sports' },
  { keyword: 'football soccer transfer', category: 'Sports' },
  { keyword: 'movie release box office', category: 'Entertainment' },
  { keyword: 'video game review release', category: 'Gaming' },
  { keyword: 'world politics elections', category: 'Politics' },
  { keyword: 'medical research breakthrough', category: 'Health' },
  { keyword: 'cybersecurity hack breach', category: 'Technology' },
  { keyword: 'electric vehicle Tesla EV', category: 'Technology' },
  { keyword: 'cryptocurrency bitcoin blockchain', category: 'Business' },
].map(({ keyword, category }) => ({
  id: `gnews-search-${keyword.replace(/\s+/g, '-').replace(/[^a-z0-9-]/gi, '').slice(0, 30)}`,
  name: `Google News: ${keyword}`,
  domain: 'news.google.com',
  feedUrl: `https://news.google.com/rss/search?q=${encodeURIComponent(keyword)}&hl=en-US&gl=US&ceid=US:en`,
  category,
  country: 'US',
  language: 'en',
  enabled: true,
  reliabilityWeight: 0.9
}));

const ALL_SOURCES = [...NEWS_SOURCES, ...GOOGLE_NEWS_SEARCH_FEEDS];

module.exports = {
  CATEGORIES,
  NEWS_SOURCES: ALL_SOURCES
};
