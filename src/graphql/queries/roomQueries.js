const roomQueries = `
  rooms(type: String, minPrice: Float, maxPrice: Float): [Room]
`;

module.exports = roomQueries;