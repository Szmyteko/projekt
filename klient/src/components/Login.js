import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);

      // Zapisz token i dane użytkownika
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.username);
      localStorage.setItem('role', res.data.role);

      alert('Zalogowano!');
      navigate('/');
    } catch (err) {
      alert('Błędny login lub hasło');
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🔐 Logowanie</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Login"
          value={form.username}
          onChange={handleChange}
          required
        /><br />
        <input
          type="password"
          name="password"
          placeholder="Hasło"
          value={form.password}
          onChange={handleChange}
          required
        /><br />
        <button type="submit">Zaloguj</button>
      </form>
    </div>
  );
}

export default Login;
