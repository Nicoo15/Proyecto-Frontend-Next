"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterBusiness() {
  const [name, setName] = useState('');
  const [cif, setCif] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (isAdmin !== 'true') {
      router.push('/admin/login');
      return; // Detener la ejecución si el usuario no está autenticado
    }
  }, [router]);

  const handleRegister = async (e) => {
    e.preventDefault();

    const newBusiness = { name, cif, address, email, phone, password };

    try {
      const response = await fetch('/api/v1/comercio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBusiness),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      alert(result.message);
      router.push('/admin/comercios');
    } catch (error) {
      console.error('Error registering business:', error);
    }
  };

  return (
    <div className="container">
      <h2>Registrar Comercio</h2>
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label>Nombre</label>
          <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>CIF</label>
          <input type="text" className="form-control" value={cif} onChange={(e) => setCif(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Dirección</label>
          <input type="text" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Teléfono</label>
          <input type="text" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Contraseña Temporal</label>
          <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary">Registrar</button>
      </form>
    </div>
  );
}
