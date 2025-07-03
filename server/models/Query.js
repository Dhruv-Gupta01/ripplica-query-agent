const mongoose = require('mongoose');

const QuerySchema = new mongoose.Schema({
  query: String,
  embedding: [Number],
  summary: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Query', QuerySchema);
