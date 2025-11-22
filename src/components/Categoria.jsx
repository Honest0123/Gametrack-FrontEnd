import TarjetaDeJuego from "./TarjetaDeJuego.jsx";
import { useEffect, useState } from "react";
import { fetchWithFallback } from '../utils/apiFallback';

export default function Categoria({ nombre }) {
  const [juegos, setJuegos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJuegos = async () => {
      try {
        const resObj = await fetchWithFallback(`${import.meta.env.VITE_API_URL}/api/Games/juegos?genero=${nombre}`, 'juegos.json');
        let data = resObj.data;
        if (resObj.source === 'fallback') {
          // filter fallback juegos by genero (fallback stores genero as CSV string)
          data = Array.isArray(data) ? data.filter(j => {
            const gen = typeof j.genero === 'string' ? j.genero.split(',').map(s => s.trim()) : (Array.isArray(j.genero) ? j.genero : []);
            return gen.includes(nombre);
          }) : [];
        }
        setJuegos(data || []);
      } catch (error) {
        console.error('Error al obtener los juegos:', error);
        setError(error.message || String(error));
      } finally {
        setCargando(false);
      }
    }

    fetchJuegos();

    // listener para agregar juego creado en tiempo real
    const handleNuevoJuego = (e) => {
      try {
        const nuevo = e?.detail;
        if (!nuevo) return;
        // nuevo.genero puede ser string CSV o array
        let generos = [];
        if (Array.isArray(nuevo.genero)) generos = nuevo.genero;
        else if (typeof nuevo.genero === 'string') generos = nuevo.genero.split(',').map(s => s.trim()).filter(Boolean);
        // si el nuevo juego pertenece a esta categoria, insertarlo al inicio
        if (generos.includes(nombre)) {
          setJuegos(prev => {
            // evitar duplicados por _id
            if (prev.some(j => j._id === nuevo._id)) return prev;
            return [nuevo, ...prev];
          });
        }
      } catch(err){ console.warn('handleNuevoJuego', err) }
    }

    const handleJuegoActualizado = (e) => {
      try {
        const actualizado = e?.detail;
        if (!actualizado) return;

        fetchJuegos(); // refrescar toda la lista
        
      } catch(err) {
        console.warn('handleJuegoActualizado', err)
      }
    }

    window.addEventListener('juego-actualizado', handleJuegoActualizado);
    window.addEventListener('juego-creado', handleNuevoJuego);
    window.addEventListener('juego-eliminado', fetchJuegos); // refrescar lista al eliminar

    return () => {
      window.removeEventListener('juego-creado', handleNuevoJuego);
      window.removeEventListener('juego-actualizado', handleJuegoActualizado);
      window.removeEventListener('juego-eliminado', fetchJuegos);
    };
  }, [nombre]);

  if (cargando) {
    return <div>Cargando juegos...</div>;
  }

  if (error) {
    return <div>Error al cargar los juegos: {error}</div>;
  }
    
  if (juegos.length === 0) {
    return null;
}

  return (
    <div className="categoria">
      <h2>{nombre}</h2>
      <div className="lista-juegos">
        {juegos.map((juego) => (
          <TarjetaDeJuego key={juego._id} data={juego} />
        ))}
      </div>
    </div>
  )
}