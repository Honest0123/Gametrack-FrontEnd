import { useState } from "react";
import { Icon } from "@iconify/react";

export default function TarjetaDeJuego({ data }) {
  const [preview, setPreview] = useState(false);

  const calificacion = data.calificacion || 0;
  const estrellas = Array.from({ length: 5 }, (_, i) => (
    <Icon key={i} icon={i < calificacion ? "icon-park-solid:star" : "icon-park-outline:star"} />
  ));

  /* Inicializacion de datos. Reemplazados por los que vengan de data, sino dummy*/
  const titulo = data.titulo || "Título del Juego";
  const descripcion = data.descripcion || "Descripción del juego que da una idea general sobre su contenido y características.";
  const imagenPortada = data.imagenPortada || "/vite.svg";
  const imagen2 = data.imagen || "/vite.svg";
  const imagen3 = data.imagen || "/vite.svg";

  return (
    <div
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
            <p className="fecha-lanzamiento">Lanzamiento: 2023</p>
            <p className="genero-juego">Género: Acción</p>
          </div>
          <div className="info-imagenes">
            <img src={imagenPortada} alt={"imagen de " + titulo} className="imagen-1"/>
            <img src={imagen2} alt={"imagen de " + titulo} className="imagen-2"/>
            <img src={imagen3} alt={"imagen de " + titulo} className="imagen-3"/>
          </div>
          <p className="descripcion-juego-preview">{descripcion}</p> <br/>
          <p className="plataformas-juego">Plataformas: PC, PS5, Xbox</p>
        </>
      )} 

    </div>    

  )
}