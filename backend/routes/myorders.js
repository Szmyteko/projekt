const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware.verifyToken, (req, res) => {
  const userId = req.user.id;

  db.all(`
    SELECT o.id, o.created_at, o.address, o.email, o.phone, o.status,
           oi.vegetable_id, oi.quantity, oi.price, v.name AS vegetable_name
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN vegetables v ON oi.vegetable_id = v.id
    WHERE o.user_id = ?
    ORDER BY o.created_at DESC
  `, [userId], (err, rows) => {
    if (err) {
      console.error("❌ Błąd SQL:", err);
      return res.status(500).send('Błąd pobierania zamówień');
    }

    const ordersMap = new Map();

    rows.forEach(row => {
      if (!ordersMap.has(row.id)) {
        ordersMap.set(row.id, {
          id: row.id,
          created_at: row.created_at,
          address: row.address,
          email: row.email,
          phone: row.phone,
          status: row.status, // ✅ dodano status
          items: []
        });
      }

      ordersMap.get(row.id).items.push({
        name: row.vegetable_name,
        quantity: row.quantity,
        price: row.price
      });
    });

    const orders = Array.from(ordersMap.values());

    res.send(orders);
  });
});

module.exports = router;
