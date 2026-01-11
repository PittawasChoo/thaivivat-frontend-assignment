import type { Request, Response } from "express";
import { db } from "../db/index.js";
import type { PostFeedItem } from "../db/schema.js";

export async function getPosts(req: Request, res: Response) {
    await db.read();

    const q = String(req.query.q ?? "")
        .trim()
        .toLowerCase();
    const page = Math.max(1, Number(req.query.page ?? 1));
    const limit = Math.min(50, Math.max(1, Number(req.query.limit ?? 10)));

    const users = db.data!.users;
    const locations = db.data!.locations;

    const enhancedUsers = users.map((u) => ({
        ...u,
        postsCount: db.data!.posts.filter((p) => p.userId === u.id).length,
    }));

    const userById = new Map(enhancedUsers.map((u) => [u.id, u] as const));
    const locById = new Map(locations.map((l) => [l.id, l] as const));

    let posts = [...db.data!.posts].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

    if (q) {
        posts = posts.filter((p) => {
            const user = userById.get(p.userId);
            const hay = `${user?.username ?? ""} ${p.caption ?? ""}`.toLowerCase();
            return hay.includes(q);
        });
    }

    const start = (page - 1) * limit;
    const paged = posts.slice(start, start + limit);

    const enriched: PostFeedItem[] = paged.map((p) => ({
        ...p,
        user: userById.get(p.userId) ?? null,
        location: p.locationId ? locById.get(p.locationId) ?? null : null,
    }));

    res.json({
        data: enriched,
        page,
        limit,
        total: posts.length,
        hasMore: start + limit < posts.length,
    });
}

export async function likePost(req: Request, res: Response) {
    await db.read();

    const id = Number(req.params.id);
    const post = db.data!.posts.find((p) => p.id === id);

    if (!post) return res.status(404).json({ message: "Not found" });

    if (post.liked) {
        return res.json({
            postId: post.id,
            likesCount: post.likesCount ?? 0,
            liked: post.liked ?? false,
        });
    }

    post.likesCount = (post.likesCount ?? 0) + 1;
    post.liked = true;
    await db.write();

    res.json({
        postId: post.id,
        likesCount: post.likesCount,
        liked: post.liked,
    });
}

export async function unlikePost(req: Request, res: Response) {
    await db.read();

    const id = Number(req.params.id);
    const post = db.data!.posts.find((p) => p.id === id);

    if (!post) return res.status(404).json({ message: "Not found" });

    if (!post.liked) {
        return res.status(200).json({ message: "Post is not liked" });
    }

    // never go below 0
    post.likesCount = Math.max(0, (post.likesCount ?? 0) - 1);
    post.liked = false;
    await db.write();

    res.json({
        postId: post.id,
        likesCount: post.likesCount,
        liked: post.liked,
    });
}
