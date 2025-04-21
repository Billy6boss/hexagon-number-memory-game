document.addEventListener('DOMContentLoaded', function () {
    const board = document.getElementById('hexagonBoard');
    const timerDisplay = document.getElementById('timer');
    const startBtn = document.getElementById('startBtn');
    const resetBtn = document.getElementById('resetBtn');
    const correctSound = document.getElementById('correct-sound-affect'); // Correct sound
    const wrongSound = document.getElementById('wrong-sound-affect'); // Wrong sound
    let timeLeft = 10;
    let timer = null;
    let gameStarted = false;
    let targetNumber = 0;
    let selectedNumbers = [];
    let hexagonNumbers = new Map(); // Store number for each hexagon
    // Fixed letters A through S ordered from top to bottom, left to right
    const positionLetters = [
        'A',                     // Top row
        'B', 'C', 'D',          // Second row
        'E', 'F', 'G', 'H',     // Third row
        'I', 'J', 'K', 'L', 'M',// Fourth row
        'N', 'O', 'P', 'Q',     // Fifth row
        'R', 'S'                // Bottom row
    ];
    function startTimer() {
        if (!gameStarted) {
            gameStarted = true;
            startBtn.disabled = true;

            // Clear board and create new hexagons with random numbers
            board.innerHTML = '';
            createHexagons();

            // Show all numbers when game starts
            document.querySelectorAll('.hexagon span').forEach(span => {
                span.style.visibility = 'visible';
            });

            timer = setInterval(() => {
                timeLeft--;
                timerDisplay.textContent = timeLeft; 
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    targetNumber = Math.floor(Math.random() * 8) + 5; // Random number between 5 and 12
                    timerDisplay.textContent = `Target Sum: ${targetNumber}`;
                    selectedNumbers = [];

                    // Show letters when timer ends
                    document.querySelectorAll('.hexagon').forEach((hexagon, index) => {
                        const span = hexagon.querySelector('span');
                        span.textContent = positionLetters[index];
                    });
                }
            }, 1000);
        }
    }

    function resetGame() {
        // Clear timer
        if (timer) {
            clearInterval(timer);
        }
        // Reset variables
        timeLeft = 10;
        gameStarted = false;
        timerDisplay.textContent = timeLeft;
        startBtn.disabled = false;

        // Clear board and recreate hexagons
        board.innerHTML = '';
        createHexagons();
    }

    startBtn.addEventListener('click', startTimer);
    resetBtn.addEventListener('click', resetGame);
    function revealAllHexagons() {
        document.querySelectorAll('.hexagon').forEach((hexagon, index) => {
            const span = hexagon.querySelector('span');
            span.textContent = positionLetters[index];
            hexagon.style.backgroundColor = '#28a745';
        });
    }

    function createHexagons() {
        // Create 19 hexagons
        for (let i = 0; i < 19; i++) {            
            const hexagon = document.createElement('div');
            hexagon.className = 'hexagon';
            hexagon.id = `hex-${positionLetters[i]}`; // Add ID using the letter
            // Assign random number between 1 and 5
            const number = Math.floor(Math.random() * 5) + 1;
            const span = document.createElement('span');
            span.textContent = number;
            span.style.visibility = 'hidden'; // Hide numbers initially
            hexagonNumbers.set(hexagon, number); // Store the number for later reference

            // Store the position letter as a data attribute
            hexagon.dataset.letter = positionLetters[i];

            hexagon.appendChild(span);
            // Add click event
            hexagon.addEventListener('click', function () {
                if (!gameStarted) return; // Prevent clicking before game starts

                const currentSpan = this.querySelector('span');
                const originalNumber = hexagonNumbers.get(this);

                // Handle clicks after timer ends
                if (timeLeft <= 0) {
                    if (selectedNumbers.length < 3 && !this.classList.contains('selected')) {
                        selectedNumbers.push({
                            hexagon: this,
                            number: originalNumber
                        });
                        this.classList.add('selected');
                        this.style.backgroundColor = '#ffc107'; // Yellow for selection

                        if (selectedNumbers.length === 3) {
                            const sum = selectedNumbers.reduce((acc, curr) => acc + curr.number, 0);
                            if (sum === targetNumber) {
                                selectedNumbers.forEach(item => {
                                    item.hexagon.style.backgroundColor = '#28a745'; // Green for correct
                                });
                                timerDisplay.textContent = 'Correct! Sum = ' + targetNumber;
                                correctSound.play(); // Play correct sound
                            } else {
                                selectedNumbers.forEach(item => {
                                    item.hexagon.style.backgroundColor = '#dc3545'; // Red for incorrect
                                });
                                timerDisplay.textContent = `Wrong! Sum = ${sum}, Target = ${targetNumber}`;
                                wrongSound.play(); // Play wrong sound
                            }
                            // Reset selections after 2 seconds
                            setTimeout(() => {
                                selectedNumbers.forEach(item => {
                                    item.hexagon.classList.remove('selected');
                                    item.hexagon.style.backgroundColor = '#007bff';
                                });
                                selectedNumbers = [];
                            }, 2000);
                        }
                    }
                } else if (!isNaN(currentSpan.textContent)) {
                    // Normal gameplay before timer ends
                    currentSpan.textContent = this.dataset.letter;
                    this.style.backgroundColor = '#28a745';
                }
            });

            board.appendChild(hexagon);
        }
    }

    // Initial game setup
    createHexagons();
});
