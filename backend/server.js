import express from "express";
import cors from "cors";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { nanoid } from "nanoid";

const app = express();
app.use(cors());
app.use(express.json());

const adapter = new JSONFile(new URL("./db.json", import.meta.url));
const db = new Low(adapter, { posts: [] });

async function init() {
    await db.read();
    db.data ||= { posts: [] };
    await db.write();
}
await init();

app.get("/api/posts", async (req, res) => {
    await db.read();

    const q = (req.query.q ?? "").toString().trim().toLowerCase();
    const page = Math.max(1, Number(req.query.page ?? 1));
    const limit = Math.min(50, Math.max(1, Number(req.query.limit ?? 10)));

    let posts = [...db.data.posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (q) {
        posts = posts.filter((p) => {
            const hay = `${p.username} ${p.caption}`.toLowerCase();
            return hay.includes(q);
        });
    }

    const start = (page - 1) * limit;
    const paged = posts.slice(start, start + limit);

    res.json({
        data: paged,
        page,
        limit,
        total: posts.length,
        hasMore: start + limit < posts.length,
    });
});

app.post("/api/posts", async (req, res) => {
    const { username, caption, imageUrl } = req.body ?? {};
    if (!username || !imageUrl) {
        return res.status(400).json({ message: "username and imageUrl are required" });
    }

    await db.read();
    const post = {
        id: nanoid(),
        username,
        caption: caption ?? "",
        imageUrl,
        createdAt: new Date().toISOString(),
        likes: 0,
    };

    db.data.posts.push(post);
    await db.write();

    res.status(201).json(post);
});

app.patch("/api/posts/:id/like", async (req, res) => {
    await db.read();
    const post = db.data.posts.find((p) => p.id === req.params.id);
    if (!post) return res.status(404).json({ message: "Not found" });

    post.likes = (post.likes ?? 0) + 1;
    await db.write();
    res.json(post);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
