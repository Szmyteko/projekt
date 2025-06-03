const db = require('../db');

// POST /api/vegetables
exports.addVegetable = (req, res) => {
    const { name, description, image_url, price, quantity, category_id } = req.body;

    console.log('➡️ Odebrano dane:', { name, description, image_url, price, quantity, category_id });

    if (!name) return res.status(400).send('Nazwa warzywa jest wymagana');

    const query = `
        INSERT INTO vegetables (name, description, image_url, price, quantity, category_id)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.run(query, [name, description, image_url, price, quantity, category_id], function(err) {
        if (err) {
            console.error('❌ Błąd zapytania SQL:', err);
            return res.status(500).send(err.message);
        }
        res.status(201).send({ message: 'Warzywo dodane', id: this.lastID });
    });
};

// GET /api/vegetables
exports.getAllVegetables = (req, res) => {
    const query = `
        SELECT v.*, c.name AS category_name
        FROM vegetables v
        LEFT JOIN categories c ON v.category_id = c.id
    `;
    db.all(query, (err, results) => {
        if (err) {
            console.error('❌ Błąd pobierania warzyw:', err);
            return res.status(500).send('Błąd pobierania warzyw');
        }
        res.send(results);
    });
};

// DELETE /api/vegetables/:id
exports.deleteVegetable = (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM vegetables WHERE id = ?';
    db.run(query, [id], function(err) {
        if (err) return res.status(500).send('Błąd podczas usuwania');
        res.send({ message: 'Warzywo usunięte' });
    });
};

// PUT /api/vegetables/:id
exports.updateVegetable = (req, res) => {
    const { id } = req.params;
    const { name, description, image_url, price, quantity, category_id } = req.body;

    const query = `
        UPDATE vegetables
        SET name = ?, description = ?, image_url = ?, price = ?, quantity = ?, category_id = ?
        WHERE id = ?
    `;
    db.run(query, [name, description, image_url, price, quantity, category_id, id], function(err) {
        if (err) {
            console.error('❌ Błąd edycji:', err);
            return res.status(500).send('Błąd bazy danych');
        }
        res.send({ message: 'Zaktualizowano warzywo' });
    });
};
