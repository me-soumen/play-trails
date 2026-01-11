class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.scores = {
            X: 0,
            O: 0,
            draws: 0
        };
        
        this.winningConditions = [
            [0, 1, 2], // Top row
            [3, 4, 5], // Middle row
            [6, 7, 8], // Bottom row
            [0, 3, 6], // Left column
            [1, 4, 7], // Middle column
            [2, 5, 8], // Right column
            [0, 4, 8], // Diagonal top-left to bottom-right
            [2, 4, 6]  // Diagonal top-right to bottom-left
        ];

        this.init();
    }

    init() {
        this.loadScores();
        this.renderScores();
        this.setupEventListeners();
        this.updateCurrentPlayerDisplay();
    }

    setupEventListeners() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.addEventListener('click', () => this.handleCellClick(cell));
        });

        document.getElementById('newGame').addEventListener('click', () => this.resetGame());
        document.getElementById('resetScore').addEventListener('click', () => this.resetScores());
        document.getElementById('modalButton').addEventListener('click', () => this.closeModal());
    }

    handleCellClick(cell) {
        const index = parseInt(cell.getAttribute('data-index'));

        if (this.board[index] !== '' || !this.gameActive) {
            return;
        }

        this.makeMove(index, cell);
    }

    makeMove(index, cellElement) {
        this.board[index] = this.currentPlayer;
        cellElement.textContent = this.currentPlayer;
        cellElement.classList.add('filled', this.currentPlayer.toLowerCase());
        
        // Add click animation
        cellElement.style.transform = 'scale(0.8)';
        setTimeout(() => {
            cellElement.style.transform = 'scale(1)';
        }, 150);

        if (this.checkWinner()) {
            this.gameActive = false;
            this.scores[this.currentPlayer]++;
            this.saveScores();
            this.renderScores();
            this.showModal(`Player ${this.currentPlayer} Wins!`, 'victory');
            // Auto-reset after 2.5 seconds
            setTimeout(() => {
                this.resetGame();
            }, 2500);
            return;
        }

        if (this.checkDraw()) {
            this.gameActive = false;
            this.scores.draws++;
            this.saveScores();
            this.renderScores();
            this.showModal("It's a Draw!", 'draw');
            // Auto-reset after 2.5 seconds
            setTimeout(() => {
                this.resetGame();
            }, 2500);
            return;
        }

        this.switchPlayer();
    }

    checkWinner() {
        for (let condition of this.winningConditions) {
            const [a, b, c] = condition;
            if (
                this.board[a] !== '' &&
                this.board[a] === this.board[b] &&
                this.board[a] === this.board[c]
            ) {
                // Highlight winning cells
                condition.forEach(index => {
                    const cell = document.querySelector(`[data-index="${index}"]`);
                    cell.classList.add('winning');
                });
                return true;
            }
        }
        return false;
    }

    checkDraw() {
        return !this.board.includes('') && this.gameActive;
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.updateCurrentPlayerDisplay();
    }

    updateCurrentPlayerDisplay() {
        const currentPlayerElement = document.getElementById('currentPlayer');
        const playerIndicator = currentPlayerElement.querySelector('.player-indicator');
        const playerName = currentPlayerElement.querySelector('.player-name');

        playerIndicator.textContent = this.currentPlayer;
        playerName.textContent = this.currentPlayer;
        
        // Update active class
        currentPlayerElement.className = 'current-player';
        currentPlayerElement.classList.add(this.currentPlayer === 'X' ? 'active-x' : 'active-o');
    }

    resetGame() {
        this.board = Array(9).fill('');
        this.gameActive = true;
        this.currentPlayer = 'X';
        
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.textContent = '';
            cell.className = 'cell';
        });

        this.updateCurrentPlayerDisplay();
        this.closeModal();
    }

    resetScores() {
        if (confirm('Are you sure you want to reset all scores?')) {
            this.scores = {
                X: 0,
                O: 0,
                draws: 0
            };
            this.saveScores();
            this.renderScores();
        }
    }

    renderScores() {
        document.getElementById('scoreX').textContent = this.scores.X;
        document.getElementById('scoreO').textContent = this.scores.O;
        document.getElementById('scoreDraws').textContent = this.scores.draws;
    }

    showModal(message, type = '') {
        const modal = document.getElementById('gameModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalMessage = document.getElementById('modalMessage');

        modalTitle.textContent = type === 'victory' ? '🎉 Congratulations!' : 'Game Over!';
        modalMessage.textContent = message;
        
        modal.classList.add('show');
    }

    closeModal() {
        const modal = document.getElementById('gameModal');
        modal.classList.remove('show');
    }

    saveScores() {
        localStorage.setItem('ticTacToeScores', JSON.stringify(this.scores));
    }

    loadScores() {
        const savedScores = localStorage.getItem('ticTacToeScores');
        if (savedScores) {
            this.scores = JSON.parse(savedScores);
        }
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});
