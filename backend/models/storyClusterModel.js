const { Schema, model } = require('mongoose');

const storyClusterSchema = new Schema(
  {
    canonicalTitle: {
      type: String,
      required: true,
      trim: true
    },
    summary: {
      type: String,
      default: '',
      trim: true
    },
    category: {
      type: String,
      required: true,
      index: true
    },
    keywords: {
      type: [String],
      default: []
    },
    leadArticleId: {
      type: Schema.Types.ObjectId,
      ref: 'Article',
      default: null
    },
    articles: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Article'
      }
    ],
    sourceCount: {
      type: Number,
      default: 1,
      index: true
    },
    sources: [
      {
        type: String
      }
    ],
    firstPublishedAt: {
      type: Date,
      default: Date.now,
      index: true
    },
    lastPublishedAt: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: true
  }
);

storyClusterSchema.index({ lastPublishedAt: -1, sourceCount: -1 });

module.exports = model('StoryCluster', storyClusterSchema);
