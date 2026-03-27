import Spinner from '@/shared/components/spinner/spinner.component';
import { Icon } from '@iconify/react';
import React from 'react';
import './button.component.css';

interface ButtonProps {
  label?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  loading?: boolean;
  variant?: 'contained' | 'outline';
  color?: 'primary' | 'danger' | 'warning' | 'success';
  icon?: string;
  fullWidth?: boolean;
  fontSize?: string;
  fontWeight?: string;
  padding?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  label = '',
  type = 'button',
  disabled = false,
  loading = false,
  variant = 'contained',
  color = 'primary',
  icon,
  fullWidth = false,
  fontSize,
  fontWeight,
  padding = '12px 16px',
  onClick,
}) => {
  const classNames = ['btn', `btn--${variant}`, `btn--color-${color}`, fullWidth ? 'btn--full' : '']
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={classNames}
      style={{ fontSize, fontWeight, padding }}
      onClick={onClick}
    >
      {loading ? (
        <Spinner size={16} color="currentColor" />
      ) : (
        <>
          {icon && <Icon icon={icon} width={18} height={18} className="btn__icon" />}
          <span>{label}</span>
        </>
      )}
    </button>
  );
};

export default Button;
