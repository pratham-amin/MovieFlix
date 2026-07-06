import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import path from "path";
import { fileURLToPath } from "url";

import messagesRoute from "./routes/message.js";
import usersRoute from "./routes/user.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const db = new sqlite3.Database("database.db");

app.use(cors());
app.use(express.json());

// Serve HTML/CSS/JS from week052
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "home.html"));
});


// API routes
app.use("/api/messages", messagesRoute);
app.use("/api/users", usersRoute);

app.listen(3000, () => {
  console.log("MovieFlix backend running on http://localhost:3000");
});
