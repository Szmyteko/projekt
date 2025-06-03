const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

const dbPath = path.join(__dirname, '../BazaDanychProjekt.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Błąd połączenia z SQLite:', err.message);
  } else {
    console.log('✅ Połączono z SQLite');

    // Tabela użytkowników
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('admin', 'worker', 'client'))
      );
    `, (err) => {
      if (err) return console.error('❌ Błąd tworzenia tabeli users:', err.message);
      console.log('✅ Tabela "users" gotowa');

      // Dodaj domyślnych użytkowników
      const users = [
        { username: 'admin', password: 'admin123', role: 'admin' },
        { username: 'worker1', password: 'worker123', role: 'worker' },
        { username: 'client1', password: 'client123', role: 'client' }
      ];

      users.forEach(({ username, password, role }) => {
        db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
          if (!row) {
            bcrypt.hash(password, 10, (err, hash) => {
              if (!err) {
                db.run(
                  'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)',
                  [username, hash, role]
                );
              }
            });
          }
        });
      });
    });

    // Tabela kategorii
    db.run(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        image_url TEXT
      );
    `, (err) => {
      if (err) return console.error('❌ Błąd tworzenia tabeli categories:', err.message);
      console.log('✅ Tabela "categories" gotowa');
    });

    // Tabela warzyw
    db.run(`
      CREATE TABLE IF NOT EXISTS vegetables (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        price REAL,
        quantity INTEGER
      );
    `, (err) => {
      if (err) return console.error('❌ Błąd tworzenia tabeli vegetables:', err.message);
      console.log('✅ Tabela "vegetables" gotowa');
    });

            // Tabela zamówień
        db.run(`
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            name TEXT,
            address TEXT,
            email TEXT,
            phone TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
        `);

        db.run(`
        CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER NOT NULL,
            vegetable_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL,
            price REAL NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders(id),
            FOREIGN KEY (vegetable_id) REFERENCES vegetables(id)
        );
        `);

    // Tabela koszyka
    db.run(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        vegetable_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (vegetable_id) REFERENCES vegetables(id)
      );
    `, (err) => {
      if (err) return console.error('❌ Błąd tworzenia tabeli cart_items:', err.message);
      console.log('✅ Tabela "cart_items" gotowa');
    });

    // Relacja many-to-many: vegetable_category
    db.run(`
      CREATE TABLE IF NOT EXISTS vegetable_category (
        vegetable_id INTEGER,
        category_id INTEGER,
        PRIMARY KEY (vegetable_id, category_id),
        FOREIGN KEY (vegetable_id) REFERENCES vegetables(id),
        FOREIGN KEY (category_id) REFERENCES categories(id)
      );
    `, (err) => {
      if (err) return console.error('❌ Błąd tworzenia tabeli vegetable_category:', err.message);
      console.log('✅ Tabela relacji "vegetable_category" gotowa');
    });
  }
});

module.exports = db;
