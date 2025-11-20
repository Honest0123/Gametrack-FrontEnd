import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import gamepadLogo from '../assets/gamepad.png'

export default function TarjetaDeJuego({ data }) {
  const [preview, setPreview] = useState(false);
  const [calificacion, setCalificacion] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try { // calcular calificacion en base a las reviews del juego si es que existen
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/Games/reviews?juegoId=${data._id}`);

        if (!res.ok) {
          throw new Error(`Error Http ${res.status}`);
        }
        
        const reviews = await res.json();
        if (reviews.length > 0) {
          const sumaCalificaciones = reviews.reduce((suma, review) => suma + review.puntuacion, 0);
          const calificacionPromedio = sumaCalificaciones / reviews.length;
          setCalificacion(Math.round(calificacionPromedio));
        } else {
          setCalificacion(0);
        }

      } catch (error) {
        console.error('Error al obtener las reviews del juego:', error);
      }
    };

    fetchReviews();
  }, [data._id]);

  const estrellas = Array.from({ length: 5 }, (_, i) => (
    <Icon key={i} icon={i < calificacion ? "icon-park-solid:star" : "icon-park-outline:star"} />
  ));

  const HandleGameClicked = () => {
    // Abrir modal de JuegoCompleto
    window.dispatchEvent(new CustomEvent('abrir-juego-completo', { detail: { data, calificacion } }));
  }

  /* Inicializacion de datos. Reemplazados por los que vengan de data, sino dummy*/
  const titulo = data.titulo || "Título del Juego";
  const descripcion = data.descripcion || "Descripción del juego que da una idea general sobre su contenido y características.";
  const imagenPortada = data.imagenPortada || "/vite.svg";
  const imagen2 = data.imagen2 || "/vite.svg";
  const imagen3 = data.imagen3 || "/vite.svg";
  const fechaLanzamiento = data.añoLanzamiento || "2023-01-01";
  const genero = data.genero || "Acción";
  const plataformas = data.plataforma || ["PC", "PS5", "Xbox"];

  return (
    <div onClick={HandleGameClicked}
      className={`tarjeta-juego ${preview ? "preview" : ""}`}
      onMouseEnter={() => setPreview(true)}
      onMouseLeave={() => setPreview(false)}
      >

      {!preview ? (
        <>
          <img src={imagenPortada} alt={"imagen de " + titulo} className="imagen-juego"/>
          <h3 className="titulo-juego">{titulo}</h3>
          <p className="descripcion-juego">{descripcion}</p>
          <div className="calificacion">{estrellas}</div>
        </>
        
      ) : (
        <>
          <div className="info-primera">
            <h3 className="titulo-juego">{titulo}</h3>
            <div className="calificacion">{estrellas}</div>
            
          </div>
          <div className="info-segunda">
            {/* <p className="fecha-lanzamiento">Lanzamiento: {fechaLanzamiento.split("T")[0]}</p> */}
            <p className="genero-juego">{genero}</p>
          </div>
          <div className="info-imagenes">
            <img src={imagenPortada} alt={"imagen de " + titulo} className="imagen-1"/>
            <img src={imagen2} alt={"imagen de " + titulo} className="imagen-2"/>
            <img src={imagen3} alt={"imagen de " + titulo} className="imagen-3"/>
          </div>
          <p className="descripcion-juego-preview">{descripcion}</p> <br/>
          <p className="plataformas-juego">{plataformas}</p>
        </>
      )} 

    </div>    

  )
}