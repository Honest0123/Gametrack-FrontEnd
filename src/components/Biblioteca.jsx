import '../styles/Biblioteca.css'
import CrearJuego from './CrearJuego.jsx'
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
        <Categoria nombre="Supervivencia" />
        <Categoria nombre="Plataformas" />
        <Categoria nombre="Deportes y Carreras" />
        <Categoria nombre="Shooter" />
        <Categoria nombre="Mundo Abierto" />
        <Categoria nombre="Battle Royal" />
        <Categoria nombre="Multijugador" />
        <Categoria nombre="Simulación" />
        <Categoria nombre="Otros" />
      </section>

    </main>
  )
}