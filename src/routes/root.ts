import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export default async function (fastify: FastifyInstance) {
  fastify.get(
    "/",
    {
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
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return { message: "Welcome to Fastify API" };
    }
  );

  fastify.get(
    "/health",
    async (request: FastifyRequest, reply: FastifyReply) => {
      return {
        status: "ok",
        timestamp: new Date().toISOString(),
        request: request.headers,
        body: request.body,
        reply: reply.headers,
      };
    }
  );
}
