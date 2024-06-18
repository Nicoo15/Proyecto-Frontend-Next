"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

async function getUsers() {
  const response = await fetch('/api/v1/users');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data;
}

export default function UserLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const isUser = localStorage.getItem('isUser');
    const userId = localStorage.getItem('userId');
    if (isUser === 'true' && userId) {
      router.push('/usuario/perfil');
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const users = await getUsers();
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        localStorage.setItem('isUser', 'true');
        localStorage.setItem('userId', user.id);
        localStorage.setItem('userName', user.name); // Store user name
        alert(`Usuario login con Email: ${email}`);
        router.push('/usuario/perfil');
      } else {
        setError('Usuario no encontrado o contraseña incorrecta');
      }
    } catch (error) {
      setError('Error en la solicitud');
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h2>Usuario Login</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label>Email</label>
          <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
}
