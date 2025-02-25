"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
async function default_1(fastify) {
    fastify.get("/", {
        schema: {
            response: {
                200: {
                    type: "object",
                    properties: {
                        message: { type: "string" },
                    },
                },
            },
        },
    }, async (_request, _reply) => {
        return { message: "Welcome to Fastify API" };
    });
    fastify.get("/health", async (request, reply) => {
        return {
            status: "ok",
            timestamp: new Date().toISOString(),
            request: request.headers,
            body: request.body,
            reply: reply.headers,
        };
    });
}
//# sourceMappingURL=root.js.map