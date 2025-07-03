// server/utils/validator.js

const invalidKeywords = ['add', 'remind', 'calendar', 'buy', 'order', 'walk', 'grocery', 'shopping'];

function isValidQuery(query) {
  if (!query || typeof query !== 'string') return false;

  const lowerQuery = query.toLowerCase();

  // Check if any invalid keyword is present
  return !invalidKeywords.some(keyword => lowerQuery.includes(keyword));
}

module.exports = isValidQuery;
