import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', form);
      alert('Zarejestrowano pomyślnie');
      navigate('/login');
    } catch (err) {
      alert('Błąd rejestracji');
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>📝 Rejestracja</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Nazwa użytkownika"
          onChange={handleChange}
          required
        /><br />
        <input
          name="password"
          type="password"
          placeholder="Hasło"
          onChange={handleChange}
          required
        /><br />
        <button type="submit">Zarejestruj</button>
      </form>
    </div>
  );
}

export default Register;
