const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

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
            license_number TEXT UNIQUE NOT NULL,
            year INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
      if (err) {
        console.error("Error creating table:", err.message);
      }
    });
  });
});

db.close();
