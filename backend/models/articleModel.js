const { Schema, model } = require('mongoose');

const articleSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    normalizedTitle: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    description: {
      type: String,
      default: '',
      trim: true
    },
    canonicalUrl: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    sourceUrl: {
      type: String,
      required: true
    },
    sourceName: {
      type: String,
      required: true,
      index: true
    },
    sourceDomain: {
      type: String,
      required: true,
      index: true
    },
    sourceLogo: {
      type: String,
      default: ''
    },
    imageUrl: {
      type: String,
      default: ''
    },
    author: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      required: true,
      index: true
    },
    country: {
      type: String,
      default: 'US',
      index: true
    },
    language: {
      type: String,
      default: 'en'
    },
    provider: {
      type: String,
      default: 'RSS',
      index: true
    },
    externalId: {
      type: String,
      index: true
    },
    tags: {
      type: [String],
      default: []
    },
    readingTimeMinutes: {
      type: Number,
      default: 2
    },
    storyClusterId: {
      type: Schema.Types.ObjectId,
      ref: 'StoryCluster',
      index: true,
      default: null
    },
    publishedAt: {
      type: Date,
      required: true,
      index: true
    },
    fetchedAt: {
      type: Date,
      default: Date.now
    },
    expiresAt: {
      type: Date,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Compound indexes for high performance querying
articleSchema.index({ category: 1, publishedAt: -1 });
articleSchema.index({ sourceName: 1, publishedAt: -1 });
articleSchema.index({ publishedAt: -1 });

module.exports = model('Article', articleSchema);
