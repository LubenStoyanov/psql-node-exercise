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
  try {
    const usersAll = await db("users");
    res.json(usersAll);
  } catch (err) {
    console.error("Failed to get all users...", err);
  }
});

app.get("/:id", async (req, res) => {
  try {
    const user = await db("users").where({ id: req.params.id });
    res.json(user);
  } catch (err) {
    console.error("Failed to get user...", err);
  }
});

app.listen(port, console.log(`Server running on http://localhost:${port}...`));
