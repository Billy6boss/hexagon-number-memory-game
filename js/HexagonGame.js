/**
 * HexagonGame.js - Main game controller
 */
class HexagonGame {
    constructor() {
        // DOM Elements
        this.timerDisplay = document.getElementById('timer');
        this.startBtn = document.getElementById('startBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.targetNumberDisplay = document.getElementById('targetNumber');
        
        // Game state
        this.timeLeft = CONFIG.INITIAL_TIME;
        this.timer = null;
        this.gameStarted = false;
        this.targetNumber = 0;
        this.selectedNumbers = [];
        this.usedCombinations = new Set();
        
        // Managers
        this.boardManager = new BoardManager();
        this.soundManager = new SoundManager();
        
        // Event listeners
        this.startBtn.addEventListener('click', () => this.startGame());
        this.resetBtn.addEventListener('click', () => this.resetGame());
        
        // Initialize game
        this.initializeGame();
    }
    
    initializeGame() {
        this.boardManager.createBoard();
        this.boardManager.setHexagonClickHandler((hexagon, number) => this.handleHexagonClick(hexagon, number));
    }
    
    startGame() {
        if (this.gameStarted) return;
        
        this.gameStarted = true;
        this.startBtn.disabled = true;
        
        // Clear board and create new hexagons
        this.boardManager.resetBoard();
        this.boardManager.createBoard();
        
        // Show all numbers when game starts
        this.boardManager.showAllNumbers();
        
        // Start timer
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.timerDisplay.textContent = this.timeLeft;
            
            if (this.timeLeft <= 0) {
                this.handleTimeUp();
            }
        }, 1000);
    }
    
    handleTimeUp() {
        clearInterval(this.timer);
        // Generate random target number
        this.targetNumber = Math.floor(Math.random() * 8) + 5; // Random number between 5 and 12
        this.targetNumberDisplay.textContent = this.targetNumber;
        this.timerDisplay.textContent = 'Time\'s up!';
        this.selectedNumbers = [];
        this.usedCombinations.clear(); // Clear used combinations when new target is set
        
        // Show letters when timer ends
        this.boardManager.showLetters();
    }
    
    resetGame() {
        // Clear timer
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        // Reset variables
        this.timeLeft = CONFIG.INITIAL_TIME;
        this.gameStarted = false;
        this.timerDisplay.textContent = this.timeLeft;
        this.startBtn.disabled = false;
        this.targetNumberDisplay.textContent = '-';
        this.selectedNumbers = [];
        this.usedCombinations.clear();
        
        // Reset board
        this.boardManager.resetBoard();
        this.boardManager.createBoard();
    }
    
    handleHexagonClick(hexagon, number) {
        if (!this.gameStarted) return; // Prevent clicking before game starts
        
        // Handle clicks after timer ends
        if (this.timeLeft <= 0) {
            this.handleSelectionPhaseClick(hexagon, number);
        } else {
            // Normal gameplay before timer ends - just show the letter
            this.boardManager.revealLetter(hexagon);
        }
    }
    
    handleSelectionPhaseClick(hexagon, number) {
        if (this.selectedNumbers.length < 3 && !hexagon.classList.contains('selected')) {
            // Add to selection
            this.selectedNumbers.push({
                hexagon: hexagon,
                number: number
            });
            
            hexagon.classList.add('selected');
            hexagon.style.backgroundColor = CONFIG.COLORS.SELECTED; // Yellow for selection
            
            if (this.selectedNumbers.length === 3) {
                this.checkSelection();
            }
        }
    }
    
    checkSelection() {
        const selectedIds = this.selectedNumbers.map(item => item.hexagon.id).sort().join(',');
        const sum = this.selectedNumbers.reduce((acc, curr) => acc + curr.number, 0);
        
        if (sum === this.targetNumber && !this.usedCombinations.has(selectedIds)) {
            // Correct selection
            this.selectedNumbers.forEach(item => {
                item.hexagon.style.backgroundColor = CONFIG.COLORS.CORRECT; // Green for correct
            });
            this.timerDisplay.textContent = 'Correct!';
            this.soundManager.playCorrectSound();
            this.usedCombinations.add(selectedIds); // Add the combination to used set
        } else {
            // Incorrect selection
            this.selectedNumbers.forEach(item => {
                item.hexagon.style.backgroundColor = CONFIG.COLORS.INCORRECT; // Red for incorrect
            });
            const message = this.usedCombinations.has(selectedIds) ? 
                'Combination already used!' : 
                `Wrong! Sum = ${sum}`;
            this.timerDisplay.textContent = message;
            this.soundManager.playWrongSound();
        }
        
        // Reset selections after delay
        setTimeout(() => {
            this.resetSelection();
        }, CONFIG.SELECTION_RESET_DELAY);
    }
      resetSelection() {
        this.selectedNumbers.forEach(item => {
            item.hexagon.classList.remove('selected');
            item.hexagon.style.backgroundColor = CONFIG.COLORS.DEFAULT;
        });
        this.selectedNumbers = [];
    }
}
