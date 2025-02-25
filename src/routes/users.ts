import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { User } from "../plugins/db";

interface GetUserParams {
  id: string;
}

interface CreateUserBody {
  name: string;
  email: string;
}

export default async function (fastify: FastifyInstance) {
  // Get all users
  fastify.get(
    "/",
    {
      schema: {
        response: {
          200: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "number" },
                name: { type: "string" },
                email: { type: "string" },
              },
            },
          },
        },
      },
    },
    async (_request: FastifyRequest, _reply: FastifyReply) => {
      return fastify.db.users;
    }
  );

  // Get user by ID
  fastify.get<{
    Params: GetUserParams;
  }>(
    "/:id",
    {
      schema: {
        params: {
          type: "object",
          required: ["id"],
          properties: {
            id: { type: "string" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              id: { type: "number" },
              name: { type: "string" },
              email: { type: "string" },
            },
          },
          404: {
            type: "object",
            properties: {
              error: { type: "string" },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const id = parseInt(request.params.id, 10);
      const user = fastify.db.users.find((user) => user.id === id);

      if (!user) {
        reply.code(404);
        return { error: "User not found" };
      }

      return user;
    }
  );

  // Create a new user
  fastify.post<{
    Body: CreateUserBody;
  }>(
    "/",
    {
      schema: {
        body: {
          type: "object",
          required: ["name", "email"],
          properties: {
            name: { type: "string" },
            email: { type: "string", format: "email" },
          },
        },
        response: {
          201: {
            type: "object",
            properties: {
              id: { type: "number" },
              name: { type: "string" },
              email: { type: "string" },
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { name, email } = request.body;
      const id = fastify.db.users.length + 1;

      const newUser: User = { id, name, email };
      fastify.db.users.push(newUser);

      reply.code(201);
      return newUser;
    }
  );
}
