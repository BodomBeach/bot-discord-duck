import fs from 'fs';
import sqlite3 from 'sqlite3';

// Ensure the directory exists
if (!fs.existsSync('db')) {
  fs.mkdirSync('db', { recursive: true });
  console.log(`Directory "db" created.`);
}

// Create db if it does not exist
const db = new sqlite3.Database('db/db.sqlite', (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
    return;
  }

  db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS licenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            license_number TEXT NOT NULL,
            year INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(license_number, year)
        )
    `, (err) => {
      if (err) {
        console.error("Error creating table:", err.message);
      }
    });
  });
});

db.close();
