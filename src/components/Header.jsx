import '../styles/Header.css'
import gamepadLogo from '../assets/gamepad.png'

export default function Header() {
  return (
    <header>
      <nav>
        <div className="navlogo"><img src={gamepadLogo} id="imgLogo"></img>track</div>
        <button className='navButton'>Biblioteca</button>
        <button className='navButton'>Juegos</button>
        <button className='navButton'>Añadir</button>
      </nav>    
    </header>
  )
}