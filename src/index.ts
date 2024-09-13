import { ApolloServer } from "@apollo/server";
import { schema } from "./schema";

import express from "express";
import http from "http";
import cors from "cors";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

// Express and Http Server setup
const app = express();
const httpServer = http.createServer(app);

// ApolloServer setup
const server = new ApolloServer({
  schema,
  cache: "bounded",
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

// Server Start
server
  .start()
  .then(() =>
    app.use(
      "/",
      cors<cors.CorsRequest>({
        credentials: true,
      }),
      express.json(),
      expressMiddleware(server)
    )
  )
  .then(() => {
    new Promise<void>((resolve) => httpServer.listen({ port: 4000 }, resolve));
  });
