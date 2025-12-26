export default {
  light: {
    background: '#F2F2F7', // Soft iOS-style grey (makes white cards pop)
    card: '#FFFFFF',       // Pure white cards
    text: '#1C1C1E',       // Soft Black (easier to read)
    secondaryText: '#8E8E93', // Grey for "Rank #4" etc.
    border: '#D1D1D6',     // Subtle border
    tint: '#007AFF',       // Vivid Blue (Standard "Action" color)
    
    // Leaderboard Specifics
    gold: '#FFD700',
    silver: '#C0C0C0',
    bronze: '#CD7F32',
    success: '#34C759',    // Green
  },
  dark: {
    background: '#000000', // True Black (Saves battery on OLED)
    card: '#1C1C1E',       // Dark Grey (Distinguishes card from background)
    text: '#FFFFFF',       // White
    secondaryText: '#98989F', // Light Grey
    border: '#38383A',     // Dark border
    tint: '#0A84FF',       // Lighter Blue (Better contrast on dark)
    
    // Leaderboard Specifics
    gold: '#FFD700',
    silver: '#E0E0E0',     // Lighter silver to be visible
    bronze: '#CD7F32',
    success: '#30D158',
  },
};