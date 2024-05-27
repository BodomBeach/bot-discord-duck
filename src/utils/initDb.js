const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('db.sqlite', (err) => {
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
            year INTEGER NOT NULL
        )
    `, (err) => {
      if (err) {
        console.error("Error creating table:", err.message);
      }
    });
  });
});

db.close();
