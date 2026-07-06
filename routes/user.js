import express from "express";
import sqlite3 from "sqlite3";

const router = express.Router();
const db = new sqlite3.Database("database.db");

// POST — Create new user
router.post("/", (req, res) => {
  const { name, email, password } = req.body;

  const sql = `
    INSERT INTO users (name, email, password, created_at)
    VALUES (?, ?, ?, datetime('now'))
  `;

  db.run(sql, [name, email, password], function (err) {
    if (err) {
      if (err.message.includes("UNIQUE")) {
        return res.status(400).json({ error: "Email already exists" });
      }
      return res.status(500).json({ error: "Database error" });
    }

    res.json({ success: true, id: this.lastID });
  });
});

// GET — Show all users
router.get("/", (req, res) => {
  db.all("SELECT id, name, email, created_at FROM users", [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });

    res.json(rows);
  });
});


// LOGIN — Check if user exists
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = `
    SELECT id, name, email, created_at 
    FROM users 
    WHERE email = ? AND password = ?
  `;

  db.get(sql, [email, password], (err, row) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (!row) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    res.json({ success: true, user: row });
  });
});


export default router;
