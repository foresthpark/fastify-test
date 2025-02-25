import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";

// Define our user type
export interface User {
  id: number;
  name: string;
  email: string;
}

// Define the database structure
export interface DB {
  users: User[];
}

// Initialize the mock database
const db: DB = {
  users: [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
  ],
};

// Declare module to extend FastifyInstance type
declare module "fastify" {
  interface FastifyInstance {
    db: DB;
  }
}

export default fp(async function (fastify: FastifyInstance) {
  // Decorate Fastify instance with our db object
  fastify.decorate("db", db);
});
