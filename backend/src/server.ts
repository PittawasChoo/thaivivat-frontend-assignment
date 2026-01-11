import { createApp } from "./app.js";
import { initDb } from "./db/index.js";

const PORT = Number(process.env.PORT ?? 4000);

await initDb();

const app = createApp();
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
