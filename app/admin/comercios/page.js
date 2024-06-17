"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Businesses() {
  const [filter, setFilter] = useState('');
  const [businesses, setBusinesses] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin');
    if (isAdmin !== 'true') {
      router.push('/admin/login');
      return; // Detener la ejecución si el usuario no está autenticado
    }

    const fetchBusinesses = async () => {
      try {
        const response = await fetch('/api/v1/comercio');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setBusinesses(data);
      } catch (error) {
        console.error('Error fetching businesses:', error);
      }
    };

    fetchBusinesses();
  }, [router]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/v1/comercio?id=${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      alert(result.message);

      const updatedBusinesses = businesses.filter(business => business.id !== id);
      setBusinesses(updatedBusinesses);
    } catch (error) {
      console.error('Error deleting business:', error);
    }
  };

  const filteredBusinesses = businesses.filter((business) =>
    business.name.includes(filter) || business.address.includes(filter)
  );

  return (
    <div className="container">
      <h2>Comercios</h2>
      <button className='btn btn-primary mb-3' onClick={() => router.push("register")}>Nuevo Comercio</button>
      <input
        type="text"
        placeholder="Filtrar por nombre o dirección"
        className="form-control mb-3"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
      <ul className="list-group">
        {filteredBusinesses.map((business) => (
          <li key={business.id} className="list-group-item">
            {business.name} - {business.address}
            <button className='btn btn-primary float-end me-2' onClick={() => router.push(`editar/${business.id}`)}>Editar</button>
            <button className="btn btn-danger float-end" onClick={() => handleDelete(business.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
