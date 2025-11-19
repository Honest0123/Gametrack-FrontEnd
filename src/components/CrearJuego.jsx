import { useState, useEffect } from "react";
import CustomCalendario from "./CustomCalendario.jsx";
import Dropdown from "./Dropdown";
import '../styles/CrearJuego.css'

export default function CrearJuego({ isOpen = false, onClose = () => {} }) {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [genero, setGenero] = useState([]);
  const [plataforma, setPlataforma] = useState([]);
  const [añoLanzamiento, setAñoLanzamiento] = useState(null);
  const [Desarrollador, setDesarrollador] = useState("");
  const [imagenPortada, setImagenPortada] = useState("");
  const [imagen2, setImagen2] = useState("");
  const [imagen3, setImagen3] = useState("");
  const [Completado, setCompletado] = useState(false);

  const [mensaje, setMensaje] = useState("");
  const [Errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    const newErrors = {};

    if (plataforma.length === 0) newErrors.plataforma = "Seleccione al menos una plataforma";
    if (genero.length === 0) newErrors.genero = "Seleccione al menos un género";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/Games/juegos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                titulo,
                descripcion,
                genero,
                plataforma,
                añoLanzamiento,
                Desarrollador,
                imagenPortada,
                imagen2,
                imagen3,
                Completado,
            }),
        })

        if (!res.ok) throw new Error(`Error Http ${res.status}`);

        setMensaje("Juego creado exitosamente!");

        setTitulo("");
        setDescripcion("");
        setGenero("");
        setPlataforma("");
        setAñoLanzamiento("");
        setDesarrollador("");
        setImagenPortada("");
        setImagen2("");
        setImagen3("");
        setCompletado(false);

        // Cerrar modal después de crear exitosamente
        if (onClose) onClose();

    } catch (error) {
        setMensaje("Error al crear el juego");
        console.error(error);
    }
  };
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" aria-label="Cerrar" onClick={onClose}>×</button>
                <form onSubmit={handleSubmit} className="game-form">
                    <h2>Crear Nuevo Juego</h2>
                    
                    <label>Titulo:</label>
                    <input type="text" placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />

                    <label>Descripción:</label>
                    <textarea placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required></textarea>
                    
                    <div className="multi-select-dropdown"> 
                        <label>Género:</label>
                        <Dropdown
                            options={['Acción', 'Aventura', 'Estrategia', 'RPG', 'Deportes', 'Simulación']}
                            selected={genero}
                            onChange={setGenero}
                        />
                    </div>

                    <div className="multi-select-dropdown">
                    <label>Plataforma:</label>
                        <Dropdown
                            options={['PC', 'PlayStation', 'Xbox', 'Nintendo Switch']}
                            selected={plataforma}
                            onChange={setPlataforma}
                        />
                    </div>

                    <div>
                    <label>Año de Lanzamiento:</label>
                    <CustomCalendario value={añoLanzamiento} onChange={setAñoLanzamiento} />
                    </div>

                    <label>Desarrollador:</label>
                    <input type="text" placeholder="Desarrollador" value={Desarrollador} onChange={(e) => setDesarrollador(e.target.value)} required />

                    <label>URL de imagenes:</label>
                    <input type="text" placeholder="URL Imagen de Portada" value={imagenPortada} onChange={(e) => setImagenPortada(e.target.value)} required />
                    <input type="text" placeholder="URL Imagen 2" value={imagen2} onChange={(e) => setImagen2(e.target.value)} />
                    <input type="text" placeholder="URL Imagen 3" value={imagen3} onChange={(e) => setImagen3(e.target.value)} />

                    <div>
                        <label>Completado:</label>
                        <input type="checkbox" checked={Completado} onChange={(e) => setCompletado(e.target.checked)} />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="primary">Crear Juego</button>
                        <button type="button" onClick={onClose}>Cancelar</button>
                    </div>
                    {mensaje && <p className="mensaje">{mensaje}</p>}
                </form>
            </div>
        </div>
    )
}