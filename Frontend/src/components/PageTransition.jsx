// src/components/PageTransition.js
import React from "react";
import { motion } from "framer-motion";

const transition = {
  duration: 0.25, // much faster
  ease: [0.4, 0, 0.2, 1], // standard material design cubic-bezier
};

const variants = {
  initial: {
    opacity: 0,
    scale: 0.98,
  },
  enter: {
    opacity: 1,
    scale: 1,
    transition,
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition,
  },
};

const PageTransition = ({ children }) => (
  <motion.div
    variants={variants}
    initial="initial"
    animate="enter"
    exit="exit"
    style={{
      width: "100%",
      height: "100%",
      position: "absolute",
      top: 0,
      left: 0,
      background: "transparent",
    }}
  >
    {children}
  </motion.div>
);

export default PageTransition;
