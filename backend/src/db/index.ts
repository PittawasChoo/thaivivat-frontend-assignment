import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import type { DbSchema } from "./schema.js";

const adapter = new JSONFile<DbSchema>(new URL("../../db/db.json", import.meta.url));
export const db = new Low<DbSchema>(adapter, { posts: [], users: [], locations: [] });

export async function initDb() {
    await db.read();

    db.data ||= { posts: [], users: [], locations: [] };
    db.data.posts ||= [];
    db.data.users ||= [];
    db.data.locations ||= [];

    await db.write();
}
