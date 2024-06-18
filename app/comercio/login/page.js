"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

async function getCommerces() {
  const response = await fetch('/api/v1/comercio');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data;
}

export default function CommerceLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const isCommerce = localStorage.getItem('isCommerce');
    const commerceId = localStorage.getItem('commerceId');
    if (isCommerce === 'true' && commerceId) {
      router.push(`/comercio/editar/${commerceId}`);
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const commerces = await getCommerces();
      const commerce = commerces.find(com => com.email === email && com.password === password);
      if (commerce) {
        localStorage.setItem('isCommerce', 'true');
        localStorage.setItem('commerceId', commerce.id);
        alert(`Comercio login con Email: ${email}`);
        router.push(`/comercio/editar/${commerce.id}`);
      } else {
        setError('Comercio no encontrado o contraseña incorrecta');
      }
    } catch (error) {
      setError('Error en la solicitud');
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h2>Comercio Login</h2>
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
