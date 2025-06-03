import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UserList() {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;

    axios.get('http://localhost:5000/api/users', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => setUsers(res.data))
    .catch(err => console.error('❌ Błąd pobierania użytkowników:', err));
  }, [token]);

  const handleRoleChange = (id, newRole) => {
    axios.put(`http://localhost:5000/api/users/${id}/role`, { role: newRole }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(() => {
      setUsers(prev =>
        prev.map(user =>
          user.id === id ? { ...user, role: newRole } : user
        )
      );
    })
    .catch(err => console.error('❌ Błąd zmiany roli:', err));
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>👥 Lista użytkowników</h2>
      {users.length === 0 ? (
        <p>Brak użytkowników.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nazwa użytkownika</th>
              <th>Rola</th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid #ccc' }}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={e => handleRoleChange(user.id, e.target.value)}
                  >
                    <option value="admin">admin</option>
                    <option value="worker">worker</option>
                    <option value="client">client</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UserList;
