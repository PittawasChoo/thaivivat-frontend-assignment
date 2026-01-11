import express from "express";
import cors from "cors";

import { postsRouter } from "./routes/posts.routes.js";
import { usersRouter } from "./routes/users.routes.js";
import { searchRouter } from "./routes/search.routes.js";

export function createApp() {
    const app = express();

    app.use(cors());
    app.use(express.json());

    app.use("/api", postsRouter); // /posts , /posts/:id/like , /posts/:id/unlike
    app.use("/api", usersRouter); // /users/:username , /user-posts/:username
    app.use("/api", searchRouter); // /search/accounts

    // simple health check
    app.get("/health", (_req, res) => res.json({ ok: true }));

    return app;
}
