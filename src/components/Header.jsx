import '../styles/Header.css'
import gamepadLogo from '../assets/gamepad.png'

export default function Header({ onAdd = () => { } }) {
  
  const goToBiblioteca = () => {
    const biblioteca = document.getElementById("biblioteca");
    if (biblioteca) {
      biblioteca.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
};
  return (
    <header>
      <nav>
        <div className="navlogo"><img src={gamepadLogo} id="imgLogo"></img>Track</div>
        <button className='navButton' onClick={scrollToTop} >Home</button>
        <button className='navButton' onClick={goToBiblioteca} >Biblioteca</button>
        <button className='navButton' onClick={onAdd}>Añadir</button>
      </nav>
    </header>
  )
}