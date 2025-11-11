import TarjetaDeJuego from "./TarjetaDeJuego"

export default function Categoria({ nombre }) {
  return (
    <div className="categoria">
      <h2>{nombre}</h2>
      <div className="lista-juegos">
        <TarjetaDeJuego titulo="Juego 1" descripcion="Descripción del juego 1" calificacion={4} imagen="../assets/gamepad.png" />
        <TarjetaDeJuego titulo="Juego 2" descripcion="Descripción del juego 2" calificacion={5} imagen="../assets/gamepad.png" />
        <TarjetaDeJuego titulo="Juego 3" descripcion="Descripción del juego 3" calificacion={3} imagen="../assets/gamepad.png" />
      </div>
    </div>
  )
}