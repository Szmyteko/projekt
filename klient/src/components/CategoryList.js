import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CategoryList() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  useEffect(() => {
    axios.get('http://localhost:5000/api/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error('❌ Błąd pobierania kategorii:', err));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Czy na pewno chcesz usunąć kategorię?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/categories/${id}`);
      setCategories(prev => prev.filter(cat => cat.id !== id));
    } catch (err) {
      console.error('❌ Błąd usuwania kategorii:', err);
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-category/${id}`);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>📦 Kategorie</h2>
      {categories.length === 0 ? (
        <p>Brak dostępnych kategorii.</p>
      ) : (
        <ul>
          {categories.map(cat => (
            <li key={cat.id} style={{ marginBottom: '1rem' }}>
              <strong>{cat.name}</strong><br />
              <em>{cat.description}</em><br />
              <img src={cat.image_url} alt={cat.name} style={{ maxWidth: '150px' }} /><br />

              {/* Tylko dla admin/worker */}
              {(role === 'admin' || role === 'worker') && (
                <>
                  <button onClick={() => handleDelete(cat.id)}>🗑 Usuń</button>
                  <button onClick={() => handleEdit(cat.id)}>✏️ Edytuj</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CategoryList;
