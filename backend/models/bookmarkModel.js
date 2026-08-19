const { Schema, model } = require('mongoose');

const bookmarkSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    articleId: {
      type: Schema.Types.ObjectId,
      ref: 'Article',
      required: true,
      index: true
    },
    savedAt: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Ensure a user can only bookmark a given article once
bookmarkSchema.index({ userId: 1, articleId: 1 }, { unique: true });

module.exports = model('Bookmark', bookmarkSchema);
