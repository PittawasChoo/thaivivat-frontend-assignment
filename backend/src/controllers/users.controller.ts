import type { Request, Response } from "express";
import { db } from "../db/index.js";

export async function getUserByUsername(req: Request, res: Response) {
    await db.read();

    const username = String(req.params.username).toLowerCase();
    const user = db.data!.users.find((u) => String(u.username).toLowerCase() === username);

    if (!user) return res.status(404).json({ message: "Not found" });

    res.json({
        ...user,
        postsCount: db.data!.posts.filter((p) => p.userId === user.id).length,
    });
}

export async function getUserPosts(req: Request, res: Response) {
    await db.read();

    const username = String(req.params.username).toLowerCase();
    const user = db.data!.users.find((u) => String(u.username).toLowerCase() === username);

    if (!user) return res.json([]);

    const posts = db
        .data!.posts.filter((p) => p.userId === user.id)
        .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

    res.json(posts);
}
