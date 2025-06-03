import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: ''
  });

  useEffect(() => {
    axios.get('http://localhost:5000/api/categories')
      .then(res => {
        const category = res.data.find(c => c.id === parseInt(id));
        if (category) {
          setFormData({
            name: category.name || '',
            description: category.description || '',
            image_url: category.image_url || ''
          });
        }
      })
      .catch(err => console.error('❌ Błąd pobierania kategorii:', err));
  }, [id]);

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    axios.put(`http://localhost:5000/api/categories/${id}`, formData)
      .then(() => navigate('/categories'))
      .catch(err => console.error('❌ Błąd edycji kategorii:', err));
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>✏️ Edytuj kategorię</h2>
      <form onSubmit={handleSubmit}>
        <label>Nazwa:</label><br />
        <input type="text" name="name" value={formData.name} onChange={handleChange} /><br /><br />

        <label>Opis:</label><br />
        <textarea name="description" value={formData.description} onChange={handleChange} /><br /><br />

        <label>Link do zdjęcia:</label><br />
        <input type="text" name="image_url" value={formData.image_url} onChange={handleChange} /><br /><br />

        <button type="submit">Zapisz zmiany</button>
      </form>
    </div>
  );
}

export default EditCategory;
