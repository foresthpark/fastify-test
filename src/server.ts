import "dotenv/config";
import fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import { Server, IncomingMessage, ServerResponse } from "http";

// Import routes
import rootRoutes from "./routes/root";
import userRoutes from "./routes/users";
import dbPlugin from "./plugins/db";

const server: FastifyInstance<Server, IncomingMessage, ServerResponse> =
  fastify({
    logger: true,
  });

// Register CORS
server.register(cors, {
  origin: true, // Allow all origins
});

// Register Swagger for OpenAPI schema generation
server.register(swagger, {
  swagger: {
    info: {
      title: "Fastify API",
      description: "API documentation",
      version: "0.1.0",
    },
    host: "localhost:3000",
    schemes: ["http"],
    consumes: ["application/json"],
    produces: ["application/json"],
  },
});

// Register Swagger UI to expose the documentation
server.register(swaggerUI, {
  routePrefix: "/documentation",
  uiConfig: {
    docExpansion: "list",
    deepLinking: false,
  },
});

// Register our mock database plugin
server.register(dbPlugin);

// Register routes
server.register(rootRoutes);
server.register(userRoutes, { prefix: "/users" });

// Run the server!
const start = async (): Promise<void> => {
  try {
    await server.listen({
      port: parseInt(process.env.PORT || "3000"),
      host: "0.0.0.0",
    });

    // Create a safer way to display the port
    const addressInfo = server.server.address();
    const port =
      typeof addressInfo === "object" && addressInfo
        ? addressInfo.port
        : "unknown";

    console.log(`Server listening on port ${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
