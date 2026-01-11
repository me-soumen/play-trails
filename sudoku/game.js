class SudokuGame {
    constructor() {
        this.gridSize = 6; // Default to 6x6
        this.grid = Array(6).fill(null).map(() => Array(6).fill(0));
        this.solution = Array(6).fill(null).map(() => Array(6).fill(0));
        this.initialGrid = Array(6).fill(null).map(() => Array(6).fill(0));
        this.selectedCell = null;
        this.selectedNumber = null;
        this.mistakes = 0;
        this.timer = null;
        this.timeElapsed = 0;
        this.gameComplete = false;

        this.init();
    }

    init() {
        this.updateNumberSelector();
        this.generatePuzzle();
        this.renderGrid();
        this.setupEventListeners();
        this.startTimer();
    }

    setupEventListeners() {
        // Size selector buttons
        document.getElementById('size6x6').addEventListener('click', () => this.changeSize(6));
        document.getElementById('size9x9').addEventListener('click', () => this.changeSize(9));

        // Number selector buttons
        document.querySelectorAll('.num-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const number = parseInt(e.target.getAttribute('data-number'));
                this.selectNumber(number);
            });
        });

        // Control buttons
        document.getElementById('newGame').addEventListener('click', () => this.newGame());
        document.getElementById('checkSolution').addEventListener('click', () => this.checkSolution());
        document.getElementById('solvePuzzle').addEventListener('click', () => this.showHint());
        document.getElementById('modalButton').addEventListener('click', () => {
            this.closeModal();
            this.newGame();
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key >= '1' && e.key <= '9') {
                const num = parseInt(e.key);
                if (num <= this.gridSize) {
                    this.selectNumber(num);
                    if (this.selectedCell) {
                        this.makeMove(this.selectedCell, num);
                    }
                }
            } else if (e.key === 'Delete' || e.key === 'Backspace') {
                if (this.selectedCell) {
                    this.makeMove(this.selectedCell, 0);
                }
            } else if (e.key.startsWith('Arrow')) {
                this.handleArrowKey(e.key);
            }
        });
    }

    changeSize(newSize) {
        if (this.gridSize === newSize) return;
        
        this.stopTimer();
        this.gridSize = newSize;
        
        // Update size buttons
        document.querySelectorAll('.size-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`size${newSize}x${newSize}`).classList.add('active');
        document.getElementById('currentSize').textContent = `${newSize}×${newSize}`;
        
        // Update number selector visibility
        this.updateNumberSelector();
        
        // Reset and generate new puzzle
        this.resetGrids();
        this.generatePuzzle();
        this.renderGrid();
        this.startTimer();
    }

    updateNumberSelector() {
        const numberSelector = document.getElementById('numberSelector');
        const buttons = numberSelector.querySelectorAll('.num-btn:not(.clear-btn)');
        
        buttons.forEach((btn, index) => {
            const num = index + 1;
            if (num <= this.gridSize) {
                btn.style.display = '';
            } else {
                btn.style.display = 'none';
            }
        });
    }

    resetGrids() {
        this.grid = Array(this.gridSize).fill(null).map(() => Array(this.gridSize).fill(0));
        this.solution = Array(this.gridSize).fill(null).map(() => Array(this.gridSize).fill(0));
        this.initialGrid = Array(this.gridSize).fill(null).map(() => Array(this.gridSize).fill(0));
        this.selectedCell = null;
        this.selectedNumber = null;
        this.mistakes = 0;
        this.timeElapsed = 0;
        this.gameComplete = false;
        document.getElementById('mistakes').textContent = '0';
        document.getElementById('gameStatus').textContent = '';
        document.getElementById('gameStatus').className = 'game-status';
    }

    generatePuzzle() {
        // Generate a complete solved puzzle
        this.solveGrid(this.solution);
        
        // Copy solution to grid
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                this.grid[i][j] = this.solution[i][j];
            }
        }

        // Remove numbers for medium difficulty
        const removeCount = this.gridSize === 6 ? 18 : 42; // ~50% empty
        this.removeNumbers(removeCount);

        // Save initial grid
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                this.initialGrid[i][j] = this.grid[i][j];
            }
        }
    }

    solveGrid(grid) {
        const empty = this.findEmpty(grid);
        if (!empty) return true;

        const [row, col] = empty;
        const numbers = this.shuffleArray(Array.from({length: this.gridSize}, (_, i) => i + 1));

        for (let num of numbers) {
            if (this.isValid(grid, row, col, num)) {
                grid[row][col] = num;

                if (this.solveGrid(grid)) {
                    return true;
                }

                grid[row][col] = 0;
            }
        }

        return false;
    }

    findEmpty(grid) {
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                if (grid[i][j] === 0) {
                    return [i, j];
                }
            }
        }
        return null;
    }

    isValid(grid, row, col, num) {
        // For 6x6: boxes are 2 rows × 3 columns (or 3x2)
        // For 9x9: boxes are 3 rows × 3 columns
        const boxRows = this.gridSize === 6 ? 2 : 3;
        const boxCols = this.gridSize === 6 ? 3 : 3;
        
        const boxRow = Math.floor(row / boxRows);
        const boxCol = Math.floor(col / boxCols);

        // Check row
        for (let x = 0; x < this.gridSize; x++) {
            if (grid[row][x] === num) return false;
        }

        // Check column
        for (let x = 0; x < this.gridSize; x++) {
            if (grid[x][col] === num) return false;
        }

        // Check box
        const startRow = boxRow * boxRows;
        const startCol = boxCol * boxCols;
        for (let i = 0; i < boxRows; i++) {
            for (let j = 0; j < boxCols; j++) {
                if (grid[i + startRow][j + startCol] === num) return false;
            }
        }

        return true;
    }

    shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    removeNumbers(count) {
        const positions = [];
        
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                positions.push([i, j]);
            }
        }

        const shuffledPositions = this.shuffleArray(positions);
        
        // Remove numbers for medium difficulty
        for (let i = 0; i < count && i < shuffledPositions.length; i++) {
            const [row, col] = shuffledPositions[i];
            this.grid[row][col] = 0;
        }
    }

    renderGrid() {
        const gridElement = document.getElementById('sudokuGrid');
        gridElement.innerHTML = '';
        gridElement.style.gridTemplateColumns = `repeat(${this.gridSize}, 1fr)`;

        // Box dimensions: 6x6 uses 2x3 boxes, 9x9 uses 3x3 boxes
        const boxRows = this.gridSize === 6 ? 2 : 3;
        const boxCols = this.gridSize === 6 ? 3 : 3;

        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                const cell = document.createElement('div');
                cell.className = 'sudoku-cell';
                cell.setAttribute('data-row', i);
                cell.setAttribute('data-col', j);

                // Add bold borders for boxes (3px solid)
                // Right border: after every boxCols columns (except last column)
                if ((j + 1) % boxCols === 0 && j < this.gridSize - 1) {
                    cell.style.borderRight = '3px solid var(--dark-color)';
                }
                // Bottom border: after every boxRows rows (except last row)
                if ((i + 1) % boxRows === 0 && i < this.gridSize - 1) {
                    cell.style.borderBottom = '3px solid var(--dark-color)';
                }

                if (this.initialGrid[i][j] !== 0) {
                    cell.textContent = this.initialGrid[i][j];
                    cell.classList.add('fixed');
                } else if (this.grid[i][j] !== 0) {
                    cell.textContent = this.grid[i][j];
                }

                cell.addEventListener('click', () => this.selectCell(i, j));
                gridElement.appendChild(cell);
            }
        }
    }

    selectCell(row, col) {
        if (this.initialGrid[row][col] !== 0) return; // Can't select fixed cells

        // Remove previous selection
        document.querySelectorAll('.sudoku-cell').forEach(cell => {
            cell.classList.remove('selected');
        });

        // Select new cell
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        if (cell) {
            cell.classList.add('selected');
            this.selectedCell = [row, col];

            // Select number if exists
            if (this.grid[row][col] !== 0) {
                this.selectNumber(this.grid[row][col]);
            }
        }
    }

    selectNumber(number) {
        // Remove previous selection
        document.querySelectorAll('.num-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Select new number
        if (number !== 0 && number <= this.gridSize) {
            const btn = document.querySelector(`[data-number="${number}"]`);
            if (btn) {
                btn.classList.add('active');
            }
        }

        this.selectedNumber = number;

        // Make move if cell is selected
        if (this.selectedCell) {
            this.makeMove(this.selectedCell, number);
        }
    }

    makeMove([row, col], number) {
        if (this.initialGrid[row][col] !== 0) return; // Can't change fixed cells
        if (this.gameComplete) return;
        if (number > this.gridSize) return; // Invalid number for grid size

        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        
        // Clear error state
        cell.classList.remove('error', 'hint');

        if (number === 0) {
            // Clear cell
            this.grid[row][col] = 0;
            cell.textContent = '';
        } else {
            // Validate move
            if (number === this.solution[row][col]) {
                // Correct move
                this.grid[row][col] = number;
                cell.textContent = number;
            } else {
                // Incorrect move
                this.grid[row][col] = number;
                cell.textContent = number;
                cell.classList.add('error');
                this.mistakes++;
                this.updateMistakes();
            }
        }

        // Check if game is complete
        if (this.isComplete()) {
            this.completeGame();
        }
    }

    showHint() {
        if (!this.selectedCell || this.gameComplete) return;

        const [row, col] = this.selectedCell;
        if (this.initialGrid[row][col] !== 0) return; // Can't hint fixed cells

        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        const correctNumber = this.solution[row][col];

        this.grid[row][col] = correctNumber;
        cell.textContent = correctNumber;
        cell.classList.remove('error');
        cell.classList.add('hint');

        this.selectNumber(correctNumber);

        // Check if game is complete
        if (this.isComplete()) {
            this.completeGame();
        }
    }

    checkSolution() {
        let hasErrors = false;
        const cells = document.querySelectorAll('.sudoku-cell');

        cells.forEach(cell => {
            const row = parseInt(cell.getAttribute('data-row'));
            const col = parseInt(cell.getAttribute('data-col'));
            
            if (this.initialGrid[row][col] === 0) {
                cell.classList.remove('error');
                
                if (this.grid[row][col] !== 0 && this.grid[row][col] !== this.solution[row][col]) {
                    cell.classList.add('error');
                    hasErrors = true;
                }
            }
        });

        const statusElement = document.getElementById('gameStatus');
        if (hasErrors) {
            statusElement.textContent = '❌ Some numbers are incorrect!';
            statusElement.className = 'game-status error';
        } else if (this.isComplete()) {
            statusElement.textContent = '✅ Puzzle completed correctly!';
            statusElement.className = 'game-status success';
            this.completeGame();
        } else {
            statusElement.textContent = '✓ So far so good! Keep going!';
            statusElement.className = 'game-status success';
        }

        setTimeout(() => {
            statusElement.textContent = '';
            statusElement.className = 'game-status';
        }, 3000);
    }

    isComplete() {
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                if (this.grid[i][j] !== this.solution[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }

    completeGame() {
        this.gameComplete = true;
        this.stopTimer();
        
        const statusElement = document.getElementById('gameStatus');
        statusElement.textContent = '🎉 Congratulations! Puzzle completed!';
        statusElement.className = 'game-status success';

        setTimeout(() => {
            this.showModal();
        }, 1000);
    }

    handleArrowKey(key) {
        if (!this.selectedCell) {
            this.selectCell(0, 0);
            return;
        }

        let [row, col] = this.selectedCell;

        switch (key) {
            case 'ArrowUp':
                row = Math.max(0, row - 1);
                break;
            case 'ArrowDown':
                row = Math.min(this.gridSize - 1, row + 1);
                break;
            case 'ArrowLeft':
                col = Math.max(0, col - 1);
                break;
            case 'ArrowRight':
                col = Math.min(this.gridSize - 1, col + 1);
                break;
        }

        // Skip fixed cells
        while (this.initialGrid[row][col] !== 0 && (row !== this.selectedCell[0] || col !== this.selectedCell[1])) {
            switch (key) {
                case 'ArrowUp':
                    row = Math.max(0, row - 1);
                    break;
                case 'ArrowDown':
                    row = Math.min(this.gridSize - 1, row + 1);
                    break;
                case 'ArrowLeft':
                    col = Math.max(0, col - 1);
                    break;
                case 'ArrowRight':
                    col = Math.min(this.gridSize - 1, col + 1);
                    break;
            }
        }

        this.selectCell(row, col);
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
        const minutes = Math.floor(this.timeElapsed / 60);
        const seconds = this.timeElapsed % 60;
        document.getElementById('timer').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    updateMistakes() {
        document.getElementById('mistakes').textContent = this.mistakes;
    }

    newGame() {
        this.stopTimer();
        this.resetGrids();
        this.generatePuzzle();
        this.renderGrid();
        this.startTimer();
        this.closeModal();
    }

    showModal() {
        const modal = document.getElementById('gameModal');
        const minutes = Math.floor(this.timeElapsed / 60);
        const seconds = this.timeElapsed % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        document.getElementById('modalTime').textContent = timeString;
        document.getElementById('modalMistakes').textContent = this.mistakes;
        document.getElementById('modalMessage').textContent = 'You solved the puzzle!';

        modal.classList.add('show');
    }

    closeModal() {
        const modal = document.getElementById('gameModal');
        modal.classList.remove('show');
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SudokuGame();
});
