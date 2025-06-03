# Warzywniak – Aplikacja do zarządzania warzywami i kategoriami

## Opis projektu

Warzywniak to pełnoprawna aplikacja webowa (FullStack), która umożliwia:
- zarządzanie warzywami (dodawanie, edytowanie, usuwanie, wyświetlanie),
- przypisywanie warzyw do kategorii (np. Liściaste, Korzeniowe),
- przeglądanie listy kategorii i ich szczegółów.

Projekt został podzielony na frontend i backend, z wykorzystaniem SQLite jako bazy danych.

## Technologie

- **Frontend:** React, React Router, Axios, CSS
- **Backend:** Node.js, Express
- **Baza danych:** SQLite (`sqlite3`)
- **Inne:** `cors`, `nodemon` (opcjonalnie), REST API

## Struktura folderów

```
projekt/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── db.js
│   └── server.js
│
├── client/
│   ├── components/
│   ├── App.js
│   ├── index.js
│   └── index.css
│
├── BazaDanychProjekt.db
└── README.md
```

## Instalacja i uruchomienie

**Krok 1:** Zainstaluj zależności

Otwórz dwa terminale – jeden dla `backend`, drugi dla `client`.

# Backend
```bash
cd backend
npm install
npm install bcrypt jsonwebtoken
node server.js
```

# Frontend
```bash
cd client
npm install
npm start
```

**Aplikacja będzie dostępna pod adresem:** `http://localhost:3000`  
**API backendu działa pod:** `http://localhost:5000`

## Funkcjonalności

### Frontend:
- Logowanie (administrator - login: admin, hasło: admin123) oraz rejestracja
- Lista warzyw i kategorii
- Formularze dodawania/edycji
- Responsywny wygląd z estetycznym UI
- Komunikacja z backendem przez `axios`
- Nawigacja z wykorzystaniem React Router

### Backend:
- REST API (`GET`, `POST`, `PUT`, `DELETE`)
- Obsługa dwóch zasobów: `vegetables` i `categories`
- Łączenie warzyw z kategoriami przez tabelę pośredniczącą (`vegetable_category`)
- Obsługa błędów (konsola + statusy HTTP)

## Struktura bazy danych

Tworzone są 3 tabele:

- **categories**
```sql
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL,
description TEXT,
image_url TEXT
```

- **vegetables**
```sql
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL,
description TEXT,
image_url TEXT,
price REAL,
quantity INTEGER
```

- **vegetable_category** (tabela relacyjna)
```sql
vegetable_id INTEGER,
category_id INTEGER,
PRIMARY KEY (vegetable_id, category_id),
FOREIGN KEY (vegetable_id) REFERENCES vegetables(id),
FOREIGN KEY (category_id) REFERENCES categories(id)
```

## Autorzy
Marcin Ratajczak, Szymon Szymkowiak

Projekt stworzony w ramach zaliczenia przedmiotu.
