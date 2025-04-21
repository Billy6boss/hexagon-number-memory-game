class TeamManager {
    constructor() {
        this.teams = [];
        this.teamListElement = document.getElementById('teamList');
        this.teamNameInput = document.getElementById('teamNameInput');
        this.addTeamBtn = document.getElementById('addTeamBtn');
        
        // Initialize event listeners
        this.initEventListeners();
        
        // Load any saved teams from localStorage
        this.loadTeams();
    }
      initEventListeners() {
        this.addTeamBtn.addEventListener('click', () => this.addTeam());
        this.teamNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTeam();
            }
        });
        
        // Add event listener for Reset All Scores button
        const resetAllScoresBtn = document.getElementById('resetAllScoresBtn');
        if (resetAllScoresBtn) {
            resetAllScoresBtn.addEventListener('click', () => this.resetAllScores());
        }
    }
    
    addTeam() {
        const teamName = this.teamNameInput.value.trim();
        
        if (teamName === '') {
            alert('Please enter a team name');
            return;
        }
        
        // Check for duplicate team names
        if (this.teams.some(team => team.name === teamName)) {
            alert('A team with this name already exists');
            return;
        }
        
        const newTeam = {
            id: Date.now().toString(),
            name: teamName,
            score: 0
        };
        
        this.teams.push(newTeam);
        this.renderTeam(newTeam);
        this.saveTeams();
        
        // Clear input field
        this.teamNameInput.value = '';
    }
    
    renderTeam(team) {
        const teamElement = document.createElement('div');
        teamElement.className = 'team-item';
        teamElement.dataset.teamId = team.id;
          teamElement.innerHTML = `
            <div class="team-header">
                <div class="team-name">${team.name}</div>
                <button class="btn btn-sm btn-outline-danger remove-btn">×</button>
            </div>
            <div class="team-score">${team.score}</div>
            <div class="score-controls">
                <button class="btn btn-danger btn-sm minus-btn">-</button>
                <button class="btn btn-primary btn-sm plus-btn">+</button>
            </div>
        `;
          // Add event listeners for score buttons
        const plusBtn = teamElement.querySelector('.plus-btn');
        const minusBtn = teamElement.querySelector('.minus-btn');
        const removeBtn = teamElement.querySelector('.remove-btn');
        
        plusBtn.addEventListener('click', () => this.updateScore(team.id, 1));
        minusBtn.addEventListener('click', () => this.updateScore(team.id, -1));
        removeBtn.addEventListener('click', () => this.removeTeam(team.id));
        
        this.teamListElement.appendChild(teamElement);
    }
    
    updateScore(teamId, change) {
        const teamIndex = this.teams.findIndex(team => team.id === teamId);
        
        if (teamIndex !== -1) {
            this.teams[teamIndex].score += change;
            
            // Update the displayed score
            const teamElement = this.teamListElement.querySelector(`[data-team-id="${teamId}"]`);
            if (teamElement) {
                const scoreElement = teamElement.querySelector('.team-score');
                scoreElement.textContent = this.teams[teamIndex].score;
            }
            
            this.saveTeams();
        }
    }
    
    saveTeams() {
        localStorage.setItem('hexagonGameTeams', JSON.stringify(this.teams));
    }
      loadTeams() {
        const savedTeams = localStorage.getItem('hexagonGameTeams');
        
        if (savedTeams) {
            this.teams = JSON.parse(savedTeams);
            
            // Render all loaded teams
            this.teamListElement.innerHTML = '';
            this.teams.forEach(team => this.renderTeam(team));
        }
    }
    
    removeTeam(teamId) {
        if (confirm('Are you sure you want to remove this team?')) {
            // Remove from array
            this.teams = this.teams.filter(team => team.id !== teamId);
            
            // Remove from DOM
            const teamElement = this.teamListElement.querySelector(`[data-team-id="${teamId}"]`);
            if (teamElement) {
                teamElement.remove();
            }
            
            // Update localStorage
            this.saveTeams();
        }
    }
    
    resetAllScores() {
        if (this.teams.length === 0) {
            alert('No teams to reset');
            return;
        }
        
        if (confirm('Are you sure you want to reset all team scores to 0?')) {
            // Reset scores in the array
            this.teams.forEach(team => team.score = 0);
            
            // Update displayed scores
            const scoreElements = this.teamListElement.querySelectorAll('.team-score');
            scoreElements.forEach(element => element.textContent = '0');
            
            // Update localStorage
            this.saveTeams();
        }
    }
}
