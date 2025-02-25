"use strict";

require("dotenv").config();

const fastify = require("fastify")({
  logger: true,
});

// Register plugins
fastify.register(require("./plugins/db"));

// Register routes
fastify.register(require("./routes/index"));
fastify.register(require("./routes/users"), { prefix: "/users" });

// Run the server!
const start = async () => {
  try {
    await fastify.listen({ port: process.env.PORT || 3000, host: "0.0.0.0" });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
