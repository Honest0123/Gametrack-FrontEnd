import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import Dropdown from "./Dropdown";
import '../styles/Review.css'
import { fetchWithFallback, postWithQueue } from '../utils/apiFallback';

export default function Review({ juegoId }) {
    const [reviews, setReviews] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [puntuacion, setPuntuacion] = useState(5);
    const [textoReseña, setTextoReseña] = useState("");
    const [horasJugadas, setHorasJugadas] = useState(0);
    const [dificultad, setDificultad] = useState('Media');
    const [recomendaria, setRecomendaria] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [mensaje, setMensaje] = useState("");

    const [agregarPuntuacion, setAgregarPuntuacion] = useState('');
    const [agregarTextoReseña, setAgregarTextoReseña] = useState("");
    const [agregarHorasJugadas, setAgregarHorasJugadas] = useState(0);
    const [agregarDificultad, setAgregarDificultad] = useState('');
    const [agregarRecomendaria, setAgregarRecomendaria] = useState(true);
    const [Errors, setErrors] = useState({});

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteError, setDeleteError] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                if (!juegoId) return; // no intentar si no hay id
                const resObj = await fetchWithFallback(`${import.meta.env.VITE_API_URL}/api/Games/Reviews?juegoId=${juegoId}`, 'reviews.json');
                let data = resObj.data;
                if (resObj.source === 'fallback') {
                    // fallback file contains all reviews — filter by juegoId
                    data = Array.isArray(data) ? data.filter(r => String(r.juegoId) === String(juegoId)) : [];
                }
                setReviews(data || []);
            } catch (error) {
                setError(error.message || String(error));
                console.error('Error al obtener la reseña:', error);
            } finally {
                setCargando(false);
            }
        };

        fetchReviews();
    }, [juegoId]);

    const fetchReviews = async () => {
            try {
                if (!juegoId) return; // no intentar si no hay id
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

    if (error) return <p>Error al cargar la reseña: {error}</p>;

    if (cargando) return <p>Cargando reseña...</p>;

    const deleteReview = async (reviewId) => {
        try {
            if (!reviewId) return;
            setIsDeleting(true);
            setDeleteError(null);

            const url = `${import.meta.env.VITE_API_URL}/api/Games/reviews/id/${reviewId}`;
            const res = await fetch(url, {
                method: 'DELETE',
                headers: { 'Accept': 'application/json' },
            });
        } catch (error) {
            setDeleteError(error.message);
            console.error('Error al eliminar la reseña:', error);
        } finally {
            setIsDeleting(false);
            fetchReviews(); // refrescar lista tras eliminar
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!juegoId) return setError('Falta juegoId');
        setSubmitting(true);
        setMensaje('');

        const newErrors = {};
        const punt = Number(agregarPuntuacion);
        if (!agregarPuntuacion || isNaN(punt) || punt < 1 || punt > 5) {
            newErrors.agregarPuntuacion = 'La puntuación debe estar entre 1 y 5.';
        }

        if (!agregarDificultad) {
            newErrors.agregarDificultad = 'La dificultad es obligatoria.';
        }

        const horas = Number(agregarHorasJugadas);
        if (isNaN(horas) || horas < 0) {
            newErrors.agregarHorasJugadas = 'Las horas jugadas no pueden ser negativas.';
        }
        
        
        
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            setSubmitting(false);
            return;
        }

        try {
            const payload = {
                juegoId,
                puntuacion: Number(agregarPuntuacion),
                textoReseña: agregarTextoReseña || textoReseña || '',
                horasJugadas: Number(agregarHorasJugadas) || 0,
                dificultad: agregarDificultad,
                recomendaria: typeof agregarRecomendaria === 'boolean' ? agregarRecomendaria : !!recomendaria,
            };

            const result = await postWithQueue(`${import.meta.env.VITE_API_URL}/api/Games/reviews`, payload, 'pendingReviews');
            // result.data contains either server-created object or local queued object
            setReviews((prev) => [result.data, ...prev]);
            if (result.ok && result.source === 'api') {
                setMensaje('Reseña creada correctamente');
            } else {
                setMensaje('Reseña guardada localmente. Se intentará subir cuando haya conexión.');
            }
            setShowForm(false);

            // Dispatch global event for other components
            try { window.dispatchEvent(new CustomEvent('review-creada', { detail: result.data })); } catch(e) { console.warn(e) }

            // reset form (both add-* and main fields)
            setAgregarPuntuacion('');
            setAgregarTextoReseña('');
            setAgregarHorasJugadas(0);
            setAgregarDificultad('Media');
            setAgregarRecomendaria(true);
            setPuntuacion(5);
            setTextoReseña('');
            setHorasJugadas(0);
            setDificultad('Media');
            setRecomendaria(true);

        } catch (err) {
            console.error('Error creando review:', err);
            setMensaje(`Error: ${err.message || 'No se pudo crear la reseña'}`);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="reviews">
            <h2>Reseñas</h2>
            <button className="agregar-review-button" onClick={() => setShowForm(true)}>Nueva Review</button>

            {mensaje && <p className="mensaje">{mensaje}</p>}

            {showForm && (
                <form className="review-form" onSubmit={handleSubmit}>
                    <div className={`multi-select-dropdown ${Errors.agregarPuntuacion ? 'error' : ''}`}> 
                        <label>Puntuacion:</label>
                        
                        <Dropdown
                            options={['1', '2', '3', '4', '5']}
                            selected={agregarPuntuacion}
                            onChange={setAgregarPuntuacion}
                        />
                        {Errors.agregarPuntuacion && <span className="error-text">{Errors.agregarPuntuacion}</span>}
                    </div>

                    <label>Texto:</label>
                    <textarea value={agregarTextoReseña} onChange={(e) => setAgregarTextoReseña(e.target.value)} required />

                    <label>Horas jugadas:</label>
                    <input type="number" min="1" value={agregarHorasJugadas} onChange={(e) => setAgregarHorasJugadas(e.target.value)} required />

                    <div className={`multi-select-dropdown ${Errors.agregarDificultad ? 'error' : ''}`}> 
                        <label>Dificultad:</label>
                        <Dropdown
                            options={['Baja','Media','Alta']}
                            selected={agregarDificultad}
                            onChange={setAgregarDificultad}
                        />
                        {Errors.agregarDificultad && <span className="error-text">{Errors.agregarDificultad}</span>}
                    </div>

                    <label>Recomendaría:</label>
                    <input type="checkbox" checked={agregarRecomendaria} onChange={(e) => setAgregarRecomendaria(e.target.checked)} />

                    <div className="review-actions">
                        <button type="submit" disabled={submitting}>{submitting ? 'Enviando...' : 'Enviar reseña'}</button>
                        <button type="button" onClick={() => setShowForm(false)} disabled={submitting}>Cancelar</button>
                    </div>
                </form>
            )}

            {reviews.length === 0 ? (
                <p>No hay reseñas disponibles para este juego.</p>
            ) : (
                reviews.map((review) => (
                    <div key={review._id} className="review">
                        <div className="review-calificacion">
                            <div className="div-flex">
                            <p>Calificación:</p>
                                {
                                    Array.from({ length: 5 }, (_, i) => (<Icon key={i} icon={i < review.puntuacion ? "icon-park-solid:star" : "icon-park-outline:star"} />))
                                }
                                </div>
                            <button className="modal-edit" onClick={() => setShowDeleteConfirm(true)}><Icon icon="octicon:trashcan" /></button>
                        </div>
                        <div className="review-texto">
                            <p>{review.textoReseña}</p>
                        </div>
                        <div className="review-detalles">
                            <p className="review-horas">Horas: {review.horasJugadas}</p>
                            <p className="review-dificultad">Dificultad: {review.dificultad}</p>
                            <p className="review-recomendado">Recomendado: {review.recomendaria ? "Sí" : "No"}</p>
                        </div>
                        {showDeleteConfirm && (
                            <div className="confirm-overlay" onClick={() => { if (!isDeleting) setShowDeleteConfirm(false) }}>
                                <div className="confirm-overlay-container" onClick={(e) => e.stopPropagation()}>
                                    <p>¿Eliminar esta reseña? Esta acción no se puede deshacer.</p>
                                    {deleteError && <p className="error-text">{deleteError}</p>}
                                    <div className="confirm-actions">
                                        <button className="confirm-yes" onClick={async () => { await deleteReview(review._id); setShowDeleteConfirm(false); }} disabled={isDeleting}>{isDeleting ? 'Eliminando...' : 'Eliminar'}</button>
                                        <button className="confirm-no" onClick={() => setShowDeleteConfirm(false)} disabled={isDeleting}>Cancelar</button>
                                    </div>
                                </div>
                            </div>
        )}
                    </div>
                ))
            )}
            
        </div>
    );
}