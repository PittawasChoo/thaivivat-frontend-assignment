import type { Request, Response } from "express";
import { db } from "../db/index.js";

export async function searchAccounts(req: Request, res: Response) {
    const qRaw = String(req.query.q ?? "").trim();
    const q = qRaw.toLowerCase();
    if (!q) return res.json([]);

    await db.read();
    const users = db.data!.users;

    const scored = users
        .map((u) => {
            const username = String(u.username ?? "").toLowerCase();
            const name = String(u.name ?? "").toLowerCase();

            const usernameStarts = username.startsWith(q);
            const usernameIncludes = username.includes(q);
            const nameStarts = name.startsWith(q);
            const nameIncludes = name.includes(q);

            if (!(usernameIncludes || nameIncludes)) return null;

            let score = 0;
            if (usernameStarts) score += 100;
            else if (usernameIncludes) score += 60;

            if (nameStarts) score += 40;
            else if (nameIncludes) score += 20;

            score += Math.max(0, 20 - username.length * 0.1);
            return { u, score };
        })
        .filter((x): x is { u: (typeof users)[number]; score: number } => Boolean(x));

    scored.sort((a, b) => b.score - a.score);

    const top5 = scored.slice(0, 5).map(({ u }) => ({
        id: u.id,
        username: u.username,
        name: u.name,
        avatarUrl: u.avatarUrl,
        isVerified: !!u.isVerified,
        hasStory: !!u.hasStory,
        followersCount: u.followersCount ?? 0,
        followingsCount: u.followingsCount ?? 0,
        postsCount: db.data!.posts.filter((p) => p.userId === u.id).length,
    }));

    res.json(top5);
}
