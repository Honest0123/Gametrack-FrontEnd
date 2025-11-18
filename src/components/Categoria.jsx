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