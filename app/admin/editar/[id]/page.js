"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditBusiness() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    cif: '',
    address: '',
    email: '',
    phone: '',
    password: ''
  });
  const router = useRouter();

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await fetch(`/api/v1/comercio?id=${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setFormData({
          name: data.name,
          cif: data.cif,
          address: data.address,
          email: data.email,
          phone: data.phone,
          password: data.password || '' 
        });
      } catch (error) {
        console.error('Error fetching business:', error);
      }
    };

    if (id) {
      fetchBusiness();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/v1/comercio?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      alert(result.message);
      router.push('/admin/comercios');
    } catch (error) {
      console.error('Error updating business:', error);
    }
  };

  return (
    <div className="container">
      <h2>Editar Comercio</h2>
      <form onSubmit={handleSave}>
        <div className="mb-3">
          <label>Nombre</label>
          <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>CIF</label>
          <input type="text" className="form-control" name="cif" value={formData.cif} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Dirección</label>
          <input type="text" className="form-control" name="address" value={formData.address} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Teléfono</label>
          <input type="text" className="form-control" name="phone" value={formData.phone} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label>Contraseña Temporal</label>
          <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-primary">Guardar</button>
      </form>
    </div>
  );
}
