import { useState } from 'react'
import Header from './components/Header.jsx'
import HomePage from './components/HomePage.jsx'
import Biblioteca from './components/Biblioteca.jsx'
import Footer from './components/Footer.jsx'
import CrearJuego from './components/CrearJuego.jsx'

function App() {
  const [isCrearOpen, setIsCrearOpen] = useState(false);

  return (
    <>
      <Header onAdd={() => setIsCrearOpen(true)} />

      <HomePage />
      
      <Biblioteca />

      <Footer />

      <CrearJuego isOpen={isCrearOpen} onClose={() => setIsCrearOpen(false)} />
    </>
  )
}

export default App
