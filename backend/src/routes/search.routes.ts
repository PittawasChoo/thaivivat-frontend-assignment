import { Router } from "express";
import { searchAccounts } from "../controllers/search.controller.js";

export const searchRouter = Router();

searchRouter.get("/search/accounts", searchAccounts);
