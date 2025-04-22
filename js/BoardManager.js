/**
 * BoardManager.js - Manages the hexagon board and its interactions
 */
class BoardManager {
    constructor() {
        this.board = document.getElementById('hexagonBoard');
        this.hexagonNumbers = new Map(); // Store number for each hexagon
        this.clickHandler = null;
        this.isHardMode = false;
        this.hexagonPositions = new Map(); // Store position for connectivity check
    }
    
    setHexagonClickHandler(handler) {
        this.clickHandler = handler;
    }
    
    setHardMode(isHard) {
        this.isHardMode = isHard;
    }
    
    createBoard() {
        // Create 19 hexagons
        const numbers = this.generateNumbers();
        
        for (let i = 0; i < CONFIG.TOTAL_HEXAGONS; i++) {            
            const hexagon = document.createElement('div');
            hexagon.className = 'hexagon';
            hexagon.id = `hex-${CONFIG.POSITION_LETTERS[i]}`; // Add ID using the letter
            
            // Assign number from our generated set
            const number = numbers[i];
            const span = document.createElement('span');
            span.textContent = number;
            span.style.visibility = 'hidden'; // Hide numbers initially
            
            this.hexagonNumbers.set(hexagon, number); // Store the number for later reference
            this.hexagonPositions.set(hexagon.id, i); // Store position for connectivity check

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
      generateNumbers() {
        let numbers = [];
        
        if (this.isHardMode) {
            // Hard mode: limit each number to appear at most 4 times
            const maxOccurrences = CONFIG.HARD_MODE.MAX_OCCURRENCES;
            const occurrenceRecord = Array(CONFIG.MAX_NUMBER).fill(0);

            // check if  maxOccurrences * CONFIG.MAX_NUMBER is more then CONFIG.TOTAL_HEXAGONS 
            // or it will be impossible to generate the numbers
            if (maxOccurrences * CONFIG.MAX_NUMBER < CONFIG.TOTAL_HEXAGONS) {
                console.error("Impossible to generate numbers with the current configuration.");
                return numbers;
            }

            for (let i = 0; i < CONFIG.TOTAL_HEXAGONS; i++) {
                let number;
                do {
                    number = Math.floor(Math.random() * CONFIG.MAX_NUMBER) + 1;
                } while (occurrenceRecord[number - 1] >= maxOccurrences);
                
                numbers.push(number);
                occurrenceRecord[number - 1]++;
            }

        } else {
            // Normal mode: completely random
            for (let i = 0; i < CONFIG.TOTAL_HEXAGONS; i++) {
                const number = Math.floor(Math.random() * CONFIG.MAX_NUMBER) + 1;
                numbers.push(number);
            }
        }
        
        return numbers;
    }
    
    resetBoard() {
        this.board.innerHTML = '';
        this.hexagonNumbers.clear();
        this.hexagonPositions.clear();
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
    
    // Check if three hexagons are connected in a straight line
    checkConnectivity(hexagons) {
        if (!this.isHardMode || !CONFIG.HARD_MODE.ENABLE_CONNECTION_CHECK) {
            return true; // Skip check if not in hard mode
        }
        
        if (hexagons.length !== 3) {
            return false;
        }
        
        // Get positions (indices) of hexagons
        const positions = hexagons.map(hex => this.hexagonPositions.get(hex.id));
        
        // Get hexagon coordinates based on their IDs
        const coordinates = hexagons.map(hex => {
            const letter = hex.id.split('-')[1];
            return this.getHexagonCoordinates(letter);
        });
        
        // Check if they form a straight line
        return this.pointsInLine(coordinates[0], coordinates[1], coordinates[2]);
    }
    
    // Get virtual coordinates for a hexagon based on its letter
    getHexagonCoordinates(letter) {
        // This mapping is based on the hexagonal grid structure
        const coordinateMap = {
            'A': {x: 1, y: 0},
            'B': {x: 2, y: 0},
            'C': {x: 3, y: 0},
            'D': {x: 0, y: 1},
            'E': {x: 1, y: 1},
            'F': {x: 2, y: 1},
            'G': {x: 3, y: 1},
            'H': {x: 0, y: 2},
            'I': {x: 1, y: 2},
            'J': {x: 2, y: 2},
            'K': {x: 3, y: 2},
            'L': {x: 4, y: 2},
            'M': {x: 1, y: 3},
            'N': {x: 2, y: 3},
            'O': {x: 3, y: 3},
            'P': {x: 4, y: 3},
            'Q': {x: 2, y: 4},
            'R': {x: 3, y: 4},
            'S': {x: 4, y: 4}
        };
        
        return coordinateMap[letter] || {x: 0, y: 0};
    }
      // Check if three points form a straight line
    pointsInLine(p1, p2, p3) {
        // Use the cross-product method to determine collinearity
        // For three points to be collinear, the area of the triangle formed by them should be 0
        // Area = 0.5 * |x1(y2 - y3) + x2(y3 - y1) + x3(y1 - y2)|
        // If area = 0, points are collinear
        
        // Handle vertical lines (same x-coordinate)
        if (p1.x === p2.x && p2.x === p3.x) {
            return true;
        }
        
        // Handle horizontal lines (same y-coordinate)  
        if (p1.y === p2.y && p2.y === p3.y) {
            return true;
        }
        
        // For any other case including diagonal lines, use the cross-product method
        // which avoids division by zero issues
        
        // Calculate the determinant which gives us 2 times the area of the triangle
        const area = Math.abs(
            (p1.x * (p2.y - p3.y)) + 
            (p2.x * (p3.y - p1.y)) + 
            (p3.x * (p1.y - p2.y))
        );
        
        // If area is very close to 0, points are collinear
        // Using a small epsilon for floating point comparison
        return area < 0.0001;
    }
}
