import { Router } from "express";
import { getUserByUsername, getUserPosts } from "../controllers/users.controller.js";

export const usersRouter = Router();

usersRouter.get("/users/:username", getUserByUsername);
usersRouter.get("/user-posts/:username", getUserPosts);
