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
            this.createDiamond,
            this.createCircle,
            this.createPentagon,
            this.createHexagon,
            this.createOctagon,
            this.createHouse,
            this.createArrow,
            this.createButterfly,
            this.createSpiral,
            this.createZigzag,
            this.createCross,
            this.createFlower,
            this.createSwan,
            this.createBoat,
            this.createAirplane,
            this.createCar
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
        
        const result = shape(centerX, centerY, radius);
        this.dots = result.dots || result;
        this.totalDots = this.dots.length;
        this.currentNumber = 1;
        this.connectedDots = new Set();
    }


    createDiamond(centerX, centerY, radius) {
        const dots = [];
        const count = 20;
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

    createCircle(centerX, centerY, radius) {
        const dots = [];
        const count = 24;
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            dots.push({
                x: centerX + Math.cos(angle) * radius,
                y: centerY + Math.sin(angle) * radius,
                number: i + 1
            });
        }
        return dots;
    }

    createPentagon(centerX, centerY, radius) {
        const dots = [];
        const count = 25;
        const sides = 5;
        const perSide = count / sides;
        for (let side = 0; side < sides; side++) {
            for (let i = 0; i < perSide; i++) {
                const t = i / perSide;
                const angle1 = (side / sides) * Math.PI * 2 - Math.PI / 2;
                const angle2 = ((side + 1) / sides) * Math.PI * 2 - Math.PI / 2;
                const x1 = centerX + Math.cos(angle1) * radius;
                const y1 = centerY + Math.sin(angle1) * radius;
                const x2 = centerX + Math.cos(angle2) * radius;
                const y2 = centerY + Math.sin(angle2) * radius;
                dots.push({
                    x: x1 + (x2 - x1) * t,
                    y: y1 + (y2 - y1) * t,
                    number: dots.length + 1
                });
            }
        }
        return dots;
    }

    createHexagon(centerX, centerY, radius) {
        const dots = [];
        const count = 24;
        const sides = 6;
        const perSide = count / sides;
        for (let side = 0; side < sides; side++) {
            for (let i = 0; i < perSide; i++) {
                const t = i / perSide;
                const angle1 = (side / sides) * Math.PI * 2 - Math.PI / 2;
                const angle2 = ((side + 1) / sides) * Math.PI * 2 - Math.PI / 2;
                const x1 = centerX + Math.cos(angle1) * radius;
                const y1 = centerY + Math.sin(angle1) * radius;
                const x2 = centerX + Math.cos(angle2) * radius;
                const y2 = centerY + Math.sin(angle2) * radius;
                dots.push({
                    x: x1 + (x2 - x1) * t,
                    y: y1 + (y2 - y1) * t,
                    number: dots.length + 1
                });
            }
        }
        return dots;
    }

    createOctagon(centerX, centerY, radius) {
        const dots = [];
        const count = 32;
        const sides = 8;
        const perSide = count / sides;
        for (let side = 0; side < sides; side++) {
            for (let i = 0; i < perSide; i++) {
                const t = i / perSide;
                const angle1 = (side / sides) * Math.PI * 2 - Math.PI / 2;
                const angle2 = ((side + 1) / sides) * Math.PI * 2 - Math.PI / 2;
                const x1 = centerX + Math.cos(angle1) * radius;
                const y1 = centerY + Math.sin(angle1) * radius;
                const x2 = centerX + Math.cos(angle2) * radius;
                const y2 = centerY + Math.sin(angle2) * radius;
                dots.push({
                    x: x1 + (x2 - x1) * t,
                    y: y1 + (y2 - y1) * t,
                    number: dots.length + 1
                });
            }
        }
        return dots;
    }

    createHouse(centerX, centerY, radius) {
        const dots = [];
        // Roof (triangle)
        dots.push({ x: centerX, y: centerY - radius, number: 1 });
        dots.push({ x: centerX - radius * 0.8, y: centerY - radius * 0.3, number: 2 });
        dots.push({ x: centerX + radius * 0.8, y: centerY - radius * 0.3, number: 3 });
        // Walls (square)
        dots.push({ x: centerX - radius * 0.8, y: centerY - radius * 0.3, number: 4 });
        dots.push({ x: centerX - radius * 0.8, y: centerY + radius * 0.7, number: 5 });
        dots.push({ x: centerX + radius * 0.8, y: centerY + radius * 0.7, number: 6 });
        dots.push({ x: centerX + radius * 0.8, y: centerY - radius * 0.3, number: 7 });
        return dots;
    }

    createArrow(centerX, centerY, radius) {
        const dots = [];
        // Arrow body
        dots.push({ x: centerX - radius, y: centerY, number: 1 });
        dots.push({ x: centerX + radius * 0.4, y: centerY, number: 2 });
        // Arrow head
        dots.push({ x: centerX + radius * 0.4, y: centerY - radius * 0.3, number: 3 });
        dots.push({ x: centerX + radius, y: centerY, number: 4 });
        dots.push({ x: centerX + radius * 0.4, y: centerY + radius * 0.3, number: 5 });
        dots.push({ x: centerX + radius * 0.4, y: centerY, number: 6 });
        return dots;
    }

    createButterfly(centerX, centerY, radius) {
        const dots = [];
        // Body
        dots.push({ x: centerX, y: centerY - radius * 0.7, number: 1 });
        dots.push({ x: centerX, y: centerY, number: 2 });
        dots.push({ x: centerX, y: centerY + radius * 0.7, number: 3 });
        // Upper wings
        dots.push({ x: centerX, y: centerY - radius * 0.7, number: 4 });
        dots.push({ x: centerX - radius * 0.8, y: centerY - radius * 0.5, number: 5 });
        dots.push({ x: centerX - radius * 0.6, y: centerY - radius * 0.2, number: 6 });
        dots.push({ x: centerX, y: centerY, number: 7 });
        dots.push({ x: centerX + radius * 0.6, y: centerY - radius * 0.2, number: 8 });
        dots.push({ x: centerX + radius * 0.8, y: centerY - radius * 0.5, number: 9 });
        dots.push({ x: centerX, y: centerY - radius * 0.7, number: 10 });
        // Lower wings
        dots.push({ x: centerX, y: centerY, number: 11 });
        dots.push({ x: centerX - radius * 0.6, y: centerY + radius * 0.2, number: 12 });
        dots.push({ x: centerX - radius * 0.8, y: centerY + radius * 0.5, number: 13 });
        dots.push({ x: centerX, y: centerY + radius * 0.7, number: 14 });
        dots.push({ x: centerX + radius * 0.8, y: centerY + radius * 0.5, number: 15 });
        dots.push({ x: centerX + radius * 0.6, y: centerY + radius * 0.2, number: 16 });
        dots.push({ x: centerX, y: centerY, number: 17 });
        return dots;
    }

    createSpiral(centerX, centerY, radius) {
        const dots = [];
        const count = 30;
        for (let i = 0; i < count; i++) {
            const t = i / count;
            const angle = t * Math.PI * 4;
            const r = t * radius;
            dots.push({
                x: centerX + Math.cos(angle) * r,
                y: centerY + Math.sin(angle) * r,
                number: i + 1
            });
        }
        return dots;
    }

    createZigzag(centerX, centerY, radius) {
        const dots = [];
        const count = 18;
        for (let i = 0; i < count; i++) {
            const t = i / (count - 1);
            const x = centerX - radius + (radius * 2 * t);
            const y = centerY + (i % 2 === 0 ? -radius * 0.4 : radius * 0.4);
            dots.push({ x, y, number: i + 1 });
        }
        return dots;
    }

    createCross(centerX, centerY, radius) {
        const dots = [];
        // Vertical line
        dots.push({ x: centerX, y: centerY - radius, number: 1 });
        dots.push({ x: centerX, y: centerY - radius * 0.3, number: 2 });
        dots.push({ x: centerX, y: centerY + radius * 0.3, number: 3 });
        dots.push({ x: centerX, y: centerY + radius, number: 4 });
        // Horizontal line
        dots.push({ x: centerX, y: centerY + radius * 0.3, number: 5 });
        dots.push({ x: centerX - radius * 0.3, y: centerY, number: 6 });
        dots.push({ x: centerX - radius, y: centerY, number: 7 });
        dots.push({ x: centerX + radius, y: centerY, number: 8 });
        dots.push({ x: centerX + radius * 0.3, y: centerY, number: 9 });
        dots.push({ x: centerX, y: centerY - radius * 0.3, number: 10 });
        return dots;
    }

    createFlower(centerX, centerY, radius) {
        const dots = [];
        const petals = 6;
        const count = 24;
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const petalAngle = (i * petals / count) * Math.PI * 2;
            const r = radius * (0.6 + 0.4 * Math.cos(petalAngle * 2));
            dots.push({
                x: centerX + Math.cos(angle) * r,
                y: centerY + Math.sin(angle) * r,
                number: i + 1
            });
        }
        return dots;
    }

    createSwan(centerX, centerY, radius) {
        const dots = [];
        // Head and neck (curve)
        for (let i = 0; i < 6; i++) {
            const t = i / 5;
            const angle = Math.PI * 0.3 + t * Math.PI * 0.4;
            const r = radius * (0.8 - t * 0.3);
            dots.push({
                x: centerX + Math.cos(angle) * r,
                y: centerY - radius * 0.5 + Math.sin(angle) * r * 0.5,
                number: i + 1
            });
        }
        // Body (oval)
        for (let i = 0; i < 10; i++) {
            const t = i / 9;
            const angle = Math.PI * 0.7 + t * Math.PI * 0.8;
            dots.push({
                x: centerX + Math.cos(angle) * radius * 0.6,
                y: centerY + radius * 0.3 + Math.sin(angle) * radius * 0.4,
                number: dots.length + 1
            });
        }
        return dots;
    }

    createBoat(centerX, centerY, radius) {
        const dots = [];
        // Hull (bottom curve)
        for (let i = 0; i < 8; i++) {
            const t = i / 7;
            const angle = Math.PI + t * Math.PI;
            dots.push({
                x: centerX + Math.cos(angle) * radius * 0.8,
                y: centerY + radius * 0.5 + Math.sin(angle) * radius * 0.2,
                number: i + 1
            });
        }
        // Mast
        dots.push({ x: centerX, y: centerY + radius * 0.5, number: 9 });
        dots.push({ x: centerX, y: centerY - radius * 0.3, number: 10 });
        // Sail
        dots.push({ x: centerX, y: centerY - radius * 0.3, number: 11 });
        dots.push({ x: centerX + radius * 0.5, y: centerY, number: 12 });
        dots.push({ x: centerX, y: centerY + radius * 0.2, number: 13 });
        return dots;
    }

    createAirplane(centerX, centerY, radius) {
        const dots = [];
        // Body
        dots.push({ x: centerX - radius, y: centerY, number: 1 });
        dots.push({ x: centerX + radius * 0.8, y: centerY, number: 2 });
        // Nose
        dots.push({ x: centerX + radius * 0.8, y: centerY - radius * 0.2, number: 3 });
        dots.push({ x: centerX + radius, y: centerY, number: 4 });
        dots.push({ x: centerX + radius * 0.8, y: centerY + radius * 0.2, number: 5 });
        dots.push({ x: centerX + radius * 0.8, y: centerY, number: 6 });
        // Wings
        dots.push({ x: centerX, y: centerY, number: 7 });
        dots.push({ x: centerX - radius * 0.2, y: centerY - radius * 0.6, number: 8 });
        dots.push({ x: centerX + radius * 0.3, y: centerY, number: 9 });
        dots.push({ x: centerX - radius * 0.2, y: centerY + radius * 0.6, number: 10 });
        dots.push({ x: centerX, y: centerY, number: 11 });
        // Tail
        dots.push({ x: centerX - radius * 0.7, y: centerY, number: 12 });
        dots.push({ x: centerX - radius * 0.9, y: centerY - radius * 0.3, number: 13 });
        dots.push({ x: centerX - radius * 0.7, y: centerY, number: 14 });
        dots.push({ x: centerX - radius * 0.9, y: centerY + radius * 0.3, number: 15 });
        dots.push({ x: centerX - radius * 0.7, y: centerY, number: 16 });
        return dots;
    }

    createCar(centerX, centerY, radius) {
        const dots = [];
        // Body (rectangle)
        dots.push({ x: centerX - radius * 0.8, y: centerY + radius * 0.4, number: 1 });
        dots.push({ x: centerX + radius * 0.8, y: centerY + radius * 0.4, number: 2 });
        dots.push({ x: centerX + radius * 0.8, y: centerY - radius * 0.2, number: 3 });
        dots.push({ x: centerX + radius * 0.4, y: centerY - radius * 0.5, number: 4 });
        dots.push({ x: centerX - radius * 0.4, y: centerY - radius * 0.5, number: 5 });
        dots.push({ x: centerX - radius * 0.8, y: centerY - radius * 0.2, number: 6 });
        dots.push({ x: centerX - radius * 0.8, y: centerY + radius * 0.4, number: 7 });
        // Wheels
        dots.push({ x: centerX - radius * 0.4, y: centerY + radius * 0.4, number: 8 });
        dots.push({ x: centerX + radius * 0.4, y: centerY + radius * 0.4, number: 9 });
        return dots;
    }

    createStar(centerX, centerY, radius) {
        const dots = [];
        const count = 20;
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

    createHeart(centerX, centerY, radius) {
        const dots = [];
        const count = 20;
        for (let i = 0; i < count; i++) {
            const t = (i / count) * Math.PI * 2;
            const x = centerX + 16 * Math.pow(Math.sin(t), 3) * (radius / 50);
            const y = centerY - (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)) * (radius / 50);
            dots.push({ x, y, number: i + 1 });
        }
        return dots;
    }

    createSquare(centerX, centerY, radius) {
        const dots = [];
        const count = 20;
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

    createTriangle(centerX, centerY, radius) {
        const dots = [];
        const count = 18;
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

    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        this.handlePoint(x, y);
    }

    handlePoint(x, y) {
        if (this.completed) return;

        // Larger tolerance for mobile (responsive)
        const isMobile = window.innerWidth <= 768;
        const tolerance = isMobile ? 40 : 25;
        
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

        // Draw dots - larger on mobile
        const isMobile = window.innerWidth <= 768;
        const dotRadius = isMobile ? 18 : 10;
        const connectedRadius = isMobile ? 16 : 8;
        const fontSize = isMobile ? 'bold 20px' : 'bold 14px';
        
        for (let dot of this.dots) {
            const isConnected = this.connectedDots.has(dot.number);
            const isCurrent = dot.number === this.currentNumber;
            
            // Draw circle
            this.ctx.beginPath();
            this.ctx.arc(dot.x, dot.y, isConnected ? connectedRadius : dotRadius, 0, Math.PI * 2);
            this.ctx.fillStyle = isConnected ? '#50c878' : (isCurrent ? '#ffd700' : '#4a90e2');
            this.ctx.fill();
            this.ctx.strokeStyle = 'white';
            this.ctx.lineWidth = isMobile ? 3 : 2;
            this.ctx.stroke();

            // Draw number
            this.ctx.fillStyle = 'white';
            this.ctx.font = fontSize + ' Arial';
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
