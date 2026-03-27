import React, { useId } from 'react';
import './textfield.component.css';

interface TextfieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'password';
  placeholder?: string;
}

const Textfield: React.FC<TextfieldProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder = 'Type here...',
}) => {
  const inputId = useId();

  return (
    <div className="textfield">
      <label className="label" htmlFor={inputId}>
        {label}
      </label>
      <input
        className="input"
        id={inputId}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
};

export default Textfield;
