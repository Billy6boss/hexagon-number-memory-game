/**
 * SoundManager.js - Manages game sound effects
 */
class SoundManager {
    constructor() {
        this.correctSound = document.getElementById('correct-sound-affect');
        this.wrongSound = document.getElementById('wrong-sound-affect');
    }
    
    playCorrectSound() {
        this.correctSound.play();
    }
    
    playWrongSound() {
        this.wrongSound.play();
    }
}
