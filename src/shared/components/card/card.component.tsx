import React from 'react';
import './card.component.css';

interface CardProps {
  minWidth?: string;
  padding?: string;
  borderRadius?: string;
  background?: string;
  customStyle?: React.CSSProperties;
  children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  minWidth = '100%',
  padding = '36px',
  borderRadius = 'var(--border-radius)',
  background,
  customStyle = {},
  children,
}) => {
  return (
    <div className="card" style={{ minWidth, padding, borderRadius, background, ...customStyle }}>
      {children}
    </div>
  );
};

export default Card;
