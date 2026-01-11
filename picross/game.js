class PicrossGame {
    constructor() {
        this.size = 5; // 5x5, 10x10
        this.grid = [];
        this.solution = [];
        this.clues = { rows: [], cols: [] };
        this.mistakes = 0;
        this.timer = null;
        this.timeElapsed = 0;
        this.gameComplete = false;
        this.hintUsed = false;

        // Predefined puzzles for 5x5
        this.puzzles5x5 = [
            {
                solution: [
                    [1,1,1,0,0],
                    [0,1,0,1,0],
                    [1,1,1,1,1],
                    [0,1,0,1,0],
                    [1,1,1,0,0]
                ]
            },
            {
                solution: [
                    [0,1,1,1,0],
                    [1,1,1,1,1],
                    [1,0,1,0,1],
                    [1,1,1,1,1],
                    [0,1,1,1,0]
                ]
            },
            {
                solution: [
                    [1,0,1,0,1],
                    [1,1,1,1,1],
                    [0,1,1,1,0],
                    [1,1,1,1,1],
                    [1,0,1,0,1]
                ]
            },
            {
                solution: [
                    [1,1,0,0,0],
                    [1,1,1,0,0],
                    [0,1,1,1,0],
                    [0,0,1,1,1],
                    [0,0,0,1,1]
                ]
            },
            {
                solution: [
                    [0,0,1,0,0],
                    [0,1,1,1,0],
                    [1,1,1,1,1],
                    [0,1,1,1,0],
                    [0,0,1,0,0]
                ]
            },
            {
                solution: [
                    [1,0,0,0,1],
                    [0,1,0,1,0],
                    [0,0,1,0,0],
                    [0,1,0,1,0],
                    [1,0,0,0,1]
                ]
            },
            {
                solution: [
                    [1,1,1,1,1],
                    [1,0,0,0,1],
                    [1,0,1,0,1],
                    [1,0,0,0,1],
                    [1,1,1,1,1]
                ]
            },
            {
                solution: [
                    [0,1,1,1,0],
                    [1,0,0,0,1],
                    [1,0,0,0,1],
                    [1,0,0,0,1],
                    [0,1,1,1,0]
                ]
            },
            {
                solution: [
                    [1,0,0,0,0],
                    [1,1,0,0,0],
                    [1,1,1,0,0],
                    [1,1,1,1,0],
                    [1,1,1,1,1]
                ]
            },
            {
                solution: [
                    [1,1,1,1,1],
                    [0,1,1,1,0],
                    [0,0,1,0,0],
                    [0,1,1,1,0],
                    [1,1,1,1,1]
                ]
            },
            {
                solution: [
                    [0,0,1,0,0],
                    [0,1,1,1,0],
                    [1,1,0,1,1],
                    [0,1,1,1,0],
                    [0,0,1,0,0]
                ]
            },
            {
                solution: [
                    [1,1,0,1,1],
                    [1,0,0,0,1],
                    [0,0,1,0,0],
                    [1,0,0,0,1],
                    [1,1,0,1,1]
                ]
            },
            {
                solution: [
                    [0,1,0,1,0],
                    [1,1,1,1,1],
                    [0,1,1,1,0],
                    [1,1,1,1,1],
                    [0,1,0,1,0]
                ]
            },
            {
                solution: [
                    [1,1,1,0,0],
                    [1,0,1,0,0],
                    [1,1,1,0,0],
                    [0,0,0,1,1],
                    [0,0,0,1,1]
                ]
            },
            {
                solution: [
                    [1,0,1,0,1],
                    [0,1,0,1,0],
                    [1,0,1,0,1],
                    [0,1,0,1,0],
                    [1,0,1,0,1]
                ]
            }
        ];

        // Predefined puzzles for 10x10
        this.puzzles10x10 = this.generate10x10Puzzles();

        this.init();
    }

    generate10x10Puzzles() {
        // Predefined 10x10 puzzles for better variety
        const puzzles = [];
        
        // Puzzle 1: Checkerboard pattern
        const puzzle1 = Array(10).fill(null).map(() => Array(10).fill(0));
        for (let row = 0; row < 10; row++) {
            for (let col = 0; col < 10; col++) {
                if ((row + col) % 2 === 0) puzzle1[row][col] = 1;
            }
        }
        puzzles.push({ solution: puzzle1 });
        
        // Puzzle 2: Borders
        const puzzle2 = Array(10).fill(null).map(() => Array(10).fill(0));
        for (let i = 0; i < 10; i++) {
            puzzle2[0][i] = 1;
            puzzle2[9][i] = 1;
            puzzle2[i][0] = 1;
            puzzle2[i][9] = 1;
        }
        puzzles.push({ solution: puzzle2 });
        
        // Puzzle 3: Diagonal lines
        const puzzle3 = Array(10).fill(null).map(() => Array(10).fill(0));
        for (let i = 0; i < 10; i++) {
            puzzle3[i][i] = 1;
            puzzle3[i][9-i] = 1;
        }
        puzzles.push({ solution: puzzle3 });
        
        // Puzzle 4: Cross pattern
        const puzzle4 = Array(10).fill(null).map(() => Array(10).fill(0));
        for (let i = 0; i < 10; i++) {
            puzzle4[4][i] = 1;
            puzzle4[5][i] = 1;
            puzzle4[i][4] = 1;
            puzzle4[i][5] = 1;
        }
        puzzles.push({ solution: puzzle4 });
        
        // Puzzle 5: Heart pattern
        const puzzle5 = [
            [0,0,1,1,0,0,1,1,0,0],
            [0,1,1,1,1,1,1,1,1,0],
            [1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1],
            [0,1,1,1,1,1,1,1,1,0],
            [0,0,1,1,1,1,1,1,0,0],
            [0,0,0,1,1,1,1,0,0,0],
            [0,0,0,0,1,1,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0]
        ];
        puzzles.push({ solution: puzzle5 });
        
        // Puzzle 6: Arrow
        const puzzle6 = [
            [0,0,0,0,1,1,0,0,0,0],
            [0,0,0,1,1,1,1,0,0,0],
            [0,0,1,1,1,1,1,1,0,0],
            [0,1,1,1,1,1,1,1,1,0],
            [1,1,1,1,1,1,1,1,1,1],
            [0,0,0,0,1,1,0,0,0,0],
            [0,0,0,0,1,1,0,0,0,0],
            [0,0,0,0,1,1,0,0,0,0],
            [0,0,0,0,1,1,0,0,0,0],
            [0,0,0,0,1,1,0,0,0,0]
        ];
        puzzles.push({ solution: puzzle6 });
        
        // Puzzle 7: Diamond
        const puzzle7 = [
            [0,0,0,0,1,1,0,0,0,0],
            [0,0,0,1,1,1,1,0,0,0],
            [0,0,1,1,1,1,1,1,0,0],
            [0,1,1,1,1,1,1,1,1,0],
            [1,1,1,1,1,1,1,1,1,1],
            [0,1,1,1,1,1,1,1,1,0],
            [0,0,1,1,1,1,1,1,0,0],
            [0,0,0,1,1,1,1,0,0,0],
            [0,0,0,0,1,1,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0]
        ];
        puzzles.push({ solution: puzzle7 });
        
        // Puzzle 8: Plus sign
        const puzzle8 = Array(10).fill(null).map(() => Array(10).fill(0));
        for (let i = 2; i < 8; i++) {
            puzzle8[i][4] = 1;
            puzzle8[i][5] = 1;
            puzzle8[4][i] = 1;
            puzzle8[5][i] = 1;
        }
        puzzles.push({ solution: puzzle8 });
        
        // Puzzle 9: Blocks
        const puzzle9 = Array(10).fill(null).map(() => Array(10).fill(0));
        for (let row = 0; row < 10; row += 2) {
            for (let col = 0; col < 10; col += 2) {
                puzzle9[row][col] = 1;
                puzzle9[row][col+1] = 1;
                puzzle9[row+1][col] = 1;
                puzzle9[row+1][col+1] = 1;
            }
        }
        puzzles.push({ solution: puzzle9 });
        
        // Puzzle 10: Stripes
        const puzzle10 = Array(10).fill(null).map(() => Array(10).fill(0));
        for (let row = 0; row < 10; row += 2) {
            for (let col = 0; col < 10; col++) {
                puzzle10[row][col] = 1;
            }
        }
        puzzles.push({ solution: puzzle10 });
        
        return puzzles;
    }

    init() {
        this.setupEventListeners();
        this.newGame();
    }

    setupEventListeners() {
        document.getElementById('newGame').addEventListener('click', () => this.newGame());
        document.getElementById('size').addEventListener('click', () => this.toggleSize());
        document.getElementById('hint').addEventListener('click', () => this.showHint());
        document.getElementById('modalButton').addEventListener('click', () => {
            this.closeModal();
            this.newGame();
        });
    }

    toggleSize() {
        this.size = this.size === 5 ? 10 : 5;
        document.getElementById('size').textContent = `${this.size}x${this.size}`;
        this.newGame();
    }

    newGame() {
        this.mistakes = 0;
        this.timeElapsed = 0;
        this.gameComplete = false;
        this.hintUsed = false;
        
        const puzzles = this.size === 5 ? this.puzzles5x5 : this.puzzles10x10;
        const puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
        this.solution = puzzle.solution.map(row => [...row]);
        
        this.grid = Array(this.size).fill(null).map(() => 
            Array(this.size).fill(0) // 0: empty, 1: filled, 2: marked
        );
        
        this.generateClues();
        this.renderGrid();
        this.updateStats();
        this.startTimer();
        this.closeModal();
        
        const statusElement = document.getElementById('gameStatus');
        statusElement.textContent = '';
        statusElement.className = 'game-status';
    }

    generateClues() {
        this.clues.rows = [];
        this.clues.cols = [];
        
        // Generate row clues
        for (let row = 0; row < this.size; row++) {
            const clue = [];
            let count = 0;
            for (let col = 0; col < this.size; col++) {
                if (this.solution[row][col] === 1) {
                    count++;
                } else {
                    if (count > 0) {
                        clue.push(count);
                        count = 0;
                    }
                }
            }
            if (count > 0) clue.push(count);
            if (clue.length === 0) clue.push(0);
            this.clues.rows.push(clue);
        }
        
        // Generate column clues
        for (let col = 0; col < this.size; col++) {
            const clue = [];
            let count = 0;
            for (let row = 0; row < this.size; row++) {
                if (this.solution[row][col] === 1) {
                    count++;
                } else {
                    if (count > 0) {
                        clue.push(count);
                        count = 0;
                    }
                }
            }
            if (count > 0) clue.push(count);
            if (clue.length === 0) clue.push(0);
            this.clues.cols.push(clue);
        }
    }

    renderGrid() {
        const container = document.getElementById('picrossContainer');
        container.innerHTML = '';
        
        const gridElement = document.createElement('div');
        gridElement.className = 'picross-grid';
        gridElement.style.gridTemplateColumns = `repeat(${this.size + 1}, 1fr)`;
        gridElement.style.gridTemplateRows = `repeat(${this.size + 1}, 1fr)`;
        
        // Empty corner cell
        const cornerCell = document.createElement('div');
        gridElement.appendChild(cornerCell);
        
        // Column clues
        for (let col = 0; col < this.size; col++) {
            const clueCell = document.createElement('div');
            clueCell.className = 'picross-clue col';
            clueCell.textContent = this.clues.cols[col].join(' ');
            if (this.isColComplete(col)) {
                clueCell.classList.add('complete');
            }
            gridElement.appendChild(clueCell);
        }
        
        // Rows with clues and cells
        for (let row = 0; row < this.size; row++) {
            // Row clue
            const rowClueCell = document.createElement('div');
            rowClueCell.className = 'picross-clue';
            rowClueCell.textContent = this.clues.rows[row].join(' ');
            if (this.isRowComplete(row)) {
                rowClueCell.classList.add('complete');
            }
            gridElement.appendChild(rowClueCell);
            
            // Grid cells
            for (let col = 0; col < this.size; col++) {
                const cell = document.createElement('div');
                cell.className = 'picross-cell';
                cell.setAttribute('data-row', row);
                cell.setAttribute('data-col', col);
                
                if (this.grid[row][col] === 1) {
                    cell.classList.add('filled');
                } else if (this.grid[row][col] === 2) {
                    cell.classList.add('marked');
                }
                
                cell.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleCellClick(row, col, false);
                });
                
                cell.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    this.handleCellClick(row, col, true);
                });
                
                // Touch support for right-click (long press)
                let touchTimer;
                cell.addEventListener('touchstart', (e) => {
                    touchTimer = setTimeout(() => {
                        e.preventDefault();
                        this.handleCellClick(row, col, true);
                    }, 500);
                });
                
                cell.addEventListener('touchend', () => {
                    clearTimeout(touchTimer);
                });
                
                cell.addEventListener('touchmove', () => {
                    clearTimeout(touchTimer);
                });
                
                gridElement.appendChild(cell);
            }
        }
        
        container.appendChild(gridElement);
    }

    handleCellClick(row, col, isRightClick) {
        if (this.gameComplete) return;
        
        if (isRightClick) {
            // Mark as empty (X)
            if (this.grid[row][col] === 2) {
                this.grid[row][col] = 0;
            } else {
                this.grid[row][col] = 2;
            }
        } else {
            // Fill or clear
            if (this.grid[row][col] === 1) {
                this.grid[row][col] = 0;
            } else {
                this.grid[row][col] = 1;
                if (this.solution[row][col] !== 1) {
                    this.mistakes++;
                    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                    if (cell) {
                        cell.classList.add('error');
                        setTimeout(() => cell.classList.remove('error'), 500);
                    }
                }
            }
        }
        
        this.renderGrid();
        this.updateStats();
        this.checkComplete();
    }

    isRowComplete(row) {
        const userRow = [];
        let count = 0;
        for (let col = 0; col < this.size; col++) {
            if (this.grid[row][col] === 1) {
                count++;
            } else {
                if (count > 0) {
                    userRow.push(count);
                    count = 0;
                }
            }
        }
        if (count > 0) userRow.push(count);
        if (userRow.length === 0) userRow.push(0);
        
        return JSON.stringify(userRow) === JSON.stringify(this.clues.rows[row]);
    }

    isColComplete(col) {
        const userCol = [];
        let count = 0;
        for (let row = 0; row < this.size; row++) {
            if (this.grid[row][col] === 1) {
                count++;
            } else {
                if (count > 0) {
                    userCol.push(count);
                    count = 0;
                }
            }
        }
        if (count > 0) userCol.push(count);
        if (userCol.length === 0) userCol.push(0);
        
        return JSON.stringify(userCol) === JSON.stringify(this.clues.cols[col]);
    }

    checkComplete() {
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (this.solution[row][col] === 1 && this.grid[row][col] !== 1) {
                    return;
                }
            }
        }
        this.completeGame();
    }

    showHint() {
        if (this.hintUsed || this.gameComplete) return;
        
        // Find a random unfilled cell that should be filled
        const unfilled = [];
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (this.solution[row][col] === 1 && this.grid[row][col] !== 1) {
                    unfilled.push({ row, col });
                }
            }
        }
        
        if (unfilled.length > 0) {
            const hint = unfilled[Math.floor(Math.random() * unfilled.length)];
            this.grid[hint.row][hint.col] = 1;
            this.hintUsed = true;
            this.renderGrid();
            this.updateStats();
            this.checkComplete();
        }
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
        document.getElementById('mistakes').textContent = this.mistakes;
        const minutes = Math.floor(this.timeElapsed / 60);
        const seconds = this.timeElapsed % 60;
        document.getElementById('timer').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    completeGame() {
        this.gameComplete = true;
        clearInterval(this.timer);
        
        const statusElement = document.getElementById('gameStatus');
        statusElement.textContent = '🎉 Congratulations! Puzzle solved!';
        statusElement.className = 'game-status success';
        
        setTimeout(() => {
            this.showModal();
        }, 1000);
    }

    showModal() {
        document.getElementById('modalTime').textContent = document.getElementById('timer').textContent;
        document.getElementById('modalMistakes').textContent = this.mistakes;
        document.getElementById('gameModal').classList.add('show');
    }

    closeModal() {
        document.getElementById('gameModal').classList.remove('show');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new PicrossGame();
});
