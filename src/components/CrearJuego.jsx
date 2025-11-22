import { useState, useEffect } from "react";
import CustomCalendario from "./CustomCalendario.jsx";
import Dropdown from "./Dropdown";
import '../styles/CrearJuego.css'

export default function CrearJuego({ isOpen = false, onClose = () => {}, isEdit = false, initialData = null, onSuccess = () => {} }) {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [genero, setGenero] = useState([]);
  const [plataforma, setPlataforma] = useState([]);
  const [añoLanzamiento, setAñoLanzamiento] = useState(Date);
  const [desarrollador, setDesarrollador] = useState("");
  const [imagenPortada, setImagenPortada] = useState("");
  const [imagen2, setImagen2] = useState("");
  const [imagen3, setImagen3] = useState("");
  const [completado, setCompletado] = useState(false);

  const [mensaje, setMensaje] = useState("");
  const [Errors, setErrors] = useState({});

    // When in edit mode, populate form with initialData
    useEffect(() => {
        if (isEdit && initialData) {
            setTitulo(initialData.titulo || "");
            setDescripcion(initialData.descripcion || "");
            // backend may store genres/platforms as CSV string
            setGenero(initialData.genero ? (typeof initialData.genero === 'string' ? initialData.genero.split(',') : initialData.genero) : []);
            setPlataforma(initialData.plataforma ? (typeof initialData.plataforma === 'string' ? initialData.plataforma.split(',') : initialData.plataforma) : []);
            setAñoLanzamiento(initialData.añoLanzamiento ? new Date(initialData.añoLanzamiento) : (initialData.fechaLanzamiento ? new Date(initialData.fechaLanzamiento) : null));
            setDesarrollador(initialData.desarrollador || "");
            setImagenPortada(initialData.imagenPortada || "");
            setImagen2(initialData.imagen2 || "");
            setImagen3(initialData.imagen3 || "");
            setCompletado(!!initialData.completado);
        }
    }, [isEdit, initialData]);

    // helper: notificación flotante al crear juego
    const MostrarNotificacion = (msg, duration = 3000) => {
        try {
            const notificacion = document.createElement('div');
            notificacion.className = 'notificacion-flotante';
            notificacion.textContent = msg;
            document.body.appendChild(notificacion);
            // force reflow for animation
            // eslint-disable-next-line no-unused-expressions
            notificacion.offsetHeight;
            notificacion.classList.add('visible');
            setTimeout(() => {
                notificacion.classList.remove('visible');
                setTimeout(() => notificacion.remove(), 400);
            }, duration);
        } catch (e) { console.warn('Notificación error', e); }
    }

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
        // Preparar payload: backend espera strings para la mayoría de campos
        const payload = {
            titulo: titulo || "",
            descripcion: descripcion || "",
            // enviar arrays como CSV string (backend espera string)
            genero: Array.isArray(genero) ? genero.join(',') : (genero || ""),
            plataforma: Array.isArray(plataforma) ? plataforma.join(',') : (plataforma || ""),
            // enviar fecha ISO (backend espera Date-ish value)
            añoLanzamiento: añoLanzamiento ? (añoLanzamiento.toISOString ? añoLanzamiento.toISOString() : new Date(añoLanzamiento).toISOString()) : null,
            desarrollador: desarrollador || "",
            imagenPortada: imagenPortada || "",
            imagen2: imagen2 || "",
            imagen3: imagen3 || "",
            completado: !!completado,
        };

        const url = isEdit && initialData && initialData._id ? `${import.meta.env.VITE_API_URL}/api/Games/juegos/id/${initialData._id}` : `${import.meta.env.VITE_API_URL}/api/Games/juegos`;
        const method = isEdit ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const text = await res.text();
        let data;
        try { data = text ? JSON.parse(text) : null; } catch (e) { data = text }

        console.log('Respuesta POST/PUT', res.status, data);

        if (!res.ok) {
            throw new Error(`Error Http ${res.status}: ${JSON.stringify(data)}`);
        }

        // Message depends on create vs edit
        setMensaje(isEdit ? "Juego actualizado correctamente!" : "Juego creado exitosamente!");

                if (!isEdit) {
                    // Resetear estados a sus tipos originales solo cuando se crea
                    setTitulo("");
                    setDescripcion("");
                    setGenero([]);
                    setPlataforma([]);
                    setAñoLanzamiento(null);
                    setDesarrollador("");
                    setImagenPortada("");
                    setImagen2("");
                    setImagen3("");
                    setCompletado(false);
                }

                // Mostrar Notificacion flotante
                MostrarNotificacion(isEdit ? 'Juego actualizado correctamente!' : 'Juego creado exitosamente!');

                // Dispatch evento global para que listas se actualicen
                try {
                    const eventName = isEdit ? 'juego-actualizado' : 'juego-creado';
                    window.dispatchEvent(new CustomEvent(eventName, { detail: data }));
                } catch(e) { console.warn(e) }

                // Informar al caller si proporcionó callback
                try { onSuccess && onSuccess(data); } catch(e) { console.warn(e) }

                // Cerrar modal después de crear/editar exitosamente
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
                    <h2>{isEdit ? 'Editar Juego' : 'Crear Nuevo Juego'}</h2>
                    
                    <label>Titulo:</label>
                    <input type="text" placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />

                    <label>Descripción:</label>
                    <textarea className="descripcion" placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required></textarea>
                    
                    <div className={`multi-select-dropdown ${Errors.genero ? 'error' : ''}`}> 
                        <label>Género:</label>
                        <Dropdown
                            options={['Acción', 'Aventura', 'Estrategia','Supervivencia', 'Plataformas', 'Deportes y Carreras', 'RPG', 'Shooter', 'Mundo Abierto', 'Battle Royale', 'Multijugador', 'Simulación', 'Otros']}
                            selected={genero}
                            onChange={setGenero}
                        />
                        {Errors.genero && <span className="error-text">{Errors.genero}</span>}
                    </div>

                    <div className={`multi-select-dropdown ${Errors.plataforma ? 'error' : ''}`}>
                        <label>Plataforma:</label>
                            <Dropdown
                                options={['PC', 'PlayStation', 'Xbox', 'Nintendo', 'Mobile', 'GameBoy', 'Multiplataforma']}
                                selected={plataforma}
                                onChange={setPlataforma}
                            />
                            {Errors.plataforma && <span className="error-text">{Errors.plataforma}</span>}
                    </div>

                    <div className="fecha-lanzamiento">
                    <label>Fecha de Lanzamiento:</label>
                    <CustomCalendario value={añoLanzamiento} onChange={setAñoLanzamiento} />
                    </div>

                    <label>Desarrollador:</label>
                    <input type="text" placeholder="Desarrollador" value={desarrollador} onChange={(e) => setDesarrollador(e.target.value)} required />

                    <label>URL de imagenes:</label>
                    <div className="imagenes">
                        <input className="url-portada" type="text" placeholder="URL Imagen de Portada" value={imagenPortada} onChange={(e) => setImagenPortada(e.target.value)} required />
                        <input className="url-2" type="text" placeholder="URL Imagen 2" value={imagen2} onChange={(e) => setImagen2(e.target.value)} />
                        <input className="url-3" type="text" placeholder="URL Imagen 3" value={imagen3} onChange={(e) => setImagen3(e.target.value)} />
                        {imagenPortada ? (<img src={imagenPortada} className="preview-portada img-preview" onError={(e) => e.target.style.display = 'none'} />) : null}
                        {imagen2 ? (<img src={imagen2} className="preview-imagen2 img-preview" onError={(e) => e.target.style.display = 'none'} />) : null}
                        {imagen3 ? (<img src={imagen3} className="preview-imagen3 img-preview" onError={(e) => e.target.style.display = 'none'} />) : null}
                    </div>

                    <div>
                        <label>Completado:</label>
                        <input className="check-completado" type="checkbox" checked={completado} onChange={(e) => setCompletado(e.target.checked)} />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="boton-crear">{isEdit ? 'Guardar cambios' : 'Crear Juego'}</button>
                        <button type="button" className="boton-cancelar" onClick={onClose}>Cancelar</button>
                    </div>
                    {mensaje && <p className="mensaje">{mensaje}</p>}
                </form>
            </div>
        </div>
    )
}