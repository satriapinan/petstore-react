import { Icon } from '@iconify/react';
import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import './autocomplete.component.css';

interface AutocompleteProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
}

const Autocomplete: React.FC<AutocompleteProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = '',
}) => {
  const inputId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const filteredOptions = useMemo(
    () => options.filter((opt) => opt.toLowerCase().includes(value.toLowerCase())),
    [value, options],
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setIsOpen(true);
  };

  const selectOption = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="autocomplete">
      <label className="label" htmlFor={inputId}>
        {label}
      </label>

      <div className="input-wrapper" ref={wrapperRef}>
        <input
          className="input"
          id={inputId}
          type="text"
          value={value}
          placeholder={placeholder}
          autoComplete="off"
          onFocus={handleFocus}
          onChange={handleInput}
        />

        <span className={`chevron${isOpen ? ' open' : ''}`}>
          <Icon icon="mdi:chevron-down" width={12} height={12} />
        </span>

        {isOpen && filteredOptions.length > 0 && (
          <div className="dropdown visible">
            {filteredOptions.map((option) => (
              <button
                key={option}
                type="button"
                className="dropdown-item"
                onMouseDown={() => selectOption(option)}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Autocomplete;
