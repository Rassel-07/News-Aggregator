# News Aggregation & Content Sourcing Policy

**AuraNews** operates strictly as a legitimate, transparent news metadata discovery and headline curation platform.

---

## 1. Principles of Legal & Ethical Sourcing

1. **No Paywall or Access Bypass**:
   - The platform never attempts to bypass paywalls, authentication walls, anti-bot mechanisms, rate limits, or CAPTCHAs.
   - We do not access, scrape, or index any subscriber-only or gated content.

2. **Public Feeds & Explicit APIs Only**:
   - All article discovery is powered by legitimate, publicly offered RSS/Atom feeds provided directly by publishers or through approved discovery interfaces (e.g., GDELT).
   - Feeds are listed in `/config/newsSources.js` and can be enabled or disabled dynamically.

3. **No Reproduction of Full Article Bodies**:
   - The platform never stores, mirrors, caches, or republishes full copyrighted article bodies.
   - We store and display only feed-provided metadata:
     - Article title
     - Canonical source URL
     - Publication timestamp
     - Publisher / Outlet name & domain
     - Short feed-provided summary or excerpt
     - Media thumbnail metadata where explicitly permitted

4. **Direct Publisher Attribution & Outbound Traffic**:
   - Every headline and card prominently displays the source name (e.g., *BBC News*, *The Verge*, *Reuters*, *The Hindu*).
   - Clicking an article opens the original story directly on the publisher's official domain via an outbound link (`target="_blank" rel="noopener noreferrer"`).
   - The platform does not claim authorship or ownership of third-party reporting.

5. **Image Usage & Placeholders**:
   - Thumbnails are loaded directly from publisher-provided feed metadata (`media:content`, `media:thumbnail`, `enclosure`) where terms permit.
   - In the absence of permitted image metadata, neutral category placeholders or public domain imagery are displayed.

---

## 2. Near-Duplicate Clustering & Multi-Source Comparison

- When multiple publishers cover the same breaking news event, AuraNews groups related headlines into a **Story Cluster**.
- Readers are presented with alternative perspectives and can compare coverage across outlets before navigating to the original publishers.

---

## 3. Publisher Inquiries & Removal Requests

Publishers who wish to update their feed URL, modify category tags, or request removal of their RSS feed from the AuraNews directory can do so by contacting `sources@auranews.example.com`. Feeds are configured in a modular registry and can be disabled immediately.
