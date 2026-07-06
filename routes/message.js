import express from "express";
import sqlite3 from "sqlite3";

const router = express.Router();
const db = new sqlite3.Database("database.db");

// POST — Save contact form
router.post("/", (req, res) => {
  const { name, email, subject, message } = req.body;

  const sql = `
    INSERT INTO messages (name, email, subject, message, created_at)
    VALUES (?, ?, ?, ?, datetime('now'))
  `;

  db.run(sql, [name, email, subject, message], function (err) {
    if (err) return res.status(500).json({ error: "Database error" });

    res.json({ success: true, id: this.lastID });
  });
});

// GET — Show all messages
router.get("/", (req, res) => {
  db.all("SELECT * FROM messages ORDER BY created_at DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });

    res.json(rows);
  });
});

export default router;
