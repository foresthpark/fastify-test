"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const swagger_1 = __importDefault(require("@fastify/swagger"));
const swagger_ui_1 = __importDefault(require("@fastify/swagger-ui"));
// Import routes
const root_1 = __importDefault(require("./routes/root"));
const users_1 = __importDefault(require("./routes/users"));
const db_1 = __importDefault(require("./plugins/db"));
const server = (0, fastify_1.default)({
    logger: true,
});
// Register CORS
server.register(cors_1.default, {
    origin: true, // Allow all origins
});
// Register Swagger for OpenAPI schema generation
server.register(swagger_1.default, {
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
server.register(swagger_ui_1.default, {
    routePrefix: "/documentation",
    uiConfig: {
        docExpansion: "list",
        deepLinking: false,
    },
});
// Register our mock database plugin
server.register(db_1.default);
// Register routes
server.register(root_1.default);
server.register(users_1.default, { prefix: "/users" });
// Run the server!
const start = async () => {
    try {
        await server.listen({
            port: parseInt(process.env.PORT || "3000"),
            host: "0.0.0.0",
        });
        // Create a safer way to display the port
        const addressInfo = server.server.address();
        const port = typeof addressInfo === "object" && addressInfo
            ? addressInfo.port
            : "unknown";
        console.log(`Server listening on port ${port}`);
    }
    catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};
start();
//# sourceMappingURL=server.js.map