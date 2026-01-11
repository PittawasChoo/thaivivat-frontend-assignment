import express from "express";
import cors from "cors";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const app = express();
app.use(cors());
app.use(express.json());

const adapter = new JSONFile(new URL("./db.json", import.meta.url));
const db = new Low(adapter, { posts: [] });

async function init() {
    await db.read();
    db.data ||= { posts: [], users: [], locations: [] };
    db.data.posts ||= [];
    db.data.users ||= [];
    db.data.locations ||= [];
    await db.write();
}
await init();

app.get("/api/posts", async (req, res) => {
    await db.read();

    const q = (req.query.q ?? "").toString().trim().toLowerCase();
    const page = Math.max(1, Number(req.query.page ?? 1));
    const limit = Math.min(50, Math.max(1, Number(req.query.limit ?? 10)));

    const users = db.data.users;
    const locations = db.data.locations;

    const enhancedUsers = users.map((u) => ({
        ...u,
        postCount: db.data.posts.filter((p) => p.userId === u.id).length,
    }));

    const userById = new Map(enhancedUsers.map((u) => [u.id, u]));
    const locById = new Map(locations.map((l) => [l.id, l]));

    // sort newest first
    let posts = [...db.data.posts].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

    // filter by query (use user's username + caption)
    if (q) {
        posts = posts.filter((p) => {
            const user = userById.get(p.userId);
            const hay = `${user?.username ?? ""} ${p.caption ?? ""}`.toLowerCase();
            return hay.includes(q);
        });
    }

    const start = (page - 1) * limit;
    const paged = posts.slice(start, start + limit);

    const enriched = paged.map((p) => ({
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
});

app.patch("/api/posts/:id/like", async (req, res) => {
    await db.read();

    const id = Number(req.params.id);
    const post = db.data.posts.find((p) => p.id === id);

    if (!post) return res.status(404).json({ message: "Not found" });

    if (post.liked) {
        return res.json({
            postId: post.id,
            likesCount: post.likesCount,
            liked: post.liked,
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
});

app.patch("/api/posts/:id/unlike", async (req, res) => {
    await db.read();

    const id = Number(req.params.id);
    const post = db.data.posts.find((p) => p.id === id);

    if (!post) return res.status(404).json({ message: "Not found" });

    if (!post.liked) {
        return res.status(200).json({ message: "Post is not liked" });
    }

    post.likesCount = (post.likesCount ?? 0) - 1;
    post.liked = false;
    await db.write();

    res.json({
        postId: post.id,
        likesCount: post.likesCount,
        liked: post.liked,
    });
});

app.get("/api/search/accounts", async (req, res) => {
    const qRaw = String(req.query.q ?? "").trim();
    const q = qRaw.toLowerCase();
    if (!q) return res.json([]);

    await db.read();
    const users = db.data.users ?? [];

    const scored = users
        .map((u) => {
            const username = String(u.username ?? "").toLowerCase();
            const name = String(u.name ?? "").toLowerCase();

            // no match => skip later
            const usernameStarts = username.startsWith(q);
            const usernameIncludes = username.includes(q);
            const nameStarts = name.startsWith(q);
            const nameIncludes = name.includes(q);

            if (!(usernameIncludes || nameIncludes)) return null;

            // scoring: startsWith > includes, username > name
            let score = 0;
            if (usernameStarts) score += 100;
            else if (usernameIncludes) score += 60;

            if (nameStarts) score += 40;
            else if (nameIncludes) score += 20;

            // tie-break: shorter username a bit higher (optional)
            score += Math.max(0, 20 - username.length * 0.1);

            return { u, score };
        })
        .filter(Boolean);

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
        postCount: db.data.posts.filter((p) => p.userId === u.id).length,
    }));

    res.json(top5);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
