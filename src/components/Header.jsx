import '../styles/Header.css'
import gamepadLogo from '../assets/gamepad.png'

export default function Header({ onAdd = () => {} }) {
  return (
    <header>
      <nav>
        <div className="navlogo"><img src={gamepadLogo} id="imgLogo"></img>track</div>
        <button className='navButton'>Biblioteca</button>
        <button className='navButton'>Favoritos</button>
        <button className='navButton' onClick={onAdd}>Añadir</button>
      </nav>    
    </header>
  )
}