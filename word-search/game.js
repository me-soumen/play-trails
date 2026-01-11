class WordSearch {
    constructor() {
        this.gridSize = 15;
        this.grid = [];
        // Word pool - diverse categories
        this.wordPool = [
            // Tech
            'JAVASCRIPT', 'PYTHON', 'REACT', 'NODEJS', 'HTML', 'CSS', 'GITHUB', 'CODE',
            'JAVA', 'RUBY', 'SWIFT', 'GO', 'RUST', 'PHP', 'SQL', 'JSON',
            // Cities
            'LONDON', 'PARIS', 'TOKYO', 'DELHI', 'MUMBAI', 'NEWYORK', 'DUBAI', 'SYDNEY',
            'BEIJING', 'MOSCOW', 'CAIRO', 'ROME', 'MADRID', 'BANGKOK', 'SINGAPORE', 'SEOUL',
            // Animals
            'TIGER', 'LION', 'EAGLE', 'SHARK', 'WHALE', 'BEAR', 'WOLF', 'FOX',
            'DEER', 'PANDA', 'KOALA', 'PENGUIN', 'DOLPHIN', 'ELEPHANT', 'GIRAFFE', 'ZEBRA',
            // Body Parts
            'HEART', 'BRAIN', 'LIVER', 'SPLEEN', 'STOMACH', 'KIDNEY', 'LUNGS', 'SKIN',
            'MUSCLE', 'BONE', 'NERVE', 'VEIN', 'ARTERY', 'THUMB', 'FINGER', 'TOE',
            // Fruits
            'APPLE', 'BANANA', 'ORANGE', 'MANGO', 'GRAPES', 'CHERRY', 'PEACH', 'PEAR',
            'LEMON', 'KIWI', 'MELON', 'BERRY', 'PAPAYA', 'GUAVA', 'PLUM', 'DATE',
            // Vegetables
            'CARROT', 'POTATO', 'TOMATO', 'ONION', 'CABBAGE', 'SPINACH', 'BROCCOLI', 'CORN',
            'BEANS', 'PEAS', 'PEPPER', 'CELERY', 'CUCUMBER', 'LETTUCE', 'RADISH', 'GARLIC',
            // Countries
            'INDIA', 'CHINA', 'JAPAN', 'FRANCE', 'GERMANY', 'ITALY', 'SPAIN', 'BRAZIL',
            'CANADA', 'MEXICO', 'EGYPT', 'RUSSIA', 'AUSTRALIA', 'SOUTHKOREA', 'THAILAND', 'TURKEY',
            // Subjects
            'MATH', 'SCIENCE', 'HISTORY', 'GEOGRAPHY', 'PHYSICS', 'CHEMISTRY', 'BIOLOGY', 'ENGLISH',
            'PHILOSOPHY', 'LITERATURE', 'ART', 'MUSIC', 'ECONOMICS', 'POLITICS', 'SOCIOLOGY', 'PSYCHOLOGY'
        ];
        this.currentWords = [];
        this.level = 1;
        this.foundWords = new Set();
        this.selectedCells = [];
        this.isSelecting = false;
        this.timer = null;
        this.timeElapsed = 0;
        this.gameComplete = false;
        this.wordsPerLevel = 5;

        this.init();
    }

    init() {
        this.selectNewWords();
        this.generateGrid();
        this.renderGrid();
        this.renderWordList();
        this.setupEventListeners();
        this.startTimer();
    }

    setupEventListeners() {
        document.getElementById('newGame').addEventListener('click', () => this.newGame());
        document.getElementById('modalButton').addEventListener('click', () => {
            this.closeModal();
            if (this.gameComplete) {
                this.nextLevel();
            } else {
                this.newGame();
            }
        });
    }

    selectNewWords() {
        // Select 5 random words from the pool
        const shuffled = [...this.wordPool].sort(() => Math.random() - 0.5);
        this.currentWords = shuffled.slice(0, this.wordsPerLevel);
        this.foundWords = new Set();
        this.gameComplete = false;
    }

    generateGrid() {
        // Initialize empty grid
        this.grid = Array(this.gridSize).fill(null).map(() => 
            Array(this.gridSize).fill(null)
        );

        // Place words in the grid
        const directions = [
            [0, 1],   // horizontal →
            [1, 0],   // vertical ↓
            [1, 1],   // diagonal ↘
            [1, -1],  // diagonal ↙
        ];

        for (let word of this.currentWords) {
            let placed = false;
            let attempts = 0;
            
            while (!placed && attempts < 300) {
                const dir = directions[Math.floor(Math.random() * directions.length)];
                
                // Calculate bounds
                let maxRow = this.gridSize;
                let maxCol = this.gridSize;
                if (dir[0] > 0) maxRow = this.gridSize - word.length;
                if (dir[1] > 0) maxCol = this.gridSize - word.length;
                if (dir[1] < 0) maxCol = word.length - 1;
                
                if (maxRow <= 0 || maxCol <= 0 || maxRow >= this.gridSize || maxCol >= this.gridSize) {
                    attempts++;
                    continue;
                }
                
                const row = Math.floor(Math.random() * Math.max(1, maxRow));
                const col = Math.floor(Math.random() * Math.max(1, maxCol));
                
                // Check if word can fit
                let canPlace = true;
                for (let i = 0; i < word.length; i++) {
                    const r = row + dir[0] * i;
                    const c = col + dir[1] * i;
                    
                    if (r < 0 || r >= this.gridSize || c < 0 || c >= this.gridSize) {
                        canPlace = false;
                        break;
                    }
                    
                    // Can place if cell is empty or has matching letter
                    if (this.grid[r][c] !== null && this.grid[r][c] !== word[i]) {
                        canPlace = false;
                        break;
                    }
                }
                
                if (canPlace) {
                    // Place the word
                    for (let i = 0; i < word.length; i++) {
                        const r = row + dir[0] * i;
                        const c = col + dir[1] * i;
                        this.grid[r][c] = word[i];
                    }
                    placed = true;
                }
                attempts++;
            }
            
            // Fallback: place word horizontally at a safe row
            if (!placed) {
                const safeRow = (this.currentWords.indexOf(word) * 2) % this.gridSize;
                for (let i = 0; i < word.length && i < this.gridSize; i++) {
                    if (this.grid[safeRow][i] === null) {
                        this.grid[safeRow][i] = word[i];
                    }
                }
            }
        }

        // Fill remaining spaces with random letters
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                if (this.grid[i][j] === null) {
                    this.grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
                }
            }
        }
    }

    renderGrid() {
        const gridElement = document.getElementById('wordGrid');
        gridElement.innerHTML = '';
        gridElement.style.gridTemplateColumns = `repeat(${this.gridSize}, 1fr)`;

        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.textContent = this.grid[i][j] || 'A';
                cell.setAttribute('data-row', i);
                cell.setAttribute('data-col', j);

                cell.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    this.startSelection(i, j);
                });
                
                cell.addEventListener('mouseenter', (e) => {
                    if (this.isSelecting) {
                        this.continueSelection(i, j);
                    }
                });
                
                document.addEventListener('mouseup', () => {
                    if (this.isSelecting) {
                        this.endSelection();
                    }
                });

                gridElement.appendChild(cell);
            }
        }
    }

    renderWordList() {
        const wordList = document.getElementById('wordList');
        if (!wordList) return;
        
        wordList.innerHTML = '';
        
        // Add level indicator
        const levelHeader = document.createElement('li');
        levelHeader.style.gridColumn = '1 / -1';
        levelHeader.style.fontWeight = '700';
        levelHeader.style.color = 'var(--dark-color)';
        levelHeader.style.background = 'transparent';
        levelHeader.textContent = `Level ${this.level} - Find 5 Words`;
        wordList.appendChild(levelHeader);
        
        this.currentWords.forEach(word => {
            const li = document.createElement('li');
            li.textContent = word;
            li.setAttribute('data-word', word);
            if (this.foundWords.has(word)) {
                li.classList.add('found');
            }
            wordList.appendChild(li);
        });
    }

    startSelection(row, col) {
        if (this.gameComplete) return;
        this.isSelecting = true;
        this.selectedCells = [[row, col]];
        this.updateSelection();
    }

    continueSelection(row, col) {
        if (!this.isSelecting || this.gameComplete) return;
        
        const lastCell = this.selectedCells[this.selectedCells.length - 1];
        if (lastCell[0] === row && lastCell[1] === col) return;

        // Check if selection is in a straight line
        const firstCell = this.selectedCells[0];
        const dx = row - firstCell[0];
        const dy = col - firstCell[1];
        
        if (dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy)) {
            // Clear and rebuild selection
            this.selectedCells = [];
            const steps = Math.max(Math.abs(dx), Math.abs(dy));
            const stepX = dx === 0 ? 0 : dx / steps;
            const stepY = dy === 0 ? 0 : dy / steps;
            
            for (let i = 0; i <= steps; i++) {
                const r = Math.round(firstCell[0] + stepX * i);
                const c = Math.round(firstCell[1] + stepY * i);
                this.selectedCells.push([r, c]);
            }
            this.updateSelection();
        }
    }

    endSelection() {
        if (!this.isSelecting) return;
        this.isSelecting = false;
        
        if (this.selectedCells.length > 0) {
            this.checkWord();
        }
        this.selectedCells = [];
        this.updateSelection();
    }

    updateSelection() {
        document.querySelectorAll('.grid-cell').forEach(cell => {
            cell.classList.remove('selected');
        });

        this.selectedCells.forEach(([row, col]) => {
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            if (cell && !cell.classList.contains('found')) {
                cell.classList.add('selected');
            }
        });
    }

    checkWord() {
        if (this.selectedCells.length < 3) return;

        // Get word from selected cells
        let word = '';
        
        this.selectedCells.forEach(([row, col]) => {
            if (row >= 0 && row < this.gridSize && col >= 0 && col < this.gridSize) {
                word += this.grid[row][col];
            }
        });

        const reverseWord = word.split('').reverse().join('');

        // Check if word matches any word in the current list
        for (let targetWord of this.currentWords) {
            if (word === targetWord || reverseWord === targetWord) {
                if (!this.foundWords.has(targetWord)) {
                    this.foundWords.add(targetWord);
                    this.markFound();
                    this.updateWordsFound();
                    this.renderWordList();
                    
                    if (this.foundWords.size === this.currentWords.length) {
                        this.completeLevel();
                    }
                }
                break;
            }
        }
    }

    markFound() {
        this.selectedCells.forEach(([row, col]) => {
            const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            if (cell) {
                cell.classList.add('found');
                cell.classList.remove('selected');
            }
        });
    }

    updateWordsFound() {
        const element = document.getElementById('wordsFound');
        if (element) {
            element.textContent = `${this.foundWords.size} / ${this.currentWords.length}`;
        }
        
        const levelElement = document.getElementById('level');
        if (levelElement) {
            levelElement.textContent = this.level;
        }
    }

    completeLevel() {
        this.gameComplete = true;
        
        const statusElement = document.getElementById('gameStatus');
        if (statusElement) {
            statusElement.textContent = `🎉 Level ${this.level} Complete! Finding next level...`;
            statusElement.className = 'game-status success';
        }

        setTimeout(() => {
            this.nextLevel();
        }, 2000);
    }

    nextLevel() {
        this.level++;
        this.selectNewWords();
        this.generateGrid();
        this.renderGrid();
        this.renderWordList();
        this.updateWordsFound();
        
        const statusElement = document.getElementById('gameStatus');
        if (statusElement) {
            statusElement.textContent = `Level ${this.level} - Find 5 new words!`;
            statusElement.className = 'game-status success';
            setTimeout(() => {
                statusElement.textContent = '';
                statusElement.className = 'game-status';
            }, 2000);
        }
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.timeElapsed++;
            this.updateTimer();
        }, 1000);
    }

    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    updateTimer() {
        const timerElement = document.getElementById('timer');
        if (!timerElement) return;
        
        const minutes = Math.floor(this.timeElapsed / 60);
        const seconds = this.timeElapsed % 60;
        timerElement.textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    newGame() {
        this.stopTimer();
        this.level = 1;
        this.timeElapsed = 0;
        this.selectNewWords();
        this.generateGrid();
        this.renderGrid();
        this.renderWordList();
        this.updateWordsFound();
        
        const statusElement = document.getElementById('gameStatus');
        if (statusElement) {
            statusElement.textContent = '';
            statusElement.className = 'game-status';
        }
        
        this.startTimer();
        this.closeModal();
    }

    showModal() {
        const modal = document.getElementById('gameModal');
        if (!modal) return;
        
        const minutes = Math.floor(this.timeElapsed / 60);
        const seconds = this.timeElapsed % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        const timeElement = document.getElementById('modalTime');
        if (timeElement) {
            timeElement.textContent = timeString;
        }
        
        const wordsElement = document.getElementById('modalWords');
        if (wordsElement) {
            wordsElement.textContent = `${this.currentWords.length} / ${this.currentWords.length}`;
        }
        
        const messageElement = document.getElementById('modalMessage');
        if (messageElement) {
            messageElement.textContent = `Level ${this.level} Complete! Ready for next level?`;
        }

        modal.classList.add('show');
    }

    closeModal() {
        const modal = document.getElementById('gameModal');
        if (modal) {
            modal.classList.remove('show');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new WordSearch();
});
