/**
 * BoardManager.js - Manages the hexagon board and its interactions
 */
class BoardManager {
    constructor() {
        this.board = document.getElementById('hexagonBoard');
        this.hexagonNumbers = new Map(); // Store number for each hexagon
        this.clickHandler = null;
    }
    
    setHexagonClickHandler(handler) {
        this.clickHandler = handler;
    }
    
    createBoard() {
        // Create 19 hexagons
        for (let i = 0; i < CONFIG.TOTAL_HEXAGONS; i++) {            
            const hexagon = document.createElement('div');
            hexagon.className = 'hexagon';
            hexagon.id = `hex-${CONFIG.POSITION_LETTERS[i]}`; // Add ID using the letter
            
            // Assign random number between 1 and 5
            const number = Math.floor(Math.random() * CONFIG.MAX_NUMBER) + 1;
            const span = document.createElement('span');
            span.textContent = number;
            span.style.visibility = 'hidden'; // Hide numbers initially
            
            this.hexagonNumbers.set(hexagon, number); // Store the number for later reference

            // Store the position letter as a data attribute
            hexagon.dataset.letter = CONFIG.POSITION_LETTERS[i];

            hexagon.appendChild(span);
            
            // Add click event
            hexagon.addEventListener('click', () => {
                if (this.clickHandler) {
                    this.clickHandler(hexagon, this.hexagonNumbers.get(hexagon));
                }
            });

            this.board.appendChild(hexagon);
        }
    }
    
    resetBoard() {
        this.board.innerHTML = '';
        this.hexagonNumbers.clear();
    }
    
    showAllNumbers() {
        document.querySelectorAll('.hexagon span').forEach(span => {
            span.style.visibility = 'visible';
        });
    }
    
    showLetters() {
        document.querySelectorAll('.hexagon').forEach((hexagon, index) => {
            const span = hexagon.querySelector('span');
            span.textContent = CONFIG.POSITION_LETTERS[index];
        });
    }
    
    revealLetter(hexagon) {
        const span = hexagon.querySelector('span');
        if (!isNaN(span.textContent)) {
            span.textContent = hexagon.dataset.letter;
            hexagon.style.backgroundColor = CONFIG.COLORS.CORRECT;
        }
    }
}
