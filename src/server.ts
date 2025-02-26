import "dotenv/config";
import fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import { Server, IncomingMessage, ServerResponse } from "http";

// Import routes
import rootRoutes from "./routes/root";
import userRoutes from "./routes/users";
import openaiRoutes from "./routes/openai";
import dbPlugin from "./plugins/db";

const server: FastifyInstance<Server, IncomingMessage, ServerResponse> =
  fastify({
    logger: true,
  });

// Enhanced CORS configuration
server.register(cors, {
  origin: [
    "http://localhost:3000",
    "http://localhost:8000",
    "http://localhost:8080",
  ], // Specific origins
  methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Accept",
    "Content-Type",
    "Authorization",
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Methods",
    "Access-Control-Allow-Credentials",
  ],
  exposedHeaders: ["Content-Disposition"], // Useful for file downloads
  credentials: true,
  maxAge: 86400, // 24 hours
  preflightContinue: false,
  preflight: true,
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
    produces: ["application/json", "audio/mpeg"],
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
server.register(openaiRoutes, { prefix: "/openai" });

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
