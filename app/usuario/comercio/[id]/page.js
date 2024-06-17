"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ViewBusiness() {
  const params = useParams();
  const { id } = params;
  const router = useRouter();
  const [business, setBusiness] = useState(null);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState(0);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await fetch(`/api/v1/comercio?id=${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setBusiness(data);
      } catch (error) {
        console.error('Error fetching business:', error);
      }
    };

    if (id) {
      fetchBusiness();
    }

    const isUser = localStorage.getItem('isUser');
    setIsUserLoggedIn(isUser === 'true');
  }, [id]);

  const handleCreateReview = async () => {
    if (isUserLoggedIn) {
      try {
        const userName = localStorage.getItem('userName'); // Retrieve user name from localStorage
        const newReview = {
          user: userName,
          comment: reviewComment,
          rating: reviewRating,
        };

        const response = await fetch(`/api/v1/reviews?id=${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newReview),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        alert(result.message);
        setReviewComment('');
        setReviewRating(0);
        // Optionally, refetch the business to update the reviews
        fetchBusiness();
      } catch (error) {
        console.error('Error creating review:', error);
      }
    } else {
      router.push('/user/login');
    }
  };

  if (!business) return <div>Cargando...</div>;

  return (
    <div className="container">
      <h1 className="my-5">{business.title}</h1>
      <h2>{business.name}</h2>
      <p><strong>Ciudad:</strong> {business.city}</p>
      <p><strong>Actividad:</strong> {business.activity}</p>
      <p>{business.summary}</p>
      <p>{business.text}</p>

      <div className="my-4">
        <h3>Crear Reseña</h3>
        <div className="mb-3">
          <label>Comentario</label>
          <textarea
            className="form-control"
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            disabled={!isUserLoggedIn}
          ></textarea>
        </div>
        <div className="mb-3">
          <label>Puntuación</label>
          <input
            type="number"
            className="form-control"
            value={reviewRating}
            onChange={(e) => setReviewRating(parseFloat(e.target.value))}
            min="1"
            max="5"
            disabled={!isUserLoggedIn}
          />
        </div>
        <button className="btn btn-primary" onClick={handleCreateReview} disabled={!isUserLoggedIn}>
          Crear Reseña
        </button>
        {!isUserLoggedIn && (
          <div className="alert alert-warning mt-3">
            Por favor, inicia sesión para crear una reseña.
          </div>
        )}
        <h3>Reseñas</h3>
        <p><strong>Puntuación:</strong> {business.scoring.toFixed(1)} ({business.numberOfRatings} valoraciones)</p>
        <ul className="list-group">
          {business.reseñas && business.reseñas.length > 0 ? (
            business.reseñas.map((review, index) => (
              <li key={index} className="list-group-item">
                <p><strong>{review.user}</strong> ({review.rating} estrellas)</p>
                <p>{review.comment}</p>
              </li>
            ))
          ) : (
            <li className="list-group-item">No hay reseñas disponibles.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
