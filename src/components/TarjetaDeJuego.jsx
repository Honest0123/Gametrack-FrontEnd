import { Icon } from "@iconify/react";

export default function TarjetaDeJuego({ titulo, descripcion, calificacion, imagen }) {

  const estrellas = Array.from({ length: 5 }, (_, i) => (
    <Icon key={i} icon={i < calificacion ? "icon-park-solid:star" : "icon-park-outline:star"} />
  ));

  return (
    <div className="tarjeta-juego">
        <img src="public/vite.svg" alt={"imagen de " + titulo} style={{ width: '100px', height: '100px' }}/>
        <h3>{titulo}</h3>
        <p>{descripcion}</p>
        <div className="calificacion">{estrellas}</div>
    </div>
  )
}