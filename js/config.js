/**
 * config.js - Game configuration constants
 */
const CONFIG = {
    // Game settings
    INITIAL_TIME: 10,
    TOTAL_HEXAGONS: 19,
    MAX_NUMBER: 5,
    SELECTION_RESET_DELAY: 1250,
    
    // Hard mode settings
    HARD_MODE: {
        MAX_OCCURRENCES: 4,
        ENABLE_CONNECTION_CHECK: true
    },
    
    // Colors
    COLORS: {
        DEFAULT: '#007bff',
        SELECTED: '#ffc107',
        CORRECT: '#28a745',
        INCORRECT: '#dc3545'
    },
    
    // Fixed letters A through S ordered from top to bottom, left to right
    POSITION_LETTERS: [
        'A',                     // Top row
        'B', 'C', 'D',          // Second row
        'E', 'F', 'G', 'H',     // Third row
        'I', 'J', 'K', 'L', 'M',// Fourth row
        'N', 'O', 'P', 'Q',     // Fifth row
        'R', 'S'                // Bottom row
    ]
};
