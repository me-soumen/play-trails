class ConnectDots {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.dots = [];
        this.connectedDots = new Set();
        this.currentNumber = 1;
        this.totalDots = 20;
        this.completed = false;
        this.shapes = [
            this.createStar,
            this.createHeart,
            this.createSquare,
            this.createTriangle,
            this.createDiamond
        ];

        this.init();
    }

    init() {
        this.generateDots();
        this.draw();
        this.setupEventListeners();
        this.updateStats();
    }

    setupEventListeners() {
        this.canvas.addEventListener('click', (e) => this.handleClick(e));
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = this.canvas.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            this.handlePoint(x, y);
        });
        document.getElementById('newGame').addEventListener('click', () => this.newGame());
        document.getElementById('resetDrawing').addEventListener('click', () => this.resetDrawing());
        document.getElementById('modalButton').addEventListener('click', () => {
            this.closeModal();
            this.newGame();
        });
    }

    generateDots() {
        this.dots = [];
        const shape = this.shapes[Math.floor(Math.random() * this.shapes.length)];
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(this.canvas.width, this.canvas.height) * 0.35;
        
        this.dots = shape(centerX, centerY, radius, this.totalDots);
        this.currentNumber = 1;
        this.connectedDots = new Set();
    }

    createStar(centerX, centerY, radius, count) {
        const dots = [];
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const r = i % 2 === 0 ? radius : radius * 0.5;
            dots.push({
                x: centerX + Math.cos(angle) * r,
                y: centerY + Math.sin(angle) * r,
                number: i + 1
            });
        }
        return dots;
    }

    createHeart(centerX, centerY, radius, count) {
        const dots = [];
        for (let i = 0; i < count; i++) {
            const t = (i / count) * Math.PI * 2;
            const x = centerX + 16 * Math.pow(Math.sin(t), 3) * (radius / 50);
            const y = centerY - (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)) * (radius / 50);
            dots.push({ x, y, number: i + 1 });
        }
        return dots;
    }

    createSquare(centerX, centerY, radius, count) {
        const dots = [];
        const perSide = Math.floor(count / 4);
        for (let side = 0; side < 4; side++) {
            for (let i = 0; i < perSide; i++) {
                let x, y;
                const t = i / perSide;
                switch (side) {
                    case 0: // top
                        x = centerX - radius + (radius * 2 * t);
                        y = centerY - radius;
                        break;
                    case 1: // right
                        x = centerX + radius;
                        y = centerY - radius + (radius * 2 * t);
                        break;
                    case 2: // bottom
                        x = centerX + radius - (radius * 2 * t);
                        y = centerY + radius;
                        break;
                    case 3: // left
                        x = centerX - radius;
                        y = centerY + radius - (radius * 2 * t);
                        break;
                }
                dots.push({ x, y, number: dots.length + 1 });
            }
        }
        return dots;
    }

    createTriangle(centerX, centerY, radius, count) {
        const dots = [];
        const perSide = Math.floor(count / 3);
        const height = radius * Math.sqrt(3);
        for (let side = 0; side < 3; side++) {
            for (let i = 0; i < perSide; i++) {
                const t = i / perSide;
                let x, y;
                switch (side) {
                    case 0: // top-left to top-right
                        x = centerX - radius + (radius * 2 * t);
                        y = centerY - height / 2;
                        break;
                    case 1: // top-right to bottom
                        x = centerX + radius - (radius * t);
                        y = centerY - height / 2 + (height * t);
                        break;
                    case 2: // bottom to top-left
                        x = centerX - radius + (radius * t);
                        y = centerY - height / 2 + (height * (1 - t));
                        break;
                }
                dots.push({ x, y, number: dots.length + 1 });
            }
        }
        return dots;
    }

    createDiamond(centerX, centerY, radius, count) {
        const dots = [];
        const perSide = Math.floor(count / 4);
        for (let side = 0; side < 4; side++) {
            for (let i = 0; i < perSide; i++) {
                const t = i / perSide;
                let x, y;
                switch (side) {
                    case 0: // top
                        x = centerX - radius + (radius * 2 * t);
                        y = centerY - radius;
                        break;
                    case 1: // right
                        x = centerX + radius - (radius * t);
                        y = centerY - radius + (radius * 2 * t);
                        break;
                    case 2: // bottom
                        x = centerX + radius - (radius * 2 * t);
                        y = centerY + radius - (radius * t);
                        break;
                    case 3: // left
                        x = centerX - radius + (radius * t);
                        y = centerY + radius - (radius * 2 * t);
                        break;
                }
                dots.push({ x, y, number: dots.length + 1 });
            }
        }
        return dots;
    }

    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        this.handlePoint(x, y);
    }

    handlePoint(x, y) {
        if (this.completed) return;

        const tolerance = 25;
        for (let dot of this.dots) {
            const distance = Math.sqrt(Math.pow(x - dot.x, 2) + Math.pow(y - dot.y, 2));
            if (distance < tolerance && dot.number === this.currentNumber) {
                this.connectedDots.add(this.currentNumber);
                this.currentNumber++;
                this.draw();
                this.updateStats();
                
                if (this.currentNumber > this.totalDots) {
                    this.completeGame();
                }
                return;
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw lines
        this.ctx.strokeStyle = '#4a90e2';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        
        const sortedDots = [...this.connectedDots].sort((a, b) => a - b);
        for (let i = 0; i < sortedDots.length; i++) {
            const dot = this.dots.find(d => d.number === sortedDots[i]);
            if (dot) {
                if (i === 0) {
                    this.ctx.moveTo(dot.x, dot.y);
                } else {
                    this.ctx.lineTo(dot.x, dot.y);
                }
            }
        }
        this.ctx.stroke();

        // Draw dots
        for (let dot of this.dots) {
            const isConnected = this.connectedDots.has(dot.number);
            const isCurrent = dot.number === this.currentNumber;
            
            // Draw circle
            this.ctx.beginPath();
            this.ctx.arc(dot.x, dot.y, isConnected ? 8 : 10, 0, Math.PI * 2);
            this.ctx.fillStyle = isConnected ? '#50c878' : (isCurrent ? '#ffd700' : '#4a90e2');
            this.ctx.fill();
            this.ctx.strokeStyle = 'white';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            // Draw number
            this.ctx.fillStyle = 'white';
            this.ctx.font = 'bold 14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(dot.number, dot.x, dot.y);
        }
    }

    updateStats() {
        document.getElementById('currentNumber').textContent = 
            this.currentNumber > this.totalDots ? 'Done!' : this.currentNumber;
        document.getElementById('totalDots').textContent = this.totalDots;
        const percentage = Math.floor((this.connectedDots.size / this.totalDots) * 100);
        document.getElementById('completed').textContent = `${percentage}%`;
    }

    resetDrawing() {
        this.connectedDots = new Set();
        this.currentNumber = 1;
        this.completed = false;
        this.draw();
        this.updateStats();
        
        const statusElement = document.getElementById('gameStatus');
        statusElement.textContent = '';
        statusElement.className = 'game-status';
    }

    completeGame() {
        this.completed = true;
        const statusElement = document.getElementById('gameStatus');
        statusElement.textContent = '🎉 Congratulations! Picture completed!';
        statusElement.className = 'game-status success';
        
        setTimeout(() => {
            this.showModal();
        }, 1000);
    }

    newGame() {
        this.resetDrawing();
        this.generateDots();
        this.draw();
        this.updateStats();
        this.closeModal();
    }

    showModal() {
        const modal = document.getElementById('gameModal');
        modal.classList.add('show');
    }

    closeModal() {
        const modal = document.getElementById('gameModal');
        modal.classList.remove('show');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ConnectDots();
});
