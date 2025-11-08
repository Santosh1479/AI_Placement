// themes.js

const coffeeTheme = {
  primary: "#8B593E",
  background: "#FFF8F3",
  text: "#3B2A20", // darkened for better contrast
  border: "#E5D3B7",
  white: "#FFFFFF",
  textLight: "#7A6A60", // slightly darker for visibility
  expense: "#E74C3C",
  income: "#2ECC71",
  card: "#FFFFFF",
  shadow: "#000000",
};

const forestTheme = {
  primary: "#2E7D32",
  background: "#E8F5E9",
  text: "#1B5E20",
  border: "#C8E6C9",
  white: "#FFFFFF",
  textLight: "#4CAF50", // darker green for contrast
  expense: "#C62828",
  income: "#2E7D32",
  card: "#FFFFFF",
  shadow: "#000000",
};

const purpleTheme = {
  primary: "#6A1B9A",
  background: "#F3E5F5",
  text: "#4A148C",
  border: "#D1C4E9",
  white: "#FFFFFF",
  textLight: "#8E24AA", // slightly darker purple for readability
  expense: "#D32F2F",
  income: "#388E3C",
  card: "#FFFFFF",
  shadow: "#000000",
};

const DarkTheme = {
  primary: "#00ACC1",
  secondary: "#03DAC6",
  background: "#121212",
  surface: "#1E1E1E",
  card: "#1C1C1C",
  border: "#2C2C2C",
  text: "#FFFFFF",
  textLight: "#B3B3B3",
  textMuted: "#8C8C8C", // slightly lighter for better readability
  expense: "#CF6679",
  income: "#03DAC6",
  success: "#4CAF50",
  warning: "#FFC107",
  shadow: "rgba(0,0,0,0.8)",
  overlay: "rgba(0,0,0,0.6)",
};

const WhiteTheme = {
  primary: "#107bdf",
  secondary: "#03DAC6",
  background: "#FFFFFF",
  surface: "#F5F5F5",
  card: "#FFFFFF",
  border: "#E0E0E0",
  text: "#000000",
  textLight: "#555555", // slightly darker for contrast
  textMuted: "#777777",
  expense: "#D32F2F",
  income: "#388E3C",
  success: "#4CAF50",
  warning: "#FFC107",
  shadow: "rgba(0,0,0,0.2)",
  overlay: "rgba(255,255,255,0.6)",
};

export const THEMES = {
  coffee: coffeeTheme,
  forest: forestTheme,
  purple: purpleTheme,
  dark: DarkTheme,
  light: WhiteTheme,
};

export const COLORS = {
  primary: '#CCD5AE',    // Sage green
  secondary: '#E9EDC9',  // Light sage
  background: '#FEFAE0', // Cream
  accent: '#FAEDCD',     // Light beige
  highlight: '#D4A373',  // Warm brown
  text: '#2C3E50',       // Dark blue-grey for text
  textLight: '#7F8C8D',  // Lighter text
};
