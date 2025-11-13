import { useState } from "react";
import { Icon } from "@iconify/react";

export default function TarjetaDeJuego({ titulo, descripcion, calificacion, imagen }) {
  const [preview, setPreview] = useState(false);

  const estrellas = Array.from({ length: 5 }, (_, i) => (
    <Icon key={i} icon={i < calificacion ? "icon-park-solid:star" : "icon-park-outline:star"} />
  ));

  return (
    <div
      className={`tarjeta-juego ${preview ? "preview" : ""}`}
      onMouseEnter={() => setPreview(true)}
      onMouseLeave={() => setPreview(false)}
      >

      {!preview ? (
        <>
          <img src={imagen} alt={"imagen de " + titulo} className="imagen-juego"/>
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
            <img src={imagen} alt={"imagen de " + titulo} className="imagen-1"/>
            <img src={imagen} alt={"imagen de " + titulo} className="imagen-2"/>
            <img src={imagen} alt={"imagen de " + titulo} className="imagen-3"/>
          </div>
          <p className="descripcion-juego">{descripcion}</p> <br/>
          <p className="plataformas-juego">Plataformas: PC, PS5, Xbox</p>
        </>
      )} 

    </div>    

  )
}