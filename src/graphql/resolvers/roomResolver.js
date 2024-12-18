const Room = require('../../models/Room');

const roomResolvers = {
  Query: {
    rooms: async (_, { type, minPrice, maxPrice }) => {
      const query = {};
      if (type) query.type = type;
      if (minPrice || maxPrice) {
        query.pricePerNight = {};
        if (minPrice) query.pricePerNight.$gte = minPrice;
        if (maxPrice) query.pricePerNight.$lte = maxPrice;
      }
      return Room.find(query);
    },
  },
  Mutation: {
    createRoom: async (_, { name, type, pricePerNight, features }) => {
      const newRoom = new Room({ name, type, pricePerNight, features });
      return newRoom.save();
    },
  },
};

module.exports = roomResolvers;