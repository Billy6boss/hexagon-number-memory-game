/**
 * HexagonGame.js - Main game controller
 */
class HexagonGame {
    constructor() {
        // DOM Elements
        this.timerDisplay = document.getElementById('timer');
        this.startBtn = document.getElementById('startBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.hardModeBtn = document.getElementById('hardModeBtn');
        this.targetNumberDisplay = document.getElementById('targetNumber');
        
        // Game state
        this.timeLeft = CONFIG.INITIAL_TIME;
        this.timer = null;
        this.gameStarted = false;
        this.targetNumber = 0;
        this.selectedNumbers = [];
        this.usedCombinations = new Set();
        this.hardModeEnabled = false;
        
        // Managers
        this.boardManager = new BoardManager();
        this.soundManager = new SoundManager();
        
        // Event listeners
        this.startBtn.addEventListener('click', () => this.startGame());
        this.resetBtn.addEventListener('click', () => this.resetGame());
        this.hardModeBtn.addEventListener('click', () => this.toggleHardMode());
        
        // Initialize game
        this.initializeGame();
    }
    
    initializeGame() {
        this.boardManager.createBoard();
        this.boardManager.setHexagonClickHandler((hexagon, number) => this.handleHexagonClick(hexagon, number));
    }
    
    toggleHardMode() {
        this.hardModeEnabled = !this.hardModeEnabled;
        this.hardModeBtn.textContent = this.hardModeEnabled ? 'Hard Mode: ON' : 'Hard Mode: OFF';
        
        // Toggle the active class for styling
        this.hardModeBtn.classList.toggle('active', this.hardModeEnabled);
        
        // Toggle dark theme on body
        document.body.classList.toggle('dark-mode', this.hardModeEnabled);
        
        // Update the board manager
        this.boardManager.setHardMode(this.hardModeEnabled);
        
        // Reset the game to apply hard mode settings
        if (this.gameStarted) {
            this.resetGame();
        }
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
        // Generate random target number from 6 to 12
        this.targetNumber = Math.floor(Math.random() * 7) + 6; // Random number between 6 and 12
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
        // log the selected numbers for debugging
        console.log('Selected Numbers:', this.selectedNumbers.map(item => item.number).sort().join(','));

        const selectedIds = this.selectedNumbers.map(item => item.hexagon.id).sort().join(',');
        const sum = this.selectedNumbers.reduce((acc, curr) => acc + curr.number, 0);
        
        // Get just the hexagon elements for connectivity check
        const selectedHexagons = this.selectedNumbers.map(item => item.hexagon);
        
        // Check if selected hexagons form a straight line in hard mode
        const isConnected = this.boardManager.checkConnectivity(selectedHexagons);
        
        if (sum === this.targetNumber && !this.usedCombinations.has(selectedIds) && 
            (!this.hardModeEnabled || isConnected)) {
            // Correct selection
            this.selectedNumbers.forEach(item => {
                item.hexagon.style.backgroundColor = CONFIG.COLORS.CORRECT; // Green for correct
                
                // Add connected path highlight in hard mode
                if (this.hardModeEnabled) {
                    item.hexagon.classList.add('connected-path');
                }
            });
            this.timerDisplay.textContent = 'Correct!';
            this.soundManager.playCorrectSound();
            this.usedCombinations.add(selectedIds); // Add the combination to used set
        } else {
            // Incorrect selection
            this.selectedNumbers.forEach(item => {
                item.hexagon.style.backgroundColor = CONFIG.COLORS.INCORRECT; // Red for incorrect
            });
            
            let message = '';
            if (this.usedCombinations.has(selectedIds)) {
                message = 'Combination already used!';
            } else if (this.hardModeEnabled && !isConnected && sum === this.targetNumber) {
                message = 'Hexagons must form a line!';
            } else {
                message = `Wrong! Sum = ${sum}`;
            }
            
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
            item.hexagon.classList.remove('connected-path');
            // Use the appropriate color based on the current mode
            item.hexagon.style.backgroundColor = this.hardModeEnabled ? 
                '#455a64' : // Dark theme hexagon color for hard mode
                CONFIG.COLORS.DEFAULT; // Default color for normal mode
        });
        this.selectedNumbers = [];
    }
}
