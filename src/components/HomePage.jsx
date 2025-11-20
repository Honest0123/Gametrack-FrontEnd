import '../styles/HomePage.css'
import VideoMenu from "/Menu.mp4"
import { Icon } from '@iconify/react'
import gamepadLogo from '../assets/gamepad.png'
export default function HomePage() {
  return (
    <div className ='Home'>
      <div className='Video'>
        <video autoPlay loop muted playsInline className='Backgrund'>
        <source src={VideoMenu} type="video/mp4"/>
        </video>
      </div>
      
      <div className='Logo'>
      </div>

      <div className='Title'>
        <h1>GameTrack</h1>
        <p>Welcome to the Gametrack!</p>
      </div>
      


    
    </div>

  )
}
