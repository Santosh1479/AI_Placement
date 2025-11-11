
// 🎨 Professional, distinct themes with light + dark variants

export const THEMES = {
// 🌙 Base structure reference palette (your provided professional set)
  default:{
     background: "#312C51",   // Deep navy-purple background
  primary: "#48426D",      // Card / container background
  accent: "#F0C38E",       // Warm highlight (used for buttons, emphasis)
  highlight: "#F1AA9B",    // Soft peach-pink for highlights
  text: "#FFFFFF",         // Main white text
  textLight: "#E6E6E6",    // Slightly muted white
  card: "#3A345C",         // Inner card background (a bit lighter than background)
  border: "#5A5480",       // Subtle border
  success: "#A4D96C",      // Calm green for success states
  expense: "#F87171",      // Soft red for warnings
  shadow: "rgba(0, 0, 0, 0.3)", // Consistent shadow for depth

  },
  // 🌙 1. Midnight Plum – Elegant dark professional base
  dark: {
    background: "#2B244D",  // Deep plum-indigo
    primary: "#3A345C",     // Main container / card
    accent: "#F0C38E",      // Warm highlight (buttons, links)
    highlight: "#F1AA9B",   // Accent hover / secondary
    text: "#FFFFFF",        // White text
    textLight: "#E0E0E0",   // Muted white
    card: "#433A69",        // Slightly lighter inner background
    border: "#5B5583",      // Soft contrast border
    success: "#A4D96C",     // Subtle green
    expense: "#F87171",     // Soft red
    shadow: "rgba(0, 0, 0, 0.3)",
  },

  // 🌞 2. Ivory Dawn – Light modern professional mode
  light: {
    background: "#F9FAFB",  // Clean soft white
    primary: "#FFFFFF",     // Card / container
    accent: "#F0C38E",      // Warm button highlight
    highlight: "#EFB085",   // Peachy accent
    text: "#1E1E2F",        // Deep neutral text
    textLight: "#5A5A70",   // Secondary text
    card: "#FFFFFF",        // Same as primary for seamless UI
    border: "#E0E0E5",      // Light subtle border
    success: "#7DBE56",     // Muted green
    expense: "#E35757",     // Gentle red
    shadow: "rgba(0, 0, 0, 0.08)",
  },

  // 🌊 3. Deep Ocean – Trustworthy blue corporate tone
  ocean: {
    background: "#0F1B2D",
    primary: "#1A2942",
    accent: "#4CC9F0",
    highlight: "#A8DADC",
    text: "#FFFFFF",
    textLight: "#C7D3E1",
    card: "#213652",
    border: "#3D5674",
    success: "#A8E6CF",
    expense: "#FF6B6B",
    shadow: "rgba(0, 0, 0, 0.35)",
  },

  // 🌿 4. Forest Sage – Calm, balanced, organic
  forest: {
    background: "#1E2E25",
    primary: "#304338",
    accent: "#C3E88D",
    highlight: "#E4EFCB",
    text: "#F5F5F5",
    textLight: "#DCE2DD",
    card: "#3B5142",
    border: "#58705E",
    success: "#A4D96C",
    expense: "#E57373",
    shadow: "rgba(0, 0, 0, 0.25)",
  },

  // ☀️ 5. Amber Clay – Warm, energetic but sophisticated
  amber: {
    background: "#3A2A20",
    primary: "#54372A",
    accent: "#F0C38E",
    highlight: "#F6A56F",
    text: "#FFFFFF",
    textLight: "#E6E6E6",
    card: "#614235",
    border: "#7B5A4A",
    success: "#C0E68B",
    expense: "#F87171",
    shadow: "rgba(0, 0, 0, 0.3)",
  },

  // 🟣 6. Royal Violet – Luxurious, creative UI tone
  violet: {
    background: "#231942",
    primary: "#372554",
    accent: "#D8B4E2",
    highlight: "#F1AA9B",
    text: "#FFFFFF",
    textLight: "#E4DDF2",
    card: "#413164",
    border: "#5A498A",
    success: "#B8E986",
    expense: "#F87171",
    shadow: "rgba(0, 0, 0, 0.35)",
  },

  // 🔵 7. Slate Blue – Modern and minimal for dashboards
  slate: {
    background: "#1C2230",
    primary: "#2C3244",
    accent: "#9BB1FF",
    highlight: "#F0C38E",
    text: "#FFFFFF",
    textLight: "#D1D6E0",
    card: "#343C52",
    border: "#4C5570",
    success: "#A4D96C",
    expense: "#F87171",
    shadow: "rgba(0, 0, 0, 0.3)",
  },

  autumn: {
  background: "#2B1C10",    // Deep warm brown base
  primary: "#3E2615",       // Slightly lighter container
  accent: "#E99331",        // Vibrant orange accent
  highlight: "#F5B25E",     // Lighter highlight tone
  text: "#FFFFFF",          // Main white text
  textLight: "#E6D6C8",     // Muted warm white
  card: "#4B2F1B",          // Card tone slightly lifted
  border: "#5C3A25",        // Subtle brown border
  success: "#A4D96C",       // Balanced green
  expense: "#F87171",       // Soft red for alerts
  shadow: "rgba(0, 0, 0, 0.35)", // Deep warm shadow
},
royalrose: {
  background: "#2A102D",    // Deep maroon-purple backdrop
  primary: "#3A1840",       // Main container tone
  accent: "#FFC03D",        // Warm golden-orange accent
  highlight: "#FF6B6B",     // Bright red highlight
  text: "#E7EEFB",          // Very light text
  textLight: "#C8C0D8",     // Muted lavender-gray
  card: "#432344",          // Card slightly lifted from background
  border: "#5B3A5E",        // Purple-gray border
  success: "#B0E7A1",       // Gentle green
  expense: "#FF2525",       // Red warning color
  shadow: "rgba(0, 0, 0, 0.4)", // Deep purple-toned shadow
},

};


export const COLORS = THEMES.default;
