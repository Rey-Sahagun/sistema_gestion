const { gql } = require('apollo-server');
const roomQueries = require('./queries/roomQueries');
const customerQueries = require('./queries/customerQueries');
const bookingQueries = require('./queries/bookingQueries');
const roomMutations = require('./mutations/roomMutations');
const customerMutations = require('./mutations/customerMutations');
const bookingMutations = require('./mutations/bookingMutations');

const typeDefs = gql`
  type Room {
    id: ID!
    name: String!
    type: String!
    pricePerNight: Float!
    features: [String]!
    availability: Boolean!
  }

  type Customer {
    id: ID!
    name: String!
    email: String!
    phone: String!
  }

  type Booking {
    id: ID!
    customer: Customer!
    room: Room!
    startDate: String!
    endDate: String!
    nights: Int!
    totalPrice: Float!
    status: String!
  }

  type Query {
    ${roomQueries}
    ${customerQueries}
    ${bookingQueries}
  }

  type Mutation {
    ${roomMutations}
    ${customerMutations}
    ${bookingMutations}
  }
`;

module.exports = typeDefs;