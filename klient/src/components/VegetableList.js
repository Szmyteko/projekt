import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

function VegetableList() {
  const navigate = useNavigate();
  const location = useLocation(); // <-- śledzenie zmiany ścieżki

  const [vegetables, setVegetables] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('asc');
  const [quantities, setQuantities] = useState({});
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:5000/api/vegetables')
      .then(res => {
        setVegetables(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Błąd pobierania warzyw:', err);
        setLoading(false);
      });

    axios.get('http://localhost:5000/api/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error('❌ Błąd pobierania kategorii:', err));
  }, [location]); // <-- ponowne pobranie danych przy każdej zmianie ścieżki

  const handleDelete = async (id) => {
    if (!window.confirm('Na pewno usunąć to warzywo?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/vegetables/${id}`);
      setVegetables(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      console.error('Błąd usuwania:', err);
    }
  };

  const handleEdit = (vegetable) => {
    navigate(`/edit-vegetable/${vegetable.id}`);
  };

  const handleQuantityChange = (vegId, value) => {
    setQuantities(prev => ({
      ...prev,
      [vegId]: parseInt(value) || 1
    }));
  };

  const handleAddToCart = async (veg) => {
    const quantity = quantities[veg.id] || 1;

    try {
      await axios.post(
        'http://localhost:5000/api/cart',
        { vegetable_id: veg.id, quantity },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      alert(`✅ Dodano ${veg.name} (${quantity} szt.) do koszyka`);
    } catch (err) {
      console.error('❌ Błąd dodawania do koszyka:', err);
      alert('❌ Nie udało się dodać do koszyka.');
    }
  };

  const filteredVegetables = vegetables
    .filter(veg =>
      (selectedCategory === '' || veg.category_id === parseInt(selectedCategory)) &&
      veg.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const priceA = parseFloat(a.price) || 0;
      const priceB = parseFloat(b.price) || 0;
      return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
    });

  if (loading) return <p>⏳ Ładowanie warzyw...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🥕 Lista warzyw</h2>

      <input
        type="text"
        placeholder="Szukaj po nazwie..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{ marginBottom: '1rem', padding: '0.5rem', width: '100%', maxWidth: '400px' }}
      />

      <div style={{ margin: '1rem 0' }}>
        <label>Filtruj po kategorii: </label>
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          style={{ marginLeft: '0.5rem' }}
        >
          <option value="">Wszystkie</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      <button
        onClick={() => setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))}
        style={{
          marginBottom: '1.5rem',
          backgroundColor: '#2e7d32',
          color: 'white',
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
      >
        Sortuj po cenie: {sortOrder === 'asc' ? 'rosnąco ⬆️' : 'malejąco ⬇️'}
      </button>

      {filteredVegetables.length === 0 ? (
        <p>Brak pasujących warzyw.</p>
      ) : (
        <ul>
          {filteredVegetables.map(veg => (
            <li key={veg.id} style={{ marginBottom: '1rem' }}>
              <strong>{veg.name}</strong><br />
              {veg.category_name && (
                <span style={{ fontStyle: 'italic', color: '#2e7d32' }}>
                  Kategoria: {veg.category_name}
                </span>
              )}<br />
              <img src={veg.image_url} alt={veg.name} style={{ maxWidth: '150px' }} /><br />
              <em>{veg.description}</em><br />
              <span>Cena: {parseFloat(veg.price).toFixed(2)} zł</span><br />
              <span>Ilość: {veg.quantity} szt.</span><br />

              {(role === 'admin' || role === 'worker') && (
                <>
                  <button onClick={() => handleDelete(veg.id)}>🗑 Usuń</button>
                  <button onClick={() => handleEdit(veg)}>✏️ Edytuj</button>
                </>
              )}

              {role === 'client' && (
                <div>
                  <input
                    type="number"
                    min="1"
                    value={quantities[veg.id] || 1}
                    onChange={(e) => handleQuantityChange(veg.id, e.target.value)}
                    style={{ width: '60px', marginRight: '0.5rem' }}
                  />
                  <button onClick={() => handleAddToCart(veg)}>➕ Do koszyka</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default VegetableList;
