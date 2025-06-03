const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

// Składanie zamówienia przez klienta
router.post('/', authMiddleware.verifyToken, (req, res) => {
  const userId = req.user.id;
  const { name, address, email, phone } = req.body;

  if (!name || !address || !email || !phone) {
    return res.status(400).send('Brakuje danych zamówienia');
  }

  db.all(
    `SELECT ci.*, v.price, v.quantity AS available_quantity, v.name 
     FROM cart_items ci 
     JOIN vegetables v ON ci.vegetable_id = v.id 
     WHERE ci.user_id = ?`,
    [userId],
    (err, cartItems) => {
      if (err) return res.status(500).send('Błąd odczytu koszyka');
      if (cartItems.length === 0) {
        return res.status(400).send('Koszyk jest pusty');
      }

      const unavailableItem = cartItems.find(item => item.quantity > item.available_quantity);
      if (unavailableItem) {
        return res.status(400).send(
          `Brak wystarczającej ilości: ${unavailableItem.name}. Dostępne: ${unavailableItem.available_quantity}, w koszyku: ${unavailableItem.quantity}`
        );
      }

      db.run(
        `INSERT INTO orders (user_id, name, address, email, phone, status)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, name, address, email, phone, 'oczekujące'],
        function (err) {
          if (err) return res.status(500).send('Błąd tworzenia zamówienia');

          const orderId = this.lastID;
          const stmt = db.prepare(`
            INSERT INTO order_items (order_id, vegetable_id, quantity, price)
            VALUES (?, ?, ?, ?)
          `);

          let completed = 0;
          let hasError = false;

          cartItems.forEach((item) => {
            stmt.run([orderId, item.vegetable_id, item.quantity, item.price], (err) => {
              if (err) {
                if (!hasError) {
                  hasError = true;
                  res.status(500).send('Błąd zapisu pozycji zamówienia');
                }
                return;
              }

              db.run(
                `UPDATE vegetables SET quantity = quantity - ? WHERE id = ?`,
                [item.quantity, item.vegetable_id],
                (err) => {
                  if (err) {
                    console.error('❌ Błąd aktualizacji ilości warzywa:', err);
                  }
                }
              );

              completed++;
              if (completed === cartItems.length && !hasError) {
                stmt.finalize();
                db.run(`DELETE FROM cart_items WHERE user_id = ?`, [userId], (err) => {
                  if (err) return res.status(500).send('Błąd czyszczenia koszyka');
                  res.send({ message: 'Zamówienie złożone!' });
                });
              }
            });
          });
        }
      );
    }
  );
});

// Pobieranie wszystkich zamówień – tylko dla pracownika/admina
router.get('/all', authMiddleware.verifyToken, (req, res) => {
  if (req.user.role !== 'worker' && req.user.role !== 'admin') {
    return res.status(403).send('Brak uprawnień');
  }

  db.all(`
    SELECT o.id AS order_id, o.name, o.address, o.email, o.phone, o.status, o.created_at,
           oi.quantity, oi.price, v.name AS vegetable_name
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN vegetables v ON v.id = oi.vegetable_id
    ORDER BY o.created_at DESC
  `, (err, rows) => {
    if (err) return res.status(500).send('Błąd bazy danych');

    const grouped = {};
    rows.forEach(row => {
      if (!grouped[row.order_id]) {
        grouped[row.order_id] = {
          id: row.order_id,
          name: row.name,
          address: row.address,
          email: row.email,
          phone: row.phone,
          status: row.status,
          created_at: row.created_at,
          items: []
        };
      }
      grouped[row.order_id].items.push({
        vegetable_name: row.vegetable_name,
        quantity: row.quantity,
        price: row.price
      });
    });

    res.send(Object.values(grouped));
  });
});

// Zmiana statusu zamówienia (tylko dla pracownika/admina)
router.patch('/:id/status', authMiddleware.verifyToken, (req, res) => {
  const { status } = req.body;
  const orderId = req.params.id;

  if (req.user.role !== 'worker' && req.user.role !== 'admin') {
    return res.status(403).send('Brak uprawnień');
  }

  const allowedStatuses = ['oczekujące', 'w trakcie realizacji', 'wysłane'];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).send('Nieprawidłowy status');
  }

  db.run(
    `UPDATE orders SET status = ? WHERE id = ?`,
    [status, orderId],
    function (err) {
      if (err) return res.status(500).send('Błąd aktualizacji statusu');
      if (this.changes === 0) return res.status(404).send('Zamówienie nie istnieje');
      res.send({ message: 'Status zaktualizowany' });
    }
  );
});
// Usuwanie zamówienia – tylko dla admina/pracownika
router.delete('/:id', authMiddleware.verifyToken, (req, res) => {
  const orderId = req.params.id;

  if (req.user.role !== 'worker' && req.user.role !== 'admin') {
    return res.status(403).send('Brak uprawnień');
  }

  // Najpierw usuń powiązane elementy z order_items
  db.run(`DELETE FROM order_items WHERE order_id = ?`, [orderId], function (err) {
    if (err) return res.status(500).send('Błąd usuwania pozycji zamówienia');

    // Następnie samo zamówienie
    db.run(`DELETE FROM orders WHERE id = ?`, [orderId], function (err2) {
      if (err2) return res.status(500).send('Błąd usuwania zamówienia');

      if (this.changes === 0) {
        return res.status(404).send('Zamówienie nie istnieje');
      }

      res.send({ message: 'Zamówienie usunięte' });
    });
  });
});


module.exports = router;
