const jwt = require('jsonwebtoken');
const SECRET_KEY = 'tajny_klucz'; // powinien być w .env

// Weryfikacja tokenu
exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send('Brak tokenu');
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded; // dodajemy info o użytkowniku do żądania
        next();
    } catch (err) {
        return res.status(403).send('Nieprawidłowy token');
    }
};

// Ograniczenie dostępu według roli
exports.requireRole = (role) => {
    return (req, res, next) => {
        if (!req.user || req.user.role !== role) {
            return res.status(403).send('Brak uprawnień');
        }
        next();
    };
};
