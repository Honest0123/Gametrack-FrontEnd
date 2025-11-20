import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Importa la default, luego la sobreescribimos
import "../styles/CustomCalendario.css"; // Tu CSS neon

export default function FuturisticDatePicker({ value, onChange }) {
  return (
    <div className="neon-date-wrapper">
      <DatePicker
        selected={value}
        onChange={onChange}
        placeholderText="Selecciona una fecha"
        dateFormat="yyyy-MM-dd"
        className="neon-input"
        calendarClassName="neon-calendar"    //  clase personalizada del popup
        popperClassName="neon-popper"        //  estilos avanzados del popper
        maxDate={new Date()}
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
      />
    </div>
  );
}
