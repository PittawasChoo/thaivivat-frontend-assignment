import { Router } from "express";
import { getPosts, likePost, unlikePost } from "../controllers/posts.controller.js";

export const postsRouter = Router();

postsRouter.get("/posts", getPosts);
postsRouter.patch("/posts/:id/like", likePost);
postsRouter.patch("/posts/:id/unlike", unlikePost);
