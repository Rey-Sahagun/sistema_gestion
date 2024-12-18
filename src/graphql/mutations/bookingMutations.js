const bookingMutations = `
  createBooking(customerId: ID!, roomId: ID!, startDate: String!, endDate: String!): Booking
  updateBooking(bookingId: ID!, status: String!): Booking
  deleteBooking(bookingId: ID!): String
`;

module.exports = bookingMutations;