"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
// Initialize the mock database
const db = {
    users: [
        { id: 1, name: "John Doe", email: "john@example.com" },
        { id: 2, name: "Jane Smith", email: "jane@example.com" },
    ],
};
exports.default = (0, fastify_plugin_1.default)(async function (fastify) {
    // Decorate Fastify instance with our db object
    fastify.decorate("db", db);
});
//# sourceMappingURL=db.js.map