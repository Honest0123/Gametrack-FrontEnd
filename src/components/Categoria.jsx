import TarjetaDeJuego from "./TarjetaDeJuego.jsx";
import { useEffect, useState } from "react";

export default function Categoria({ nombre }) {
  const [juegos, setJuegos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJuegos = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/Games/Juegos`)

        if (!res.ok) {
          throw new Error(`Error Http ${res.status}`);
        }

        const data = await res.json();
        setJuegos(data);
      } catch (error) {
        console.error('Error al obtener los juegos:', error);
        setError(error.message);
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

    window.addEventListener('juego-creado', handleNuevoJuego);

    return () => {
      window.removeEventListener('juego-creado', handleNuevoJuego);
    };
  }, [nombre]);

  if (cargando) {
    return <div>Cargando juegos...</div>;
  }

  if (error) {
    return <div>Error al cargar los juegos: {error}</div>;
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