import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import helmet from "helmet";
import knex from "knex";
import axios from "axios";

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
app.use(express.json());

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

app.post("/", async (req, res) => {
  try {
    const userNew = await db("users").insert({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      age: req.body.age,
      active: req.body.active,
    });

    console.log("Successfully created user...");
    res.json(userNew);
  } catch (err) {
    console.error("Failed to create user...", err);
  }
});

app.put("/:id", async (req, res) => {
  try {
    const user = await db("users").where("id", req.params.id);
    const update = await db("users").where("id", req.params.id).update({
      active: !user[0].active,
    });
    console.log("Successfully updated active status...");
    res.json(update);
  } catch (err) {
    console.error("Failed to update user", err);
  }
});

app.delete("/:id", async (req, res) => {
  try {
    await db("users").where({ id: req.params.id }).del();
    console.log("Successfully deleted user...");
    res.send();
  } catch (err) {
    console.error("Failed to delete user...", err);
  }
});
(async () => {
  await axios.post("http://localhost:8080/", {
    first_name: "Luben",
    last_name: "Stoyanov",
    age: 34,
    active: true,
  });
})();

(async () => {
  await axios.put("http://localhost:8080/21");
})();

(async () => {
  await axios.delete("http://localhost:8080/51");
})();

app.listen(port, console.log(`Server running on http://localhost:${port}...`));
