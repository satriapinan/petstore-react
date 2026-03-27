import React, { useEffect, useRef, useState } from 'react';
import './menu.component.css';

interface MenuProps {
  trigger: React.ReactNode;
  children?: React.ReactNode;
}

const Menu: React.FC<MenuProps> = ({ trigger, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const toggle = () => setIsOpen((v) => !v);

  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('click', handleDocumentClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <div className="menu-wrapper" ref={wrapperRef}>
      <button className="menu-trigger" type="button" onClick={toggle}>
        {trigger}
      </button>

      {isOpen && <div className="menu-dropdown">{children}</div>}
    </div>
  );
};

export default Menu;
