const { pipeline } = require('@xenova/transformers');

// Cache the loaded model globally
let embedder;

async function loadEmbedder() {
  if (!embedder) {
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  }
  return embedder;
}

async function getEmbedding(text) {
  const extractor = await loadEmbedder();
  const output = await extractor(text, { pooling: 'mean', normalize: true });
  return output.data;
}

// Cosine similarity
function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const magB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  return dot / (magA * magB);
}

function isSimilar(newVec, oldVec, threshold = 0.9) {
  return cosineSimilarity(newVec, oldVec) >= threshold;
}

module.exports = { getEmbedding, isSimilar };
