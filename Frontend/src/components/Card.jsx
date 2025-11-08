import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

const Card = ({ children, className = '' }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    // Hover animation setup
    const card = cardRef.current;
    
    const handleMouseMove = (e) => {
      const { left, top, width, height } = card.getBoundingClientRect();
      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;
      
      gsap.to(card, {
        duration: 0.5,
        rotateY: (x - 0.5) * 10,
        rotateX: (y - 0.5) * -10,
        ease: "power2.out",
        transformPerspective: 900
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        duration: 0.5,
        rotateY: 0,
        rotateX: 0,
        ease: "power2.out"
      });
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl ${className}`}
      style={{ 
        backgroundColor: COLORS.accent,
        border: `1px solid ${COLORS.primary}`,
      }}
    >
      {children}
    </div>
  );
};

export default Card;