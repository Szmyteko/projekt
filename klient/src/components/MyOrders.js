import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      console.warn("⚠️ Brak tokenu — zapytanie nie zostanie wykonane.");
      return;
    }

    console.log("🧠 Token w MyOrders:", token);
    console.log("📡 Wysyłam zapytanie do /api/myorders...");

    axios.get('http://localhost:5000/api/myorders', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      console.log("✅ Odpowiedź z backendu:", res.data);
      setOrders(res.data);
    })
    .catch(err => {
      console.error('❌ Błąd pobierania zamówień:', err);
      if (err.response) {
        console.error("📄 Odpowiedź serwera:", err.response.status, err.response.data);
      }
      setOrders([]);
    });
  }, [token]);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>📜 Moje zamówienia</h2>
      {orders.length === 0 ? (
        <p>Brak zamówień.</p>
      ) : (
        orders.map(order => (
          <div
            key={order.id}
            style={{
              marginBottom: '2rem',
              borderBottom: '1px solid #ccc',
              paddingBottom: '1rem',
              backgroundColor: '#f9f9f9',
              padding: '1rem',
              borderRadius: '6px'
            }}
          >
            <p><strong>🧾 Zamówienie nr {order.id}</strong></p>
            <p>📅 Data: {new Date(order.created_at).toLocaleString()}</p>
            <p>📍 Adres: {order.address}</p>
            <p>📧 Email: {order.email}</p>
            <p>📞 Telefon: {order.phone}</p>
            <p>📦 Status: <strong>{order.status || 'brak'}</strong></p>

            <ul>
              {order.items.map((item, idx) => (
                <li key={idx}>
                  {item.name || item.vegetable_name || 'Nazwa nieznana'} – {item.quantity} szt. – {item.price != null ? `${item.price.toFixed(2)} zł` : 'brak ceny'}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}

export default MyOrders;
