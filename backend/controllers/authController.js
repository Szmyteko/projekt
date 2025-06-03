const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'tajny_klucz'; // W produkcji przechowuj to w pliku .env

// Logowanie
exports.login = (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      return res.status(500).send('Błąd bazy danych');
    }

    if (!user) {
      return res.status(404).send('Użytkownik nie istnieje');
    }

    bcrypt.compare(password, user.password_hash, (err, isMatch) => {
      if (err || !isMatch) {
        return res.status(401).send('Nieprawidłowe hasło');
      }

      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          role: user.role
        },
        SECRET_KEY,
        { expiresIn: '2h' }
      );

      res.send({ token, username: user.username, role: user.role });
    });
  });
};

// Rejestracja
exports.register = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    console.log('🚫 Brak danych:', req.body);
    return res.status(400).send('Brakuje danych');
  }

  const role = 'client'; // przypisanie domyślnej roli

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, existingUser) => {
    if (err) {
      console.error('🔴 Błąd SELECT:', err);
      return res.status(500).send('Błąd bazy danych');
    }

    if (existingUser) {
      console.warn('⚠️ Użytkownik już istnieje:', username);
      return res.status(409).send('Użytkownik już istnieje');
    }

    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        console.error('❌ Błąd szyfrowania:', err);
        return res.status(500).send('Błąd szyfrowania hasła');
      }

      db.run(
        'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)',
        [username, hash, role],
        function (err) {
          if (err) {
            console.error('❌ Błąd INSERT:', err);
            return res.status(500).send('Rejestracja nie powiodła się');
          }

          console.log('✅ Dodano użytkownika:', username);
          res.status(201).send({ message: 'Użytkownik zarejestrowany', id: this.lastID });
        }
      );
    });
  });
};
