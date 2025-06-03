import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

function Cart() {
  const [items, setItems] = useState([]);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderData, setOrderData] = useState({
    name: '',
    address: '',
    email: '',
    phone: '',
  });

  const token = localStorage.getItem('token');

  const fetchCart = useCallback(() => {
    axios
      .get('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setItems(res.data))
      .catch((err) => console.error('❌ Błąd pobierania koszyka:', err));
  }, [token]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleRemove = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error('❌ Błąd usuwania:', err);
    }
  };

  const handleQuantityChange = async (id, newQty) => {
    if (newQty < 1) return;
    try {
      await axios.put(
        `http://localhost:5000/api/cart/${id}`,
        { quantity: newQty },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: newQty } : item
        )
      );
    } catch (err) {
      console.error('❌ Błąd aktualizacji ilości:', err);
    }
  };

  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    const products = items.map(item => ({
      vegetable_id: item.vegetable_id || item.id,
      quantity: item.quantity
    }));

    try {
      await axios.post(
        'http://localhost:5000/api/orders',
        { ...orderData, items: products },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('✅ Zamówienie złożone!');
      setItems([]);
      setShowOrderForm(false);
      fetchCart();
    } catch (err) {
      console.error('❌ Błąd składania zamówienia:', err);
      alert('❌ Nie udało się złożyć zamówienia.');
    }
  };

  const handleChange = (e) => {
    setOrderData({ ...orderData, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🛒 Twój koszyk</h2>

      {items.length === 0 ? (
        <p>Koszyk jest pusty</p>
      ) : (
        <>
          <ul>
            {items.map((item) => (
              <li key={item.id} style={{ marginBottom: '1rem' }}>
                <img
                  src={item.image_url}
                  alt={item.name}
                  style={{ maxWidth: '100px' }}
                />
                <br />
                <strong>{item.name}</strong>
                <br />
                Cena: {item.price} zł<br />
                <div>
                  Ilość:
                  <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</button>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                    style={{
                      width: '50px',
                      textAlign: 'center',
                      margin: '0 0.5rem',
                    }}
                  />
                  <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
                </div>
                <button onClick={() => handleRemove(item.id)}>🗑 Usuń</button>
              </li>
            ))}
          </ul>

          <h3>💰 Razem: {totalAmount.toFixed(2)} zł</h3>

          {!showOrderForm ? (
            <button
              onClick={() => setShowOrderForm(true)}
              style={{
                marginTop: '1rem',
                padding: '0.7rem 1.5rem',
                backgroundColor: '#2e7d32',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              🧾 Zamów
            </button>
          ) : (
            <form onSubmit={handleOrderSubmit} style={{ marginTop: '2rem' }}>
              <h3>Dane do zamówienia</h3>
              <input name="name" placeholder="Imię i nazwisko" required onChange={handleChange} /><br />
              <input name="address" placeholder="Adres zamieszkania" required onChange={handleChange} /><br />
              <input name="email" type="email" placeholder="E-mail" required onChange={handleChange} /><br />
              <input name="phone" placeholder="Telefon" required onChange={handleChange} /><br />
              <button type="submit" style={{
                marginTop: '1rem',
                padding: '0.7rem 1.5rem',
                backgroundColor: '#1b5e20',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}>
                ✅ Potwierdź zamówienie
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
}

export default Cart;
