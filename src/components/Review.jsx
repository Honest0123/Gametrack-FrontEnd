import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import '../styles/Review.css'

export default function Review({ juegoId }) {
    const [reviews, setReviews] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/Games/Reviews?juegoId=${juegoId}`);
                if (res.ok) {
                    const data = await res.json();
                    setReviews(data);
                    setCargando(false);
                    return;
                }
                throw new Error(`Error Http ${res.status}`);

            } catch (error) {
                setError(error.message);
                console.error('Error al obtener la reseña:', error);
            }
        };

        fetchReviews();
    }, [juegoId]);

    if (error) return <p>Error al cargar la reseña: {error}</p>;

    if (cargando) return <p>Cargando reseña...</p>;

    return (
        <div className="reviews">
            <h2>Reseñas</h2>
            {reviews.length === 0 ? (
                <p>No hay reseñas disponibles para este juego.</p>
            ) : (
                reviews.map((review) => (
                    <div key={review._id} className="review">
                        <div className="review-calificacion">
                            <p>Calificación:</p>
                                {
                                    Array.from({ length: 5 }, (_, i) => (<Icon key={i} icon={i < review.puntuacion ? "icon-park-solid:star" : "icon-park-outline:star"} />))
                                }
                        </div>
                        <div className="review-texto">
                            <p>{review.textoReseña}</p>
                        </div>
                        <div className="review-detalles">
                            <p className="review-horas">Horas: {review.horasJugadas}</p>
                            <p className="review-dificultad">Dificultad: {review.dificultad}</p>
                            <p className="review-recomendado">Recomendado: {review.recomendaria ? "Sí" : "No"}</p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}