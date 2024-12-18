"""
Indicates exactly one field must be supplied and this field must not be `null`.
This directive is useful for input objects where you want to enforce that 
only one field is provided out of a set of possible fields, ensuring no ambiguity.
"""
directive @oneOf on INPUT_OBJECT

"""
Represents a Room entity in the system.

Fields:
- id: Unique identifier of the room.
- name: Name or number assigned to the room.
- type: Type of room (e.g., single, double, suite).
- pricePerNight: Cost to book the room for a single night.
- features: List of additional amenities available in the room (e.g., WiFi, Jacuzzi, TV).
- availability: Indicates if the room is currently available for booking.
"""
type Room {
  id: ID!
  name: String!
  type: String!
  pricePerNight: Float!
  features: [String]!
  availability: Boolean!
}

"""
Represents a Customer entity in the system.

Fields:
- id: Unique identifier of the customer.
- name: Full name of the customer.
- email: Email address of the customer.
- phone: Phone number of the customer.
"""
type Customer {
  id: ID!
  name: String!
  email: String!
  phone: String!
}

"""
Represents a Booking entity in the system.

Fields:
- id: Unique identifier of the booking.
- customer: The customer who made the booking.
- room: The room reserved for the booking.
- startDate: The starting date of the booking.
- endDate: The ending date of the booking.
- nights: The total number of nights for the booking, calculated from startDate and endDate.
- totalPrice: The total price of the booking, based on room price and duration, with discounts applied for extended stays.
- status: The current status of the booking (e.g., pending, confirmed, cancelled).
"""
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

"""
Root Query type for retrieving data.

Fields:
- rooms: Fetches a list of rooms, optionally filtered by type, minimum price, or maximum price.
- customers: Retrieves a list of all registered customers.
- bookings: Fetches a list of bookings, optionally filtered by status (e.g., pending, confirmed).
"""
type Query {
  rooms(type: String, minPrice: Float, maxPrice: Float): [Room]
  customers: [Customer]
  bookings(status: String): [Booking]
}

"""
Root Mutation type for creating, updating, and deleting entities.

Fields:
- createRoom: Creates a new room with the provided details.
- createCustomer: Registers a new customer with name, email, and phone.
- createBooking: Creates a new booking for a customer and room with specified dates.
- updateBooking: Updates the status of an existing booking (e.g., confirmed, cancelled).
- deleteBooking: Deletes a booking by its unique identifier and returns a confirmation message.
"""
type Mutation {
  createRoom(name: String!, type: String!, pricePerNight: Float!, features: [String]!): Room
  createCustomer(name: String!, email: String!, phone: String!): Customer
  createBooking(customerId: ID!, roomId: ID!, startDate: String!, endDate: String!): Booking
  updateBooking(bookingId: ID!, status: String!): Booking
  deleteBooking(bookingId: ID!): String
}