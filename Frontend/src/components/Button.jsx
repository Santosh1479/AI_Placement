import React from 'react';
import { COLORS } from '../constants/colors';

const Button = ({ children, onClick, variant = 'primary' }) => {
  const getStyles = () => {
    switch(variant) {
      case 'primary':
        return {
          backgroundColor: COLORS.highlight,
          color: 'white',
          hoverBg: COLORS.primary
        };
      case 'secondary':
        return {
          backgroundColor: COLORS.secondary,
          color: COLORS.text,
          hoverBg: COLORS.primary
        };
      default:
        return {
          backgroundColor: COLORS.primary,
          color: COLORS.text,
          hoverBg: COLORS.secondary
        };
    }
  };

  const styles = getStyles();

  return (
    <button
      onClick={onClick}
      className="px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
      style={{
        backgroundColor: styles.backgroundColor,
        color: styles.color,
      }}
    >
      {children}
    </button>
  );
};

export default Button;