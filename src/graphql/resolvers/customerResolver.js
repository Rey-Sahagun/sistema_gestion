const Customer = require('../../models/Customer');

const customerResolvers = {
  Query: {
    customers: async () => {
      return Customer.find();
    },
  },
  Mutation: {
    createCustomer: async (_, { name, email, phone }) => {
      const newCustomer = new Customer({ name, email, phone });
      return newCustomer.save();
    },
  },
};

module.exports = customerResolvers;