const Booking = require('../../models/Booking'); // Importa el modelo Booking para interactuar con la base de datos de reservas.
const Room = require('../../models/Room'); // Importa el modelo Room para manejar la información de las habitaciones.
const Customer = require('../../models/Customer'); // Importa el modelo Customer para manejar los datos de los clientes.

const bookingResolvers = {
  Query: {
    // Resolver para obtener reservas
    bookings: async (_, { status }) => {
      const query = status ? { status } : {}; // Crea un filtro opcional por estado de la reserva.
      const bookings = await Booking.find(query).populate('customer').populate('room'); // Busca reservas y las rellena con datos de cliente y habitación.

      return bookings.map((booking) => ({
        ...booking.toObject(), // Convierte el documento de Mongoose en un objeto JavaScript.
        id: booking._id.toString(), // Serializa el ID de la reserva como string.
        customer: booking.customer // Verifica si la reserva tiene un cliente asociado.
          ? {
              ...booking.customer.toObject(), // Convierte el cliente en un objeto.
              id: booking.customer._id.toString(), // Serializa el ID del cliente como string.
            }
          : null, // Si no hay cliente asociado, devuelve null.
        room: booking.room // Verifica si la reserva tiene una habitación asociada.
          ? {
              ...booking.room.toObject(), // Convierte la habitación en un objeto.
              id: booking.room._id.toString(), // Serializa el ID de la habitación como string.
            }
          : null, // Si no hay habitación asociada, devuelve null.
      }));
    },
  },
  Mutation: {
    // Resolver para crear una nueva reserva
    createBooking: async (_, { customerId, roomId, startDate, endDate }) => {
      const room = await Room.findById(roomId); // Busca la habitación por su ID.
      if (!room) throw new Error('Room not found.'); // Lanza un error si no se encuentra la habitación.
      if (!room.availability) throw new Error('Room is not available.'); // Lanza un error si la habitación no está disponible.

      const customer = await Customer.findById(customerId); // Busca el cliente por su ID.
      if (!customer) throw new Error('Customer not found.'); // Lanza un error si no se encuentra el cliente.

      const nights = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)); // Calcula el número de noches.
      let totalPrice = nights * room.pricePerNight; // Calcula el precio total.
      if (nights > 7) totalPrice *= 0.9; // Aplica un descuento del 10% si las noches son mayores a 7.

      const newBooking = new Booking({
        customer: customerId, // Asocia el cliente con la reserva.
        room: roomId, // Asocia la habitación con la reserva.
        startDate,
        endDate,
        nights,
        totalPrice,
      });

      room.availability = false; // Marca la habitación como no disponible.
      await room.save(); // Guarda el estado actualizado de la habitación.
      const booking = await newBooking.save(); // Guarda la nueva reserva.

      return {
        ...booking.toObject(), // Convierte la reserva en un objeto.
        id: booking._id.toString(), // Serializa el ID de la reserva como string.
        customer: {
          ...customer.toObject(), // Convierte el cliente en un objeto.
          id: customer._id.toString(), // Serializa el ID del cliente como string.
        },
        room: {
          ...room.toObject(), // Convierte la habitación en un objeto.
          id: room._id.toString(), // Serializa el ID de la habitación como string.
        },
      };
    },
    // Resolver para actualizar el estado de una reserva
    updateBooking: async (_, { bookingId, status }) => {
      const booking = await Booking.findById(bookingId).populate('room').populate('customer'); // Busca la reserva por su ID y rellena datos de cliente y habitación.
      if (!booking) {
        throw new Error('Booking not found.'); // Lanza un error si no se encuentra la reserva.
      }

      booking.status = status; // Actualiza el estado de la reserva.

      // Si el estado es 'cancelled', vuelve a marcar la habitación como disponible.
      if (status === 'cancelled') {
        const room = await Room.findById(booking.room._id); // Busca la habitación asociada a la reserva.
        if (room) {
          room.availability = true; // Marca la habitación como disponible.
          await room.save(); // Guarda los cambios en la habitación.
        }
      }

      const updatedBooking = await booking.save(); // Guarda la reserva actualizada.

      return {
        ...updatedBooking.toObject(), // Convierte la reserva actualizada en un objeto.
        id: updatedBooking._id.toString(), // Serializa el ID de la reserva como string.
        customer: booking.customer // Serializa el cliente asociado.
          ? {
              ...booking.customer.toObject(),
              id: booking.customer._id.toString(),
            }
          : null,
        room: booking.room // Serializa la habitación asociada.
          ? {
              ...booking.room.toObject(),
              id: booking.room._id.toString(),
            }
          : null,
      };
    },
    // Resolver para eliminar una reserva
    deleteBooking: async (_, { bookingId }) => {
      const booking = await Booking.findById(bookingId).populate('room'); // Busca la reserva por su ID y rellena datos de la habitación.
      if (!booking) {
        throw new Error('Booking not found.'); // Lanza un error si no se encuentra la reserva.
      }

      // Marca la habitación como disponible si está asociada a la reserva.
      if (booking.room) {
        const room = await Room.findById(booking.room._id); // Busca la habitación asociada.
        if (room) {
          room.availability = true; // Marca la habitación como disponible.
          await room.save(); // Guarda los cambios en la habitación.
        }
      }

      await Booking.findByIdAndDelete(bookingId); // Elimina la reserva de la base de datos.

      return `Booking with ID ${bookingId} has been successfully deleted.`; // Devuelve un mensaje confirmando la eliminación.
    },
  },
};

module.exports = bookingResolvers; // Exporta los resolvers para su uso en GraphQL.