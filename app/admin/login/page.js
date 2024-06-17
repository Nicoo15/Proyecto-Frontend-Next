"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

async function getAdmin() {
    const response = await fetch('/api/v1/admin');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.admin;
}

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const isAdmin = localStorage.getItem('isAdmin');
        if (isAdmin === 'true') {
            router.push('/admin/comercios');
        }
    }, [router]);


    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        // console.log(email)
        // console.log(password)
        try {
            const admins = await getAdmin();
            console.log(admins)
            const admin = admins.email === email && admins.password === password;
            if (admin) {
                localStorage.setItem('isAdmin', 'true');
                alert(`Admin login con Email: ${email}`);
                router.push('/admin/comercios');
            } else {
                setError('Admin no encontrado');
            }
        } catch (error) {
            setError('Error en la solicitud');
            console.error(error);
        }


    };

    return (
        <div className="container">
            <h2>Admin Login</h2>
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
