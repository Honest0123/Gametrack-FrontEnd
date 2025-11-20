import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
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
                <div className="info-segunda">
                    <p className="fecha-lanzamiento">Lanzamiento: {data.fechaLanzamiento ? data.fechaLanzamiento.split("T")[0] : (data.añoLanzamiento ? data.añoLanzamiento.split("T")[0] : '')}</p>
                    <p className="genero-juego">{data.genero}</p>
                </div>
                <div className="info-imagenes">
                    {data.imagenPortada && <img src={data.imagenPortada} alt={"imagen de " + data.titulo} className="imagen-1" />}
                    {data.imagen2 && <img src={data.imagen2} alt={"imagen de " + data.titulo} className="imagen-2" />}
                    {data.imagen3 && <img src={data.imagen3} alt={"imagen de " + data.titulo} className="imagen-3" />}
                </div>
                <p className="check-completado">Completado: {data.completado ? "Sí" : "No"}</p>
                <p className="descripcion-juego">{data.descripcion}</p>
                <p className="plataformas-juego">{data.plataformas}</p>
                <p className="desarrollador-juego">Desarrollador: {data.desarrollador}</p>
            </div>
        </div>
    );
}