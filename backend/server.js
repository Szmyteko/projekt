const express = require('express');
const cors = require('cors');
const db = require('./db');

const vegetableRoutes = require('./routes/vegetable');
const categoriesRoutes = require('./routes/categories');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const usersRoutes = require('./routes/users');
const myOrdersRoutes = require('./routes/myorders'); // ⬅️ OK

const app = express(); // ⬅️ musi być najpierw!

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API działa');
});

app.get('/api/test', (req, res) => {
  db.get('SELECT 1 + 1 AS solution', (err, row) => {
    if (err) return res.status(500).send('Błąd zapytania');
    res.send(`Wynik: ${row.solution}`);
  });
});

// Rejestracja tras po app = express()
app.use('/api/vegetables', vegetableRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/myorders', myOrdersRoutes); // ⬅️ tu OK

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
