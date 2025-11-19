import { useState } from "react";
import '../styles/Dropdown.css'

export default function Dropdown({ options, selected, onChange }) {
const [isOpen, setIsOpen] = useState(false);

  const togglePlatform = (platform) => {
    if (selected.includes(platform)) {
      onChange(selected.filter((p) => p !== platform));
    } else {
      onChange([...selected, platform]);
    }
  };

  return (
    <div className="dropdown-container" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      
      {/* Button / Selector */}
      <div className="dropdown-select">
        {selected.length > 0 ? selected.join(", ") : "Selecciona una opcion"}</div>

      {/* Dropdown options */}
      {isOpen && (
        <div className="dropdown-menu">
          {options.map((option) => (
            <label key={option} className="dropdown-option">
              <input
                type="checkbox"
                checked={selected.includes(option)}
                onChange={() => togglePlatform(option)}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      )}

    </div>
  );
}