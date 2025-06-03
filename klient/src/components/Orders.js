import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Orders() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  useEffect(() => {
    axios.get('http://localhost:5000/api/orders/all', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setOrders(res.data))
    .catch(err => console.error('❌ Błąd pobierania zamówień:', err));
  }, [token]);

  const handleStatusChange = (orderId, newStatus) => {
    axios.patch(`http://localhost:5000/api/orders/${orderId}/status`, { status: newStatus }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    })
    .catch(err => {
      console.error('❌ Błąd zmiany statusu:', err);
      alert('Nie udało się zaktualizować statusu.');
    });
  };

  const handleDelete = (orderId) => {
    if (!window.confirm('Czy na pewno chcesz usunąć to zamówienie?')) return;

    axios.delete(`http://localhost:5000/api/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      return axios.get('http://localhost:5000/api/orders/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
    })
    .then(res => {
      setOrders(res.data);
    })
    .catch(err => {
      console.error('❌ Błąd usuwania zamówienia:', err);
      alert('Nie udało się usunąć zamówienia.');
    });
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>📦 Wszystkie zamówienia</h2>
      {orders.length === 0 ? (
        <p>Brak zamówień</p>
      ) : (
        orders.map(order => (
          <div
            key={order.id}
            style={{
              marginBottom: '2rem',
              border: '1px solid #ccc',
              padding: '1rem',
              borderRadius: '8px',
              backgroundColor: '#e8f5e9'
            }}
          >
            <h3>Zamówienie #{order.id}</h3>
            <p><strong>Imię i nazwisko:</strong> {order.name}</p>
            <p><strong>Adres:</strong> {order.address}</p>
            <p><strong>Email:</strong> {order.email}</p>
            <p><strong>Telefon:</strong> {order.phone}</p>
            <p><strong>Data:</strong> {new Date(order.created_at).toLocaleString()}</p>

            <p>
              <strong>Status:</strong>{' '}
              {role === 'worker' || role === 'admin' ? (
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                >
                  <option value="oczekujące">oczekujące</option>
                  <option value="w trakcie realizacji">w trakcie realizacji</option>
                  <option value="wysłane">wysłane</option>
                </select>
              ) : (
                <strong>{order.status}</strong>
              )}
            </p>

            <h4>Pozycje:</h4>
            <ul>
              {order.items.map((item, index) => (
                <li key={index}>
                  {item.vegetable_name} – {item.quantity} szt. × {item.price.toFixed(2)} zł
                </li>
              ))}
            </ul>

            {(role === 'admin' || role === 'worker') && (
              <button
                style={{ marginTop: '1rem', backgroundColor: '#c62828', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px' }}
                onClick={() => handleDelete(order.id)}
              >
                🗑 Usuń zamówienie
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;
