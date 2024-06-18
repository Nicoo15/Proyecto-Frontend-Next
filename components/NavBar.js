"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NavBar() {
  const router = useRouter();
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    const isUser = localStorage.getItem('isUser') === 'true';
    setIsUserLoggedIn(isUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isUser');
    localStorage.removeItem('userId');
    router.push('/usuario/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow">
      <div className="container-fluid">
        <Link href="/" className="navbar-brand color-principal">COMMERCE</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link href="/admin/login" className="nav-link">Admin</Link>
            </li>
            <li className="nav-item">
              <Link href="/comercio/login" className="nav-link">Comercio</Link>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Usuario
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                {isUserLoggedIn ? (
                  <>
                    <li>
                      <Link href="/usuario/perfil" className="dropdown-item">Perfil</Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>Cerrar Sesión</button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link href="/usuario/login" className="dropdown-item">Inicio de Sesión</Link>
                    </li>
                    <li>
                      <Link href="/usuario/register" className="dropdown-item">Registro</Link>
                    </li>
                  </>
                )}
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
