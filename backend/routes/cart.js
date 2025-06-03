const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

// Dodaj do koszyka lub zaktualizuj ilość
router.post('/', authMiddleware.verifyToken, (req, res) => {
  const userId = req.user.id;
  const { vegetable_id, quantity } = req.body;

  if (!vegetable_id || !quantity) {
    return res.status(400).send('Brakuje danych');
  }

  // Sprawdź, czy ten produkt już jest w koszyku
  db.get(
    'SELECT id, quantity FROM cart_items WHERE user_id = ? AND vegetable_id = ?',
    [userId, vegetable_id],
    (err, row) => {
      if (err) return res.status(500).send('Błąd sprawdzania koszyka');

      if (row) {
        // Jeśli istnieje, zaktualizuj ilość
        const newQuantity = row.quantity + quantity;
        db.run(
          'UPDATE cart_items SET quantity = ? WHERE id = ?',
          [newQuantity, row.id],
          function (err) {
            if (err) return res.status(500).send('Błąd aktualizacji koszyka');
            res.send({ message: 'Zaktualizowano ilość w koszyku' });
          }
        );
      } else {
        // Jeśli nie, dodaj nowy wpis
        db.run(
          'INSERT INTO cart_items (user_id, vegetable_id, quantity) VALUES (?, ?, ?)',
          [userId, vegetable_id, quantity],
          function (err) {
            if (err) return res.status(500).send('Błąd dodawania do koszyka');
            res.status(201).send({ message: 'Dodano do koszyka' });
          }
        );
      }
    }
  );
});
// Pobierz koszyk użytkownika
router.get('/', authMiddleware.verifyToken, (req, res) => {
  const userId = req.user.id;

  db.all(
    `SELECT ci.id, v.name, v.price, ci.quantity, v.image_url
     FROM cart_items ci
     JOIN vegetables v ON v.id = ci.vegetable_id
     WHERE ci.user_id = ?`,
    [userId],
    (err, rows) => {
      if (err) {
        console.error('❌ Błąd pobierania koszyka:', err);
        return res.status(500).send('Błąd bazy danych');
      }
      res.send(rows);
    }
  );
});

// Aktualizuj ilość przedmiotu w koszyku
router.put('/:id', authMiddleware.verifyToken, (req, res) => {
  const userId = req.user.id;
  const itemId = req.params.id;
  const { quantity } = req.body;

  if (!Number.isInteger(quantity) || quantity < 1) {
    return res.status(400).send('Nieprawidłowa ilość');
  }

  db.run(
    'UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?',
    [quantity, itemId, userId],
    function (err) {
      if (err) return res.status(500).send('Błąd aktualizacji');
      res.send({ message: 'Ilość zaktualizowana' });
    }
  );
});

// Usuń z koszyka
router.delete('/:id', authMiddleware.verifyToken, (req, res) => {
  const userId = req.user.id;
  const itemId = req.params.id;

  db.run(
    'DELETE FROM cart_items WHERE id = ? AND user_id = ?',
    [itemId, userId],
    function (err) {
      if (err) {
        console.error('❌ Błąd usuwania z koszyka:', err);
        return res.status(500).send('Błąd usuwania');
      }
      res.send({ message: 'Usunięto z koszyka' });
    }
  );
});

module.exports = router;
