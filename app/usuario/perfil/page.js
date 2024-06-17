"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');
  const [interests, setInterests] = useState('');
  const [receiveOffers, setReceiveOffers] = useState(false);
  const router = useRouter();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      router.push('/usuario/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/v1/users?id=${userId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const userData = await response.json();
        setUser(userData);
        setName(userData.name);
        setEmail(userData.email);
        setPassword(userData.password);
        setAge(userData.age);
        setCity(userData.city);
        setInterests(userData.interests.join(', '));
        setReceiveOffers(userData.receiveOffers);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, [router, userId]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = {
        name,
        email,
        password,
        age,
        city,
        interests: interests.split(',').map(i => i.trim()),
        receiveOffers,
      };

      const response = await fetch(`/api/v1/users?id=${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      alert(result.message);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/v1/users?id=${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      alert(result.message);
      localStorage.removeItem('isUser');
      localStorage.removeItem('userId');
      router.push('/');
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container">
      <h2>Perfil de Usuario</h2>
      <form onSubmit={handleSave}>
        <div className="mb-3">
          <label>Nombre</label>
          <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="mb-3">
          <label>Edad</label>
          <input type="number" className="form-control" value={age} onChange={(e) => setAge(e.target.value)} />
        </div>
        <div className="mb-3">
          <label>Ciudad</label>
          <input type="text" className="form-control" value={city} onChange={(e) => setCity(e.target.value)} />
        </div>
        <div className="mb-3">
          <label>Intereses</label>
          <input type="text" className="form-control" value={interests} onChange={(e) => setInterests(e.target.value)} />
        </div>
        <div className="form-check mb-3">
          <input type="checkbox" className="form-check-input" checked={receiveOffers} onChange={(e) => setReceiveOffers(e.target.checked)} />
          <label className="form-check-label">Permite Recibir Ofertas</label>
        </div>
        <button type="submit" className="btn btn-primary">Guardar</button>
        <button type="button" className="btn btn-danger ms-3" onClick={handleDelete}>Darse de Baja</button>
      </form>
    </div>
  );
}
