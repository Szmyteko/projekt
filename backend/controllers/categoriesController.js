const db = require('../db');

// GET all
exports.getAllCategories = (req, res) => {
    db.all('SELECT * FROM categories', (err, rows) => {
        if (err) return res.status(500).send('Błąd pobierania kategorii');
        res.send(rows);
    });
};

// POST
exports.addCategory = (req, res) => {
    const { name, description, image_url } = req.body;
    const query = 'INSERT INTO categories (name, description, image_url) VALUES (?, ?, ?)';
    db.run(query, [name, description, image_url], function(err) {
        if (err) return res.status(500).send('Błąd dodawania kategorii');
        res.status(201).send({ id: this.lastID });
    });
};

// PUT
exports.updateCategory = (req, res) => {
    const { id } = req.params;
    const { name, description, image_url } = req.body;
    const query = 'UPDATE categories SET name = ?, description = ?, image_url = ? WHERE id = ?';
    db.run(query, [name, description, image_url, id], function(err) {
        if (err) return res.status(500).send('Błąd edycji kategorii');
        res.send({ message: 'Zaktualizowano' });
    });
};

// DELETE
exports.deleteCategory = (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM categories WHERE id = ?';
    db.run(query, [id], function(err) {
        if (err) return res.status(500).send('Błąd usuwania kategorii');
        res.send({ message: 'Usunięto' });
    });
};
