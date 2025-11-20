import { useState, useEffect } from 'react'
import Header from './components/Header.jsx'
import HomePage from './components/HomePage.jsx'
import Biblioteca from './components/Biblioteca.jsx'
import Footer from './components/Footer.jsx'
import CrearJuego from './components/CrearJuego.jsx'
import JuegoCompleto from './components/JuegoCompleto.jsx'

function App() {
  const [isCrearOpen, setIsCrearOpen] = useState(false);
  const [isJuegoOpen, setIsJuegoOpen] = useState(false);
  const [juegoSelected, setJuegoSelected] = useState(null);
  const [juegoCalificacion, setJuegoCalificacion] = useState(0);

  useEffect(() => {
    const handler = (e) => {
      const detalle = e?.detail;
      if (!detalle) return;
      const juego = detalle.data || detalle;
      const cal = detalle.calificacion || 0;
      setJuegoSelected(juego);
      setJuegoCalificacion(cal);
      setIsJuegoOpen(true);
    };
    window.addEventListener('abrir-juego-completo', handler);
    return () => window.removeEventListener('abrir-juego-completo', handler);
  }, []);

  return (
    <>
      <Header onAdd={() => setIsCrearOpen(true)} />

      <HomePage />
      
      <Biblioteca />

      <Footer />

      <CrearJuego isOpen={isCrearOpen} onClose={() => setIsCrearOpen(false)} />

      <JuegoCompleto data={juegoSelected} calificacion={juegoCalificacion} isOpen={isJuegoOpen} onClose={() => setIsJuegoOpen(false)} />
    </>
  )
}

export default App
