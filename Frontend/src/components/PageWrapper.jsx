import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const PageWrapper = ({ children }) => {
  const wrapperRef = useRef(null);

  useEffect(() => {
    // Initial page load animation
    gsap.from(wrapperRef.current, {
      duration: 1,
      opacity: 0,
      y: 30,
      ease: "power3.out"
    });

    // Animate child elements
    gsap.from(wrapperRef.current.children, {
      duration: 0.8,
      opacity: 0,
      y: 20,
      stagger: 0.2,
      ease: "power3.out",
      delay: 0.3
    });
  }, []);

  return (
    <div 
      ref={wrapperRef}
      className="min-h-screen"
      style={{ 
        background: `linear-gradient(135deg, ${COLORS.background} 0%, ${COLORS.secondary} 100%)`,
      }}
    >
      {children}
    </div>
  );
};

export default PageWrapper;