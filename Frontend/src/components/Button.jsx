import React from 'react';
import { COLORS } from '../constants/colors';

const Button = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  type = 'button',
}) => {
  const getStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          bg: COLORS.highlight,
          text: COLORS.card,
          hover: COLORS.accent,
          shadow: COLORS.shadow,
        };
      case 'secondary':
        return {
          bg: COLORS.secondary,
          text: COLORS.text,
          hover: COLORS.primary,
          shadow: COLORS.shadow,
        };
      case 'success':
        return {
          bg: COLORS.success,
          text: COLORS.card,
          hover: COLORS.income,
          shadow: COLORS.shadow,
        };
      case 'warning':
        return {
          bg: COLORS.warning,
          text: COLORS.text,
          hover: COLORS.expense,
          shadow: COLORS.shadow,
        };
      default:
        return {
          bg: COLORS.primary,
          text: COLORS.card,
          hover: COLORS.secondary,
          shadow: COLORS.shadow,
        };
    }
  };

  const { bg, text, hover, shadow } = getStyles();

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform 
        hover:scale-105 focus:outline-none 
        ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-lg'}`}
      style={{
        backgroundColor: bg,
        color: text,
        boxShadow: `0 2px 4px ${shadow}`,
        transition: 'all 0.25s ease-in-out',
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.backgroundColor = hover;
      }}
      onMouseLeave={(e) => {
        if (!disabled) e.currentTarget.style.backgroundColor = bg;
      }}
    >
      {children}
    </button>
  );
};

export default Button;
