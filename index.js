import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import helmet from "helmet";
import knex from "knex";

const app = express();
const port = process.env.PORT || 8080;

const db = knex({
  client: "pg",
  connection: process.env.DB_CONNECTION,
});

(async () => {
  try {
    await db.raw("SELECT 1");
    console.log("Successfully connected to database...");
  } catch (err) {
    console.error("Failed to connect to database...");
  }
})();

app.use(cors());
app.use(helmet());

app.get("/", async (req, res) => {
  const usersAll = await db.select("*").from("users");
  res.json(usersAll);
});

app.listen(port, console.log(`Server running on http://localhost:${port}...`));
