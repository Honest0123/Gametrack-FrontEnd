import { use, useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import Review from "./Review.jsx";
import '../styles/JuegoCompleto.css'
import CrearJuego from "./CrearJuego.jsx";

export default function JuegoCompleto({ data, calificacion, isOpen = false, onClose }) {

    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    const deleteJuego = async () => {
        try {
            if (!data || !data._id) return;

            setIsDeleting(true);
            setDeleteError(null);

            const url = `${import.meta.env.VITE_API_URL}/api/Games/juegos/id/${data._id}`;

            const res = await fetch(url, {
                method: 'DELETE',
                headers: { 'Accept': 'application/json' },
            });

            const text = await res.text();
            let body;
            try { body = text ? JSON.parse(text) : null; } catch(e) { body = text }

            if (!res.ok) {
                const message = body && body.message ? body.message : `HTTP ${res.status}`;
                setDeleteError(message);
                setIsDeleting(false);
                throw new Error(`Error Http ${res.status}: ${JSON.stringify(body)}`);
            }

            // Notify other parts of the app that the juego was deleted
            try {
                window.dispatchEvent(new CustomEvent('juego-eliminado', { detail: { _id: data._id, data: body } }))
            } catch(e) {
                console.warn(e)
            }

            // Close the detail modal after successful deletion
            if (onClose) onClose();

            setIsDeleting(false);
            return;
        } catch (error) {
            console.error('Error al eliminar el juego:', error);
            setIsDeleting(false);
            // leave deleteError set for UI
        }
    };


    // Nota: la apertura del modal la maneja el padre (Index.jsx)

    if (!isOpen) return null;

    if (!data) return null;

    const estrellas = Array.from({ 
        length: 5 }, (_, i) => (
        <Icon key={i} icon={i < calificacion ? "icon-park-solid:star" : "icon-park-outline:star"} />
      ));



    return (
        <>
        <div className="overlay-juego-completo" onClick={() => onClose && onClose()}>
            <div className="modal-juego" onClick={(e) => e.stopPropagation()}>
                {/* <button className="modal-close" aria-label="Cerrar" onClick={() => onClose && onClose()}>×</button> */}
                <div className="modal-botones">
                    <button className="modal-edit" aria-label="Editar" onClick={() => setIsEditing(true)}><Icon icon="tabler:edit" /></button>
                    <button className="modal-delete" aria-label="Eliminar" onClick={() => setShowDeleteConfirm(true)} disabled={isDeleting}><Icon icon="octicon:trashcan" /></button>
                </div>
                <div className="info-primera">
                    <h3 className="titulo-juego">{data.titulo}</h3>
                    <div className="calificacion">{estrellas}</div>
                </div>
                <div className="div-flex">
                    <div className="div-flex">
                        <p>Desarrollador:</p><p className="highlight">{data.desarrollador}</p>
                    </div>
                    <div className="div-flex">
                        <p>Lanzamiento:</p><p className="highlight">{data.fechaLanzamiento ? data.fechaLanzamiento.split("T")[0] : (data.añoLanzamiento ? data.añoLanzamiento.split("T")[0] : '')}</p>
                    </div>
                </div>
                <div className="info-imagenes-completo">
                    {data.imagenPortada && <img src={data.imagenPortada} alt={"imagen de " + data.titulo} className="imagen-1-completo" />}
                    {data.imagen2 && <img src={data.imagen2} alt={"imagen de " + data.titulo} className="imagen-2-completo" />}
                    {data.imagen3 && <img src={data.imagen3} alt={"imagen de " + data.titulo} className="imagen-3-completo" />}
                </div>
                <div className="div-flex">
                    <div className="div-flex">
                        <p>Género:</p><p className="genero-juego-completo">{data.genero}</p>
                    </div>
                    <div className="div-flex">
                        <p>Completado:</p><p className={data.completado ? "estado-completado-si" : "estado-completado-no"}>{data.completado ? "Sí" : "No"}</p>
                    </div>
                </div>
                <p className="descripcion-juego">{data.descripcion}</p>
                <p className="plataformas-juego-completo">{data.plataforma}</p>

                <Review juegoId={data._id} />
            </div>
        </div>
        {/* Formulario de edición reutilizando CrearJuego en modo edición */}
        <CrearJuego
            isOpen={isEditing}
            onClose={() => setIsEditing(false)}
            isEdit={true}
            initialData={data}
            onSuccess={(updated) => {
                try {
                    window.dispatchEvent(new CustomEvent('juego-actualizado', { detail: updated }));
                    console.log("Test");
                    
                } catch(e) {
                    console.warn(e)
                }
                setIsEditing(false);
                // Optionally close the detail modal so the list reflects the change
                if (onClose) onClose();
            }}
        />
        {/* Confirmación de eliminación */}
        {showDeleteConfirm && (
            <div className="confirm-overlay" onClick={() => { if (!isDeleting) setShowDeleteConfirm(false) }}>
                <div className="confirm-overlay-container" onClick={(e) => e.stopPropagation()}>
                    <p>¿Eliminar "{data.titulo}"? Esta acción no se puede deshacer.</p>
                    {deleteError && <p className="error-text">{deleteError}</p>}
                    <div className="confirm-actions">
                        <button className="confirm-yes" onClick={async () => { await deleteJuego(); setShowDeleteConfirm(false); }} disabled={isDeleting}>{isDeleting ? 'Eliminando...' : 'Eliminar'}</button>
                        <button className="confirm-no" onClick={() => setShowDeleteConfirm(false)} disabled={isDeleting}>Cancelar</button>
                    </div>
                </div>
            </div>
        )}
        </>
    );
}