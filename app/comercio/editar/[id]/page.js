"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditCommerce() {
  const { id } = useParams();
  const router = useRouter();
  const [commerce, setCommerce] = useState(null);
  const [city, setCity] = useState('');
  const [activity, setActivity] = useState('');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [text, setText] = useState('');
  const [users, setUsers] = useState([]);
  const [interestedUsers, setInterestedUsers] = useState([]);
  const [editingField, setEditingField] = useState('');

  useEffect(() => {
    const isCommerce = localStorage.getItem('isCommerce');
    const commerceId = localStorage.getItem('commerceId');
    if (isCommerce !== 'true' || commerceId !== id) {
      router.push('/comercio/login');
      return;
    }

    const fetchCommerce = async () => {
      try {
        const response = await fetch(`/api/v1/comercio?id=${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCommerce(data);
        setCity(data.city || '');
        setActivity(data.activity || '');
        setTitle(data.title || '');
        setSummary(data.summary || '');
        setText(data.text || '');

        // Fetch users interested in the same activity
        const usersResponse = await fetch(`/api/v1/users?interest=${data.activity}`);
        if (!usersResponse.ok) {
          throw new Error('Network response was not ok');
        }
        const usersData = await usersResponse.json();
        setInterestedUsers(usersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchCommerce();
  }, [id, router]);

  const handleSave = async (field, value) => {
    try {
      const updatedCommerce = { [field]: value };

      const response = await fetch(`/api/v1/comercio?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCommerce),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      alert(result.message);
      setEditingField('');
      setCommerce(prev => ({ ...prev, [field]: value }));
    } catch (error) {
      console.error('Error updating commerce:', error);
    }
  };

  const handleEditClick = (field) => {
    setEditingField(field);
  };

  const handleInputChange = (e, setter) => {
    setter(e.target.value);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/v1/comercio?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      alert(result.message);
      router.push('/comercio/login');
    } catch (error) {
      console.error('Error deleting commerce:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isCommerce');
    localStorage.removeItem('commerceId');
    router.push('/comercio/login');
  };

  if (!commerce) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container">
      <h2>Bienvenido {commerce.name}</h2>
      <button className="btn btn-danger float-end" onClick={handleLogout}>Cerrar Sesión</button>
      <div className="mb-3">
        <label>Ciudad</label>
        {editingField === 'city' ? (
          <div>
            <input type="text" className="form-control" value={city} onChange={(e) => handleInputChange(e, setCity)} />
            <button className="btn btn-primary mt-2" onClick={() => handleSave('city', city)}>Guardar</button>
          </div>
        ) : (
          <div>
            <p>{city}</p>
            <button className="btn btn-secondary" onClick={() => handleEditClick('city')}>Editar</button>
          </div>
        )}
      </div>
      <div className="mb-3">
        <label>Actividad</label>
        {editingField === 'activity' ? (
          <div>
            <input type="text" className="form-control" value={activity} onChange={(e) => handleInputChange(e, setActivity)} />
            <button className="btn btn-primary mt-2" onClick={() => handleSave('activity', activity)}>Guardar</button>
          </div>
        ) : (
          <div>
            <p>{activity}</p>
            <button className="btn btn-secondary" onClick={() => handleEditClick('activity')}>Editar</button>
          </div>
        )}
      </div>
      <div className="mb-3">
        <label>Título</label>
        {editingField === 'title' ? (
          <div>
            <input type="text" className="form-control" value={title} onChange={(e) => handleInputChange(e, setTitle)} />
            <button className="btn btn-primary mt-2" onClick={() => handleSave('title', title)}>Guardar</button>
          </div>
        ) : (
          <div>
            <p>{title}</p>
            <button className="btn btn-secondary" onClick={() => handleEditClick('title')}>Editar</button>
          </div>
        )}
      </div>
      <div className="mb-3">
        <label>Resumen</label>
        {editingField === 'summary' ? (
          <div>
            <input type="text" className="form-control" value={summary} onChange={(e) => handleInputChange(e, setSummary)} />
            <button className="btn btn-primary mt-2" onClick={() => handleSave('summary', summary)}>Guardar</button>
          </div>
        ) : (
          <div>
            <p>{summary}</p>
            <button className="btn btn-secondary" onClick={() => handleEditClick('summary')}>Editar</button>
          </div>
        )}
      </div>
      <div className="mb-3">
        <label>Texto</label>
        {editingField === 'text' ? (
          <div>
            <textarea className="form-control" value={text} onChange={(e) => handleInputChange(e, setText)}></textarea>
            <button className="btn btn-primary mt-2" onClick={() => handleSave('text', text)}>Guardar</button>
          </div>
        ) : (
          <div>
            <p>{text}</p>
            <button className="btn btn-secondary" onClick={() => handleEditClick('text')}>Editar</button>
          </div>
        )}
      </div>
      <button className="btn btn-danger" onClick={handleDelete}>Eliminar Página Web</button>
      <div className="mt-5">
        <h3>Usuarios con posible interés en {activity}</h3>
        <ul className="list-group">
          {interestedUsers.map(user => (
            <li key={user.id} className="list-group-item">
              {user.name} - {user.email}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
