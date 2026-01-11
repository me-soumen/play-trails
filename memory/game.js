class MemoryGame {
    constructor() {
        this.grid = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.totalPairs = 0;
        this.difficulty = 'easy'; // easy: 8 pairs, medium: 15 pairs, hard: 18 pairs
        this.difficultyPairs = { easy: 8, medium: 15, hard: 18 };
        this.canFlip = true;
        this.timer = null;
        this.timeElapsed = 0;
        this.gameComplete = false;

        this.icons = ['🎮', '🎯', '🎨', '🎵', '🎪', '🎭', '🎬', '🎸', '🎺', '🎻', '🥁', '🎤', '🎧', '🎨', '🖌️', '🖍️', '🖊️', '🖋️', '📝', '📌', '📍', '📎', '📏', '📐', '✂️', '🔖', '📖', '📗', '📘', '📙'];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.newGame();
    }

    setupEventListeners() {
        document.getElementById('newGame').addEventListener('click', () => this.newGame());
        document.getElementById('difficulty').addEventListener('click', () => this.toggleDifficulty());
        document.getElementById('modalButton').addEventListener('click', () => {
            this.closeModal();
            this.newGame();
        });
    }

    toggleDifficulty() {
        const difficulties = ['easy', 'medium', 'hard'];
        const currentIndex = difficulties.indexOf(this.difficulty);
        const nextIndex = (currentIndex + 1) % difficulties.length;
        this.difficulty = difficulties[nextIndex];
        document.getElementById('difficulty').textContent = 
            this.difficulty.charAt(0).toUpperCase() + this.difficulty.slice(1);
        this.newGame();
    }

    newGame() {
        this.matchedPairs = 0;
        this.moves = 0;
        this.flippedCards = [];
        this.canFlip = true;
        this.timeElapsed = 0;
        this.gameComplete = false;
        this.totalPairs = this.difficultyPairs[this.difficulty];
        
        this.generateGrid();
        this.renderGrid();
        this.updateStats();
        this.startTimer();
        this.closeModal();
        
        const statusElement = document.getElementById('gameStatus');
        statusElement.textContent = '';
        statusElement.className = 'game-status';
    }

    generateGrid() {
        const iconsNeeded = this.totalPairs;
        const selectedIcons = this.icons.slice(0, iconsNeeded);
        const iconPairs = [...selectedIcons, ...selectedIcons];
        
        // Shuffle
        for (let i = iconPairs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [iconPairs[i], iconPairs[j]] = [iconPairs[j], iconPairs[i]];
        }
        
        this.grid = iconPairs.map((icon, index) => ({
            id: index,
            icon: icon,
            flipped: false,
            matched: false
        }));
    }

    renderGrid() {
        const gridElement = document.getElementById('memoryGrid');
        gridElement.innerHTML = '';
        gridElement.className = `memory-grid ${this.difficulty}`;
        
        this.grid.forEach((card) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'memory-card';
            if (card.flipped) cardElement.classList.add('flipped');
            if (card.matched) cardElement.classList.add('matched');
            cardElement.setAttribute('data-id', card.id);
            
            cardElement.innerHTML = `
                <div class="memory-card-front">?</div>
                <div class="memory-card-back">${card.icon}</div>
            `;
            
            cardElement.addEventListener('click', () => this.flipCard(card.id));
            
            gridElement.appendChild(cardElement);
        });
    }

    flipCard(cardId) {
        if (!this.canFlip || this.gameComplete) return;
        
        const card = this.grid.find(c => c.id === cardId);
        if (!card || card.flipped || card.matched) return;
        
        card.flipped = true;
        this.flippedCards.push(card);
        this.renderGrid();
        
        if (this.flippedCards.length === 2) {
            this.moves++;
            this.canFlip = false;
            
            setTimeout(() => {
                this.checkMatch();
            }, 1000);
        }
        
        this.updateStats();
    }

    checkMatch() {
        const [card1, card2] = this.flippedCards;
        
        if (card1.icon === card2.icon) {
            card1.matched = true;
            card2.matched = true;
            this.matchedPairs++;
            
            if (this.matchedPairs === this.totalPairs) {
                this.completeGame();
            }
        } else {
            card1.flipped = false;
            card2.flipped = false;
        }
        
        this.flippedCards = [];
        this.canFlip = true;
        this.renderGrid();
        this.updateStats();
    }

    startTimer() {
        if (this.timer) clearInterval(this.timer);
        this.timer = setInterval(() => {
            if (!this.gameComplete) {
                this.timeElapsed++;
                this.updateStats();
            }
        }, 1000);
    }

    updateStats() {
        document.getElementById('moves').textContent = this.moves;
        document.getElementById('pairs').textContent = `${this.matchedPairs} / ${this.totalPairs}`;
        
        const minutes = Math.floor(this.timeElapsed / 60);
        const seconds = this.timeElapsed % 60;
        document.getElementById('timer').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        this.updateBestScore();
    }

    updateBestScore() {
        const key = `memory-best-${this.difficulty}`;
        const bestScore = localStorage.getItem(key);
        
        if (bestScore) {
            const best = JSON.parse(bestScore);
            document.getElementById('bestMoves').textContent = best.moves || '-';
            document.getElementById('bestTime').textContent = best.time || '-';
        } else {
            document.getElementById('bestMoves').textContent = '-';
            document.getElementById('bestTime').textContent = '-';
        }
    }

    completeGame() {
        this.gameComplete = true;
        clearInterval(this.timer);
        
        const statusElement = document.getElementById('gameStatus');
        statusElement.textContent = '🎉 Congratulations! You found all pairs!';
        statusElement.className = 'game-status success';
        
        // Save best score
        const key = `memory-best-${this.difficulty}`;
        const bestScore = localStorage.getItem(key);
        const currentScore = {
            moves: this.moves,
            time: document.getElementById('timer').textContent
        };
        
        if (!bestScore) {
            localStorage.setItem(key, JSON.stringify(currentScore));
        } else {
            const best = JSON.parse(bestScore);
            if (this.moves < best.moves || (this.moves === best.moves && this.timeElapsed < this.parseTime(best.time))) {
                localStorage.setItem(key, JSON.stringify(currentScore));
            }
        }
        
        setTimeout(() => {
            this.showModal();
        }, 1500);
    }

    parseTime(timeStr) {
        const [minutes, seconds] = timeStr.split(':').map(Number);
        return minutes * 60 + seconds;
    }

    showModal() {
        document.getElementById('modalMoves').textContent = this.moves;
        document.getElementById('modalTime').textContent = document.getElementById('timer').textContent;
        document.getElementById('gameModal').classList.add('show');
    }

    closeModal() {
        document.getElementById('gameModal').classList.remove('show');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MemoryGame();
});
