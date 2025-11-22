import { useState } from "react";
import '../styles/Dropdown.css'

export default function Dropdown({ options, selected, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  // Support both multi-select (selected is array) and single-select (selected is scalar)
  const isArraySelected = Array.isArray(selected);

  const togglePlatform = (platform) => {
    if (isArraySelected) {
      if (selected.includes(platform)) {
        onChange(selected.filter((p) => p !== platform));
      } else {
        onChange([...selected, platform]);
      }
    } else {
      // single-select: set value or clear if same
      const same = String(selected) === String(platform);
      onChange(same ? '' : platform);
    }
  };

  const displayValue = () => {
    if (isArraySelected) return (selected && selected.length) ? selected.join(', ') : 'Selecciona una opcion';
    return selected ? String(selected) : 'Selecciona una opcion';
  };

  return (
    <div className="dropdown-container" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      
      {/* Button / Selector */}
      <div className="dropdown-select">
        {displayValue()}</div>

      {/* Dropdown options */}
      {isOpen && (
        <div className="dropdown-menu">
          {options.map((option) => (
            <label key={option} className="dropdown-option">
              <input
                type={isArraySelected ? 'checkbox' : 'radio'}
                name={isArraySelected ? undefined : 'dropdown-single'}
                checked={isArraySelected ? (selected.includes(option)) : (String(selected) === String(option))}
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