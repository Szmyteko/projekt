import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddVegetable() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
    price: '',
    quantity: '',
    category_id: '' 
  });

  useEffect(() => {
    axios.get('http://localhost:5000/api/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error('❌ Błąd pobierania kategorii:', err));
  }, []);

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/vegetables', formData)
      .then(() => navigate('/vegetables'))
      .catch(err => console.error('❌ Błąd dodawania warzywa:', err));
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🥬 Dodaj nowe warzywo</h2>
      <form onSubmit={handleSubmit}>
        <label>Nazwa:</label><br />
        <input type="text" name="name" value={formData.name} onChange={handleChange} /><br /><br />

        <label>Opis:</label><br />
        <textarea name="description" value={formData.description} onChange={handleChange} /><br /><br />

        <label>Link do zdjęcia:</label><br />
        <input type="text" name="image_url" value={formData.image_url} onChange={handleChange} /><br /><br />

        <label>Cena (zł):</label><br />
        <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} /><br /><br />

        <label>Ilość (szt.):</label><br />
        <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} /><br /><br />

        <label>Kategoria:</label><br />
        <select name="category_id" value={formData.category_id} onChange={handleChange}>
          <option value="">-- wybierz kategorię --</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select><br /><br />

        <button type="submit">Dodaj warzywo</button>
      </form>
    </div>
  );
}

export default AddVegetable;
