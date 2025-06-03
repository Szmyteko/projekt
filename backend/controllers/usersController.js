const db = require('../db');

exports.getAllUsers = (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Brak dostępu');

  db.all('SELECT id, username, role FROM users', (err, rows) => {
    if (err) return res.status(500).send('Błąd bazy');
    res.send(rows);
  });
};

exports.updateUserRole = (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Brak dostępu');

  const { role } = req.body;
  const { id } = req.params;

  const allowedRoles = ['admin', 'worker', 'client'];
  if (!allowedRoles.includes(role)) {
    return res.status(400).send('Nieprawidłowa rola');
  }

  db.run('UPDATE users SET role = ? WHERE id = ?', [role, id], function (err) {
    if (err) return res.status(500).send('Błąd aktualizacji');
    res.send({ message: 'Rola zaktualizowana' });
  });
};