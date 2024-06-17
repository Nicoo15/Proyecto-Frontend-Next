"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterUser() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');
  const [interests, setInterests] = useState('');
  const [receiveOffers, setReceiveOffers] = useState(false);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();

    const newUser = { name, email, password, age, city, interests, receiveOffers };

    try {
      const response = await fetch('/api/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      alert(result.message);
      router.push('/');
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  return (
    <div className="container">
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label>Nombre</label>
          <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Edad</label>
          <input type="number" className="form-control" value={age} onChange={(e) => setAge(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Ciudad</label>
          <input type="text" className="form-control" value={city} onChange={(e) => setCity(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Intereses</label>
          <input type="text" className="form-control" value={interests} onChange={(e) => setInterests(e.target.value)} required />
        </div>
        <div className="form-check mb-3">
          <input type="checkbox" className="form-check-input" checked={receiveOffers} onChange={(e) => setReceiveOffers(e.target.checked)} />
          <label className="form-check-label">Permite Recibir Ofertas</label>
        </div>
        <button type="submit" className="btn btn-primary">Registrar</button>
      </form>
    </div>
  );
}
