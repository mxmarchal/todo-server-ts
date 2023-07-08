import express, { Express } from "express";
import { Client } from "pg";
import dotenv from "dotenv";
import * as sys from "process";
import cors from "cors";

dotenv.config();

const app: Express = express();
const db = new Client();

async function server() {
  try {
    await db.connect();
  } catch (err) {
    console.error(err);
    sys.exit(1);
  }
  console.log("Connected to database");
  //see if table "todos" exists
  try {
    await db.query("SELECT * FROM todos");
  } catch (err) {
    console.log("Creating table todos");
    await db.query(
      "CREATE TABLE todos (id SERIAL PRIMARY KEY, text VARCHAR(40) NOT NULL, complete BOOLEAN NOT NULL)"
    );
  }

  const port = process.env.PORT || 3000;

  app.use(cors());

  app.get("/", (req, res) => {
    // Get all todos
    db.query("SELECT * FROM todos", (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal server error");
      } else {
        res.json(result.rows);
      }
    });
  });

  app.get("/:id", (req, res) => {
    // Get todo by id
    const { id } = req.params;
    db.query("SELECT * FROM todos WHERE id = $1", [id], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal server error");
      } else {
        if (result.rows.length === 0) {
          res.status(404).send("Not found");
        } else {
          res.json(result.rows[0]);
        }
      }
    });
  });

  app.post("/", express.json(), (req, res) => {
    // Create new todo
    const { text } = req.body;
    if (typeof text !== "string") {
      res.status(400).send("Bad request");
      return;
    }
    db.query(
      "INSERT INTO todos (text, complete) VALUES ($1, $2) RETURNING *",
      [text, false],
      (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send("Internal server error");
        } else {
          res.json(result.rows[0]);
        }
      }
    );
  });

  app.put("/:id", express.json(), (req, res) => {
    // Update todo
    const { id } = req.params;
    const { text, complete } = req.body;
    if (typeof text !== "string" || typeof complete !== "boolean") {
      res.status(400).send("Bad request");
      return;
    }
    db.query(
      "UPDATE todos SET text = $1, complete = $2 WHERE id = $3 RETURNING *",
      [text, complete, id],
      (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send("Internal server error");
        } else {
          res.json(result.rows[0]);
        }
      }
    );
  });

  app.delete("/:id", (req, res) => {
    // Delete todo
    const { id } = req.params;
    db.query("DELETE FROM todos WHERE id = $1", [id], (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal server error");
      } else {
        res.status(204).send();
      }
    });
  });

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

server();
