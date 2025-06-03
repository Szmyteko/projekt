import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddCategory() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: ''
  });

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/categories', formData)
      .then(() => navigate('/categories'))
      .catch(err => console.error('❌ Błąd dodawania kategorii:', err));
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>➕ Dodaj kategorię</h2>
      <form onSubmit={handleSubmit}>
        <label>Nazwa:</label><br />
        <input type="text" name="name" value={formData.name} onChange={handleChange} /><br /><br />

        <label>Opis:</label><br />
        <textarea name="description" value={formData.description} onChange={handleChange} /><br /><br />

        <label>Link do zdjęcia:</label><br />
        <input type="text" name="image_url" value={formData.image_url} onChange={handleChange} /><br /><br />

        <button type="submit">Dodaj kategorię</button>
      </form>
    </div>
  );
}

export default AddCategory;