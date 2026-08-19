/**
 * Mock / Fixture News Provider
 * 
 * Provides fallback test articles across multiple categories and publishers
 * for offline development, integration tests, and UI verification.
 */

const { normalizeTitle } = require('./normalizer');

const MOCK_STORIES = [
  {
    title: 'OpenAI Unveils Next-Generation Multimodal Reasoning Architecture',
    description: 'Researchers have published new benchmarks demonstrating breakthroughs in mathematical reasoning, live visual cognition, and real-time agentic execution.',
    sourceName: 'The Verge',
    sourceDomain: 'theverge.com',
    sourceUrl: 'https://theverge.com/ai/openai-next-gen-multimodal',
    canonicalUrl: 'https://theverge.com/ai/openai-next-gen-multimodal',
    category: 'AI',
    country: 'US',
    language: 'en',
    imageUrl: '',
    publishedMinutesAgo: 15,
    author: 'Alex Heath'
  },
  {
    title: 'OpenAI Releases Breakthrough Reasoning Model with Multimodal Capabilities',
    description: 'The artificial intelligence lab has announced significant upgrades to its flagship frontier models, focusing on multi-step reasoning and reduced hallucinations.',
    sourceName: 'TechCrunch',
    sourceDomain: 'techcrunch.com',
    sourceUrl: 'https://techcrunch.com/openai-reasoning-breakthrough',
    canonicalUrl: 'https://techcrunch.com/openai-reasoning-breakthrough',
    category: 'AI',
    country: 'US',
    language: 'en',
    imageUrl: '',
    publishedMinutesAgo: 25,
    author: 'Kyle Wiggers'
  },
  {
    title: 'James Webb Space Telescope Discovers Ancient Galaxy from Cosmic Dawn',
    description: 'Astronomers using the infrared observatory have identified an exceptionally bright galaxy formed merely 290 million years after the Big Bang.',
    sourceName: 'NASA',
    sourceDomain: 'nasa.gov',
    sourceUrl: 'https://nasa.gov/news-release/jwst-ancient-galaxy-discovery',
    canonicalUrl: 'https://nasa.gov/news-release/jwst-ancient-galaxy-discovery',
    category: 'Space',
    country: 'US',
    language: 'en',
    imageUrl: '',
    publishedMinutesAgo: 45,
    author: 'Goddard Space Flight Center'
  },
  {
    title: 'Global Semiconductor Consortium Pledges $50B in Next-Gen Fabrication Hubs',
    description: 'Key semiconductor manufacturers have formalized agreements to construct advanced 2nm silicon lithography foundries across North America and Europe.',
    sourceName: 'Reuters',
    sourceDomain: 'reuters.com',
    sourceUrl: 'https://reuters.com/business/semiconductor-consortium-investment',
    canonicalUrl: 'https://reuters.com/business/semiconductor-consortium-investment',
    category: 'Business',
    country: 'US',
    language: 'en',
    imageUrl: '',
    publishedMinutesAgo: 70,
    author: 'Jane Lee'
  },
  {
    title: 'India Launches High-Speed Electric Freight Corridor Linking Key Industrial Zones',
    description: 'The Ministry of Railways has inaugurated a 1,200 km dedicated corridor aimed at slashing logistics costs and reducing carbon emissions by 40%.',
    sourceName: 'The Hindu',
    sourceDomain: 'thehindu.com',
    sourceUrl: 'https://thehindu.com/news/national/electric-freight-corridor',
    canonicalUrl: 'https://thehindu.com/news/national/electric-freight-corridor',
    category: 'India',
    country: 'IN',
    language: 'en',
    imageUrl: '',
    publishedMinutesAgo: 95,
    author: 'Vikas Pathak'
  },
  {
    title: 'Breakthrough Fusion Experiment Achieves Sustained Net Energy Gain for 10 Minutes',
    description: 'Physicists in an international research collaborative have maintained stable high-confinement plasma, marking a critical milestone toward commercial fusion.',
    sourceName: 'ScienceDaily',
    sourceDomain: 'sciencedaily.com',
    sourceUrl: 'https://sciencedaily.com/releases/fusion-sustained-plasma',
    canonicalUrl: 'https://sciencedaily.com/releases/fusion-sustained-plasma',
    category: 'Science',
    country: 'US',
    language: 'en',
    imageUrl: '',
    publishedMinutesAgo: 120,
    author: 'ScienceDaily News Desk'
  }
];

function getMockArticles() {
  const now = Date.now();
  return MOCK_STORIES.map(item => {
    const publishedAt = new Date(now - item.publishedMinutesAgo * 60 * 1000);
    return {
      title: item.title,
      normalizedTitle: normalizeTitle(item.title),
      description: item.description,
      canonicalUrl: item.canonicalUrl,
      sourceUrl: item.sourceUrl,
      sourceName: item.sourceName,
      sourceDomain: item.sourceDomain,
      sourceLogo: `https://www.google.com/s2/favicons?domain=${item.sourceDomain}&sz=128`,
      imageUrl: item.imageUrl || '',
      author: item.author,
      category: item.category,
      country: item.country,
      language: item.language,
      provider: 'MockFixture',
      externalId: item.canonicalUrl,
      readingTimeMinutes: 3,
      publishedAt
    };
  });
}

module.exports = {
  MOCK_STORIES,
  getMockArticles
};
