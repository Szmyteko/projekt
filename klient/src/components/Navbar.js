import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <nav style={{
      background: '#1b5e20',
      padding: '1rem',
      display: 'flex',
      justifyContent: 'center',
      gap: '1.5rem',
      flexWrap: 'wrap',
      borderBottom: '2px solid #388e3c'
    }}>
      <Link to="/" style={linkStyle}>🏠 Dom</Link>
      <Link to="/vegetables" style={linkStyle}>🥕 Warzywa</Link>
      <Link to="/categories" style={linkStyle}>📦 Kategorie</Link>

      {(role === 'admin' || role === 'worker') && (
        <>
          <Link to="/add-vegetable" style={linkStyle}>➕ Dodaj warzywo</Link>
          <Link to="/add-category" style={linkStyle}>➕ Dodaj kategorię</Link>
          <Link to="/orders" style={linkStyle}>📦 Zamówienia</Link>
        </>
      )}

      {role === 'admin' && (
        <Link to="/users" style={linkStyle}>👥 Użytkownicy</Link>
      )}

      {role === 'client' && (
        <>
          <Link to="/cart" style={linkStyle}>🛒 Koszyk</Link>
          <Link to="/my-orders" style={linkStyle}>🧾 Moje zamówienia</Link>
        </>
      )}

      <div style={{ marginLeft: 'auto' }}>
        {token ? (
          <>
            <span style={{ color: '#ffffff', marginRight: '1rem' }}>👤 {username} ({role})</span>
            <button onClick={handleLogout} style={buttonStyle}>Wyloguj</button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle}>🔐 Zaloguj</Link>
            <Link to="/register" style={linkStyle}>📝 Rejestracja</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const linkStyle = {
  color: '#ffffff',
  textDecoration: 'none',
  fontWeight: 'bold'
};

const buttonStyle = {
  backgroundColor: '#388e3c',
  color: '#fff',
  padding: '0.5rem 1rem',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 'bold'
};

export default Navbar;
