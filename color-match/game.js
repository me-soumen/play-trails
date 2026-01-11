class ColorMatch {
    constructor() {
        this.level = 1;
        this.score = 0;
        this.timeLeft = 10;
        this.gameActive = false;
        this.timer = null;
        this.targetColor = null;
        this.colorGrid = [];
        this.scores = {
            highScore: 0,
            gamesPlayed: 0
        };

        this.init();
    }

    init() {
        this.loadScores();
        this.renderScores();
        this.setupEventListeners();
        this.generateColorGrid();
    }

    setupEventListeners() {
        document.getElementById('startGame').addEventListener('click', () => this.startGame());
        document.getElementById('newGame').addEventListener('click', () => this.resetGame());
        document.getElementById('resetScore').addEventListener('click', () => this.resetScores());
        document.getElementById('modalButton').addEventListener('click', () => {
            this.closeModal();
            this.resetGame();
        });
    }

    generateColorGrid() {
        const grid = document.getElementById('colorGrid');
        grid.innerHTML = '';
        
        // Generate a base color with slight variations for more challenge
        const baseColor = this.generateRandomColor();
        this.targetColor = baseColor;
        this.colorGrid = [baseColor];
        
        // Generate 8 similar but distinguishable colors
        for (let i = 0; i < 8; i++) {
            this.colorGrid.push(this.generateSimilarColor(baseColor, 25, 45)); // Variation range 25-45
        }
        
        // Shuffle the array
        this.colorGrid = this.shuffleArray(this.colorGrid);
        
        // Create color cells
        this.colorGrid.forEach((color, index) => {
            const cell = document.createElement('div');
            cell.className = 'color-cell';
            cell.style.backgroundColor = color;
            cell.setAttribute('data-index', index);
            cell.setAttribute('data-color', color);
            cell.addEventListener('click', () => this.handleColorClick(cell, color, index));
            grid.appendChild(cell);
        });
        
        // Update target color display
        const colorDisplay = document.getElementById('colorDisplay');
        colorDisplay.style.backgroundColor = this.targetColor;
        colorDisplay.classList.add('pulse');
        setTimeout(() => colorDisplay.classList.remove('pulse'), 500);
    }

    generateRandomColor() {
        // Generate vibrant colors for better visibility
        const hue = Math.floor(Math.random() * 360);
        const saturation = 60 + Math.floor(Math.random() * 40); // 60-100%
        const lightness = 40 + Math.floor(Math.random() * 20); // 40-60%
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

    generateSimilarColor(baseColor, minVariation, maxVariation) {
        // Convert HSL to manipulate
        const hslMatch = baseColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
        if (!hslMatch) {
            // Fallback for RGB
            return this.generateRandomColor();
        }
        
        let hue = parseInt(hslMatch[1]);
        let saturation = parseInt(hslMatch[2]);
        let lightness = parseInt(hslMatch[3]);
        
        // Modify hue slightly (10-30 degrees) and adjust saturation/lightness slightly
        const hueVariation = minVariation + Math.floor(Math.random() * (maxVariation - minVariation));
        hue = (hue + (Math.random() > 0.5 ? hueVariation : -hueVariation) + 360) % 360;
        
        // Slight variation in saturation (5-15%)
        saturation = Math.max(40, Math.min(100, saturation + (Math.random() > 0.5 ? 1 : -1) * (5 + Math.floor(Math.random() * 10))));
        
        // Slight variation in lightness (3-8%)
        lightness = Math.max(30, Math.min(70, lightness + (Math.random() > 0.5 ? 1 : -1) * (3 + Math.floor(Math.random() * 5))));
        
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }

    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    startGame() {
        this.gameActive = true;
        this.score = 0;
        this.level = 1;
        this.timeLeft = 12; // Slightly reduced for more challenge
        this.updateScore();
        this.updateLevel();
        this.startTimer();
        document.getElementById('startGame').style.display = 'none';
        document.getElementById('newGame').style.display = 'inline-block';
        this.generateColorGrid();
    }

    startTimer() {
        this.updateTimer();
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimer();
            
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    updateTimer() {
        document.getElementById('timeLeft').textContent = this.timeLeft;
        
        // Change color when time is running low
        const timeElement = document.getElementById('timeLeft');
        if (this.timeLeft <= 3) {
            timeElement.style.color = 'var(--danger-color)';
        } else {
            timeElement.style.color = 'var(--primary-color)';
        }
    }

    handleColorClick(cell, color, index) {
        if (!this.gameActive) return;
        
        const cells = document.querySelectorAll('.color-cell');
        cells.forEach(c => c.classList.add('disabled'));
        
        // Use color distance for matching (more challenging)
        const isCorrect = this.isColorMatch(color, this.targetColor);
        
        if (isCorrect) {
            cell.classList.add('correct');
            this.score += this.level * 10;
            this.level++;
            this.timeLeft += 2; // Add 2 seconds for correct answer (reduced from 3)
            this.updateScore();
            this.updateLevel();
            
            setTimeout(() => {
                this.generateColorGrid();
                cells.forEach(c => c.classList.remove('disabled', 'correct', 'incorrect'));
            }, 800);
        } else {
            cell.classList.add('incorrect');
            this.endGame();
        }
    }

    isColorMatch(color1, color2) {
        // Convert HSL to RGB for distance calculation
        const rgb1 = this.hslToRgb(color1);
        const rgb2 = this.hslToRgb(color2);
        
        if (!rgb1 || !rgb2) return color1 === color2; // Fallback to exact match
        
        // Calculate color distance
        const distance = Math.sqrt(
            Math.pow(rgb1[0] - rgb2[0], 2) +
            Math.pow(rgb1[1] - rgb2[1], 2) +
            Math.pow(rgb1[2] - rgb2[2], 2)
        );
        
        // Colors match if distance is very small (within 8 units - more challenging)
        return distance < 8;
    }

    hslToRgb(hsl) {
        const match = hsl.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
        if (!match) return null;
        
        const h = parseInt(match[1]) / 360;
        const s = parseInt(match[2]) / 100;
        const l = parseInt(match[3]) / 100;
        
        let r, g, b;
        
        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        
        return [
            Math.round(r * 255),
            Math.round(g * 255),
            Math.round(b * 255)
        ];
    }

    updateScore() {
        document.getElementById('currentScore').textContent = this.score;
    }

    updateLevel() {
        document.getElementById('level').textContent = this.level;
    }

    endGame() {
        this.gameActive = false;
        this.stopTimer();
        
        // Update scores
        this.scores.gamesPlayed++;
        if (this.score > this.scores.highScore) {
            this.scores.highScore = this.score;
        }
        this.saveScores();
        this.renderScores();
        
        // Show modal
        this.showModal(`You scored ${this.score} points!`, this.score);
    }

    resetGame() {
        this.gameActive = false;
        this.stopTimer();
        this.score = 0;
        this.level = 1;
        this.timeLeft = 12;
        this.updateScore();
        this.updateLevel();
        this.updateTimer();
        document.getElementById('startGame').style.display = 'inline-block';
        document.getElementById('newGame').style.display = 'none';
        this.generateColorGrid();
        this.closeModal();
        
        // Remove all cell classes
        const cells = document.querySelectorAll('.color-cell');
        cells.forEach(c => {
            c.classList.remove('disabled', 'correct', 'incorrect', 'selected');
        });
    }

    resetScores() {
        if (confirm('Are you sure you want to reset all scores?')) {
            this.scores = {
                highScore: 0,
                gamesPlayed: 0
            };
            this.saveScores();
            this.renderScores();
        }
    }

    renderScores() {
        document.getElementById('highScore').textContent = this.scores.highScore;
        document.getElementById('gamesPlayed').textContent = this.scores.gamesPlayed;
    }

    showModal(message, score) {
        const modal = document.getElementById('gameModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalMessage = document.getElementById('modalMessage');
        const modalScore = document.getElementById('modalScore');

        modalTitle.textContent = '🎉 Game Over!';
        modalMessage.textContent = message;
        modalScore.textContent = score;
        
        modal.classList.add('show');
    }

    closeModal() {
        const modal = document.getElementById('gameModal');
        modal.classList.remove('show');
    }

    saveScores() {
        localStorage.setItem('colorMatchScores', JSON.stringify(this.scores));
    }

    loadScores() {
        const savedScores = localStorage.getItem('colorMatchScores');
        if (savedScores) {
            this.scores = JSON.parse(savedScores);
        }
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ColorMatch();
});
