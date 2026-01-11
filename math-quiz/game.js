class MathQuiz {
    constructor() {
        this.score = 0;
        this.questionNum = 0;
        this.totalQuestions = 10;
        this.correctAnswers = 0;
        this.currentQuestion = null;
        this.gameActive = false;
        this.timer = null;
        this.timeLeft = 30;
        this.bestScore = 0;

        this.init();
    }

    init() {
        this.loadBestScore();
        this.updateBestScore();
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('startGame').addEventListener('click', () => this.startGame());
        document.getElementById('newGame').addEventListener('click', () => this.newGame());
        document.getElementById('resetScore').addEventListener('click', () => this.resetBestScore());
        document.getElementById('submitBtn').addEventListener('click', () => this.submitAnswer());
        document.getElementById('answerInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !document.getElementById('submitBtn').disabled) {
                this.submitAnswer();
            }
        });
        document.getElementById('modalButton').addEventListener('click', () => {
            this.closeModal();
            this.newGame();
        });
    }

    generateQuestion() {
        const operations = ['+', '-', '*'];
        const operation = operations[Math.floor(Math.random() * operations.length)];
        
        let num1, num2, answer;
        
        switch (operation) {
            case '+':
                num1 = Math.floor(Math.random() * 100) + 1;
                num2 = Math.floor(Math.random() * 100) + 1;
                answer = num1 + num2;
                break;
            case '-':
                num1 = Math.floor(Math.random() * 100) + 20;
                num2 = Math.floor(Math.random() * num1);
                answer = num1 - num2;
                break;
            case '*':
                num1 = Math.floor(Math.random() * 12) + 1;
                num2 = Math.floor(Math.random() * 12) + 1;
                answer = num1 * num2;
                break;
        }

        const symbol = operation === '*' ? '×' : operation;
        this.currentQuestion = { num1, num2, symbol, answer };
        
        document.getElementById('question').textContent = `${num1} ${symbol} ${num2} = ?`;
        document.getElementById('answerInput').value = '';
        document.getElementById('answerInput').focus();
    }

    startGame() {
        this.gameActive = true;
        this.score = 0;
        this.questionNum = 0;
        this.correctAnswers = 0;
        this.timeLeft = 30;
        
        document.getElementById('startGame').style.display = 'none';
        document.getElementById('newGame').style.display = 'inline-block';
        document.getElementById('answerInput').disabled = false;
        document.getElementById('submitBtn').disabled = false;
        document.getElementById('gameStatus').textContent = '';
        document.getElementById('gameStatus').className = 'game-status';
        
        this.generateQuestion();
        this.updateStats();
        this.startTimer();
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
        document.getElementById('timeLeft').textContent = `${this.timeLeft}s`;
        
        const timeElement = document.getElementById('timeLeft');
        if (this.timeLeft <= 10) {
            timeElement.style.color = 'var(--danger-color)';
        } else {
            timeElement.style.color = 'var(--primary-color)';
        }
    }

    submitAnswer() {
        if (!this.gameActive) return;
        
        const userAnswer = parseInt(document.getElementById('answerInput').value);
        
        if (isNaN(userAnswer)) {
            return;
        }

        const isCorrect = userAnswer === this.currentQuestion.answer;
        const statusElement = document.getElementById('gameStatus');
        
        if (isCorrect) {
            this.score += 10;
            this.correctAnswers++;
            statusElement.textContent = '✓ Correct! +10 points';
            statusElement.className = 'game-status success';
        } else {
            statusElement.textContent = `✗ Wrong! Answer was ${this.currentQuestion.answer}`;
            statusElement.className = 'game-status error';
        }

        this.questionNum++;
        this.updateStats();
        
        setTimeout(() => {
            if (this.questionNum >= this.totalQuestions) {
                this.endGame();
            } else {
                statusElement.textContent = '';
                statusElement.className = 'game-status';
                this.generateQuestion();
            }
        }, 1500);
    }

    updateStats() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('questionNum').textContent = `${this.questionNum + 1} / ${this.totalQuestions}`;
    }

    endGame() {
        this.gameActive = false;
        this.stopTimer();
        
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            this.saveBestScore();
            this.updateBestScore();
        }
        
        this.showModal();
    }

    newGame() {
        this.stopTimer();
        this.gameActive = false;
        this.score = 0;
        this.questionNum = 0;
        this.correctAnswers = 0;
        this.timeLeft = 30;
        
        document.getElementById('startGame').style.display = 'inline-block';
        document.getElementById('newGame').style.display = 'none';
        document.getElementById('answerInput').disabled = true;
        document.getElementById('submitBtn').disabled = true;
        document.getElementById('question').textContent = 'Ready to start?';
        document.getElementById('gameStatus').textContent = '';
        document.getElementById('gameStatus').className = 'game-status';
        this.updateStats();
        this.closeModal();
    }

    resetBestScore() {
        if (confirm('Are you sure you want to reset your best score?')) {
            this.bestScore = 0;
            this.saveBestScore();
            this.updateBestScore();
        }
    }

    updateBestScore() {
        document.getElementById('bestScore').textContent = this.bestScore;
    }

    saveBestScore() {
        localStorage.setItem('mathQuizBestScore', this.bestScore.toString());
    }

    loadBestScore() {
        const saved = localStorage.getItem('mathQuizBestScore');
        if (saved) {
            this.bestScore = parseInt(saved);
        }
    }

    showModal() {
        const modal = document.getElementById('gameModal');
        document.getElementById('modalScore').textContent = this.score;
        document.getElementById('modalCorrect').textContent = `${this.correctAnswers}/${this.totalQuestions}`;
        
        let message = '';
        const percentage = (this.correctAnswers / this.totalQuestions) * 100;
        if (percentage === 100) {
            message = 'Perfect score! Outstanding!';
        } else if (percentage >= 80) {
            message = 'Great job!';
        } else if (percentage >= 60) {
            message = 'Good effort!';
        } else {
            message = 'Keep practicing!';
        }
        
        document.getElementById('modalMessage').textContent = message;
        modal.classList.add('show');
    }

    closeModal() {
        const modal = document.getElementById('gameModal');
        modal.classList.remove('show');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MathQuiz();
});
