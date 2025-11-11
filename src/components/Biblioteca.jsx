import '../styles/Biblioteca.css'
import TarjetaDeJuego from './TarjetaDeJuego.jsx'
import Categoria from './Categoria.jsx'

export default function Biblioteca() {
  return (
    <main>
      {/* lista de juegos. dummy loop con lorem */}
      <section className="biblioteca">
        <Categoria nombre="Acción" />
        <Categoria nombre="Aventura" />
        <Categoria nombre="Estrategia" />
        <Categoria nombre="RPG" />
      </section>
    </main>
  )
}