const roomResolvers = require('./roomResolver');
const customerResolvers = require('./customerResolver');
const bookingResolvers = require('./bookingResolver');

const resolvers = {
  Query: {
    ...roomResolvers.Query,
    ...customerResolvers.Query,
    ...bookingResolvers.Query,
  },
  Mutation: {
    ...roomResolvers.Mutation,
    ...customerResolvers.Mutation,
    ...bookingResolvers.Mutation,
  },
};

module.exports = resolvers;