import { Icon } from '@iconify/react';
import React from 'react';
import './menu-item.component.css';

interface MenuItemProps {
  label?: string;
  icon?: string;
  danger?: boolean;
  onClick?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ label = '', icon, danger = false, onClick }) => {
  return (
    <button className={`menu-item${danger ? ' danger' : ''}`} type="button" onClick={onClick}>
      {icon && <Icon icon={icon} className="menu-item-icon" />}
      <span>{label}</span>
    </button>
  );
};

export default MenuItem;
