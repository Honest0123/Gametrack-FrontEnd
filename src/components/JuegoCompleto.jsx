import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import Review from "./Review.jsx";
import '../styles/JuegoCompleto.css'

export default function JuegoCompleto({ data, calificacion, isOpen = false, onClose }) {

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    // Nota: la apertura del modal la maneja el padre (Index.jsx)

    if (!isOpen) return null;

    if (!data) return null;

    const estrellas = Array.from({ 
        length: 5 }, (_, i) => (
        <Icon key={i} icon={i < calificacion ? "icon-park-solid:star" : "icon-park-outline:star"} />
      ));



    return (
        <div className="overlay-juego-completo" onClick={() => onClose && onClose()}>
            <div className="modal-juego" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" aria-label="Cerrar" onClick={() => onClose && onClose()}>×</button>
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
                <div className="info-imagenes">
                    {data.imagenPortada && <img src={data.imagenPortada} alt={"imagen de " + data.titulo} className="imagen-1" />}
                    {data.imagen2 && <img src={data.imagen2} alt={"imagen de " + data.titulo} className="imagen-2" />}
                    {data.imagen3 && <img src={data.imagen3} alt={"imagen de " + data.titulo} className="imagen-3" />}
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
    );
}