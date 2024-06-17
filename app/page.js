"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import NavBar from "@/components/NavBar";

export default function HomePage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [businesses, setBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);

  useEffect(() => {
    setIsClient(true);

    const fetchBusinesses = async () => {
      try {
        const response = await fetch('/api/v1/comercio');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setBusinesses(data);
        setFilteredBusinesses(data);
      } catch (error) {
        console.error('Error fetching businesses:', error);
      }
    };

    fetchBusinesses();
  }, []);

  if (!isClient) return <div>Cargando...</div>;

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const results = businesses.filter(business =>
      business.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
      business.address.toLowerCase().includes(e.target.value.toLowerCase()) ||
      business.activity.toLowerCase().includes(e.target.value.toLowerCase()) ||
      business.city.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredBusinesses(results);
  };

  return (
    <div className="container">
      <h1 className="my-5 text-center">Bienvenido a la Aplicación de COMMERCE</h1>
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar comercios por nombre, ciudad o actividad"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <div className="row">
        {filteredBusinesses.map((business) => (
          <div key={business.id} className="col-md-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{business.name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{business.city}</h6>
                <p className="card-text">{business.activity}</p>
                <a href={`/usuario/comercio/${business.id}`} className="btn btn-primary">Ver más</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
