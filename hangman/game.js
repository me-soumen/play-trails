class HangmanGame {
    constructor() {
        this.word = '';
        this.wordDisplay = [];
        this.guessedLetters = new Set();
        this.lives = 6;
        this.category = 'random';
        this.currentCategory = '';
        this.gameComplete = false;

        this.words = {
            animals: [
                { word: 'TIGER', hint: 'Striped big cat' },
                { word: 'LION', hint: 'King of the jungle' },
                { word: 'EAGLE', hint: 'Majestic bird of prey' },
                { word: 'SHARK', hint: 'Ocean predator' },
                { word: 'BEAR', hint: 'Large forest animal' },
                { word: 'WOLF', hint: 'Pack hunting canine' },
                { word: 'FOX', hint: 'Cunning red animal' },
                { word: 'DEER', hint: 'Graceful forest animal' },
                { word: 'PANDA', hint: 'Black and white bear' },
                { word: 'KOALA', hint: 'Australian tree bear' },
                { word: 'ZEBRA', hint: 'Striped African horse' },
                { word: 'PANTHER', hint: 'Black big cat' },
                { word: 'RABBIT', hint: 'Hopping long-eared animal' },
                { word: 'TURTLE', hint: 'Shelled reptile' },
                { word: 'MONKEY', hint: 'Tree-swinging primate' },
                { word: 'SNAKE', hint: 'Slithering reptile' },
                { word: 'FROG', hint: 'Jumping amphibian' },
                { word: 'DUCK', hint: 'Quacking water bird' },
                { word: 'OTTER', hint: 'Playful water mammal' },
                { word: 'OWL', hint: 'Wise night bird' }
            ],
            countries: [
                { word: 'JAPAN', hint: 'Land of the rising sun' },
                { word: 'CHINA', hint: 'Most populous country' },
                { word: 'INDIA', hint: 'Taj Mahal country' },
                { word: 'EGYPT', hint: 'Pyramids and pharaohs' },
                { word: 'SPAIN', hint: 'Flamenco and bullfighting' },
                { word: 'ITALY', hint: 'Pizza and pasta' },
                { word: 'FRANCE', hint: 'Eiffel Tower country' },
                { word: 'GERMANY', hint: 'Oktoberfest country' },
                { word: 'BRAZIL', hint: 'Samba and football' },
                { word: 'CANADA', hint: 'Maple leaf country' },
                { word: 'MEXICO', hint: 'Taco and mariachi' },
                { word: 'GREECE', hint: 'Ancient civilization' },
                { word: 'TURKEY', hint: 'Bridge between continents' },
                { word: 'POLAND', hint: 'Central European country' },
                { word: 'SWEDEN', hint: 'Northern European country' },
                { word: 'NORWAY', hint: 'Land of fjords' },
                { word: 'DENMARK', hint: 'Happiest country' },
                { word: 'FINLAND', hint: 'Land of lakes' },
                { word: 'IRELAND', hint: 'Emerald Isle' },
                { word: 'PORTUGAL', hint: 'Western European country' }
            ],
            fruits: [
                { word: 'APPLE', hint: 'Red or green fruit' },
                { word: 'BANANA', hint: 'Yellow curved fruit' },
                { word: 'ORANGE', hint: 'Citrus fruit, also a color' },
                { word: 'MANGO', hint: 'King of fruits' },
                { word: 'GRAPES', hint: 'Wine making fruit' },
                { word: 'CHERRY', hint: 'Small red fruit' },
                { word: 'PEACH', hint: 'Fuzzy stone fruit' },
                { word: 'PEAR', hint: 'Bell-shaped fruit' },
                { word: 'LEMON', hint: 'Sour yellow citrus' },
                { word: 'KIWI', hint: 'Fuzzy brown fruit' },
                { word: 'MELON', hint: 'Large juicy fruit' },
                { word: 'BERRY', hint: 'Small sweet fruit' },
                { word: 'PAPAYA', hint: 'Tropical orange fruit' },
                { word: 'PLUM', hint: 'Purple stone fruit' },
                { word: 'DATES', hint: 'Sweet Middle Eastern fruit' },
                { word: 'FIG', hint: 'Sweet Mediterranean fruit' },
                { word: 'LYCHEE', hint: 'Asian white fruit' },
                { word: 'GUAVA', hint: 'Tropical green fruit' },
                { word: 'APRICOT', hint: 'Orange stone fruit' },
                { word: 'AVOCADO', hint: 'Green creamy fruit' }
            ],
            sports: [
                { word: 'SOCCER', hint: 'World Cup sport' },
                { word: 'TENNIS', hint: 'Wimbledon sport' },
                { word: 'SWIMMING', hint: 'Pool or ocean' },
                { word: 'RUNNING', hint: 'Fastest human movement' },
                { word: 'CYCLING', hint: 'Two-wheeled sport' },
                { word: 'BOXING', hint: 'Punching sport' },
                { word: 'JUDO', hint: 'Japanese martial art' },
                { word: 'KARATE', hint: 'Martial art sport' },
                { word: 'HOCKEY', hint: 'Stick and puck sport' },
                { word: 'GOLF', hint: 'Club and ball sport' },
                { word: 'SKIING', hint: 'Snow sliding sport' },
                { word: 'SURFING', hint: 'Wave riding sport' },
                { word: 'ROWING', hint: 'Boat paddling sport' },
                { word: 'ARCHERY', hint: 'Bow and arrow sport' },
                { word: 'FENCING', hint: 'Sword fighting sport' },
                { word: 'RUGBY', hint: 'Rugged team sport' },
                { word: 'VOLLEYBALL', hint: 'Net and ball' },
                { word: 'BADMINTON', hint: 'Shuttlecock sport' },
                { word: 'BASEBALL', hint: 'American pastime' },
                { word: 'CRICKET', hint: 'Popular in India' }
            ],
            objects: [
                { word: 'TABLE', hint: 'Furniture with flat top' },
                { word: 'CHAIR', hint: 'Sitting furniture' },
                { word: 'PHONE', hint: 'Communication device' },
                { word: 'BOOK', hint: 'Reading material' },
                { word: 'CLOCK', hint: 'Time telling device' },
                { word: 'LIGHT', hint: 'Brightness source' },
                { word: 'MIRROR', hint: 'Reflective surface' },
                { word: 'WINDOW', hint: 'Glass opening' },
                { word: 'DOOR', hint: 'Entryway' },
                { word: 'CUP', hint: 'Drinking container' },
                { word: 'PLATE', hint: 'Dining surface' },
                { word: 'BOTTLE', hint: 'Liquid container' },
                { word: 'PEN', hint: 'Writing tool' },
                { word: 'PAPER', hint: 'Writing surface' },
                { word: 'BAG', hint: 'Carrying container' },
                { word: 'SHOE', hint: 'Footwear' },
                { word: 'HAT', hint: 'Head covering' },
                { word: 'GLOVE', hint: 'Hand covering' },
                { word: 'BRUSH', hint: 'Hair tool' },
                { word: 'TOWEL', hint: 'Drying cloth' }
            ],
            colors: [
                { word: 'BLUE', hint: 'Sky color' },
                { word: 'GREEN', hint: 'Grass color' },
                { word: 'RED', hint: 'Rose color' },
                { word: 'YELLOW', hint: 'Sun color' },
                { word: 'ORANGE', hint: 'Pumpkin color' },
                { word: 'PURPLE', hint: 'Grape color' },
                { word: 'PINK', hint: 'Flower color' },
                { word: 'BROWN', hint: 'Earth color' },
                { word: 'BLACK', hint: 'Night color' },
                { word: 'WHITE', hint: 'Snow color' },
                { word: 'GRAY', hint: 'Cloud color' },
                { word: 'SILVER', hint: 'Metal color' },
                { word: 'GOLD', hint: 'Treasure color' },
                { word: 'CYAN', hint: 'Ocean color' },
                { word: 'LIME', hint: 'Citrus color' },
                { word: 'IVORY', hint: 'Elephant tusk color' },
                { word: 'BEIGE', hint: 'Sand color' },
                { word: 'OLIVE', hint: 'Olive color' },
                { word: 'NAVY', hint: 'Deep blue color' },
                { word: 'MAROON', hint: 'Dark red color' }
            ],
            actions: [
                { word: 'WALK', hint: 'Move on feet' },
                { word: 'RUN', hint: 'Move fast' },
                { word: 'JUMP', hint: 'Leap upward' },
                { word: 'SLEEP', hint: 'Rest at night' },
                { word: 'EAT', hint: 'Consume food' },
                { word: 'DRINK', hint: 'Consume liquid' },
                { word: 'READ', hint: 'Look at words' },
                { word: 'WRITE', hint: 'Create words' },
                { word: 'DANCE', hint: 'Move to music' },
                { word: 'SING', hint: 'Make music' },
                { word: 'TALK', hint: 'Speak words' },
                { word: 'LISTEN', hint: 'Hear sounds' },
                { word: 'WATCH', hint: 'Look at' },
                { word: 'PLAY', hint: 'Have fun' },
                { word: 'WORK', hint: 'Do job' },
                { word: 'STUDY', hint: 'Learn' },
                { word: 'COOK', hint: 'Make food' },
                { word: 'CLEAN', hint: 'Make tidy' },
                { word: 'WASH', hint: 'Clean with water' },
                { word: 'DRAW', hint: 'Create art' }
            ],
            nature: [
                { word: 'TREE', hint: 'Tall plant' },
                { word: 'FLOWER', hint: 'Blooming plant' },
                { word: 'GRASS', hint: 'Green ground cover' },
                { word: 'LEAF', hint: 'Tree part' },
                { word: 'ROCK', hint: 'Hard stone' },
                { word: 'SAND', hint: 'Beach material' },
                { word: 'WATER', hint: 'Liquid' },
                { word: 'FIRE', hint: 'Flame' },
                { word: 'WIND', hint: 'Moving air' },
                { word: 'RAIN', hint: 'Water from sky' },
                { word: 'SNOW', hint: 'Frozen water' },
                { word: 'CLOUD', hint: 'Sky feature' },
                { word: 'SUN', hint: 'Daylight star' },
                { word: 'MOON', hint: 'Night light' },
                { word: 'STAR', hint: 'Twinkle in sky' },
                { word: 'OCEAN', hint: 'Large water body' },
                { word: 'MOUNTAIN', hint: 'Tall landform' },
                { word: 'RIVER', hint: 'Flowing water' },
                { word: 'LAKE', hint: 'Still water' },
                { word: 'FOREST', hint: 'Many trees' }
            ],
            random: []
        };

        // Combine all categories for random
        this.words.random = [
            ...this.words.animals,
            ...this.words.countries,
            ...this.words.fruits,
            ...this.words.sports,
            ...this.words.objects,
            ...this.words.colors,
            ...this.words.actions,
            ...this.words.nature
        ];

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.newGame();
    }

    setupEventListeners() {
        document.getElementById('newGame').addEventListener('click', () => this.newGame());
        document.getElementById('categoryBtn').addEventListener('click', () => this.toggleCategory());
        document.getElementById('modalButton').addEventListener('click', () => {
            this.closeModal();
            this.newGame();
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (this.gameComplete) return;
            const key = e.key.toUpperCase();
            if (key.length === 1 && key >= 'A' && key <= 'Z') {
                this.guessLetter(key);
            }
        });
    }

    toggleCategory() {
        const categories = ['random', 'animals', 'countries', 'fruits', 'sports', 'objects', 'colors', 'actions', 'nature'];
        const currentIndex = categories.indexOf(this.category);
        const nextIndex = (currentIndex + 1) % categories.length;
        this.category = categories[nextIndex];
        document.getElementById('categoryBtn').textContent = 
            this.category.charAt(0).toUpperCase() + this.category.slice(1);
        this.newGame();
    }

    newGame() {
        this.guessedLetters = new Set();
        this.lives = 6;
        this.gameComplete = false;
        
        const wordList = this.words[this.category];
        const selected = wordList[Math.floor(Math.random() * wordList.length)];
        this.word = selected.word;
        this.wordDisplay = Array(this.word.length).fill('_');
        this.currentCategory = this.category;
        
        document.getElementById('hintText').textContent = selected.hint;
        document.getElementById('category').textContent = 
            this.category.charAt(0).toUpperCase() + this.category.slice(1);
        
        this.renderWord();
        this.renderKeyboard();
        this.updateStats();
        this.updateHangman();
        this.closeModal();
        
        const statusElement = document.getElementById('gameStatus');
        statusElement.textContent = '';
        statusElement.className = 'game-status';
    }

    renderWord() {
        const wordDisplayElement = document.getElementById('wordDisplay');
        wordDisplayElement.innerHTML = '';
        
        this.word.split('').forEach((letter, index) => {
            const letterElement = document.createElement('div');
            letterElement.className = 'word-letter';
            letterElement.textContent = this.wordDisplay[index];
            
            if (this.wordDisplay[index] !== '_') {
                letterElement.classList.add('revealed');
            }
            
            wordDisplayElement.appendChild(letterElement);
        });
    }

    renderKeyboard() {
        const keyboardElement = document.getElementById('keyboard');
        keyboardElement.innerHTML = '';
        
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        alphabet.split('').forEach(letter => {
            const keyBtn = document.createElement('button');
            keyBtn.className = 'key-btn';
            keyBtn.textContent = letter;
            keyBtn.setAttribute('data-letter', letter);
            
            if (this.guessedLetters.has(letter)) {
                const isInWord = this.word.includes(letter);
                keyBtn.classList.add('used');
                keyBtn.classList.add(isInWord ? 'correct' : 'wrong');
            }
            
            keyBtn.addEventListener('click', () => this.guessLetter(letter));
            keyboardElement.appendChild(keyBtn);
        });
    }

    guessLetter(letter) {
        if (this.gameComplete || this.guessedLetters.has(letter)) return;
        
        this.guessedLetters.add(letter);
        
        if (this.word.includes(letter)) {
            // Correct guess
            for (let i = 0; i < this.word.length; i++) {
                if (this.word[i] === letter) {
                    this.wordDisplay[i] = letter;
                }
            }
            
            if (!this.wordDisplay.includes('_')) {
                this.completeGame(true);
            }
        } else {
            // Wrong guess
            this.lives--;
            if (this.lives <= 0) {
                this.completeGame(false);
            }
        }
        
        this.renderWord();
        this.renderKeyboard();
        this.updateStats();
        this.updateHangman();
    }

    updateHangman() {
        const parts = ['head', 'body', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg'];
        const mistakes = 6 - this.lives;
        
        parts.forEach((part, index) => {
            const element = document.getElementById(part);
            if (element) {
                if (index < mistakes) {
                    element.classList.add('visible');
                } else {
                    element.classList.remove('visible');
                }
            }
        });
    }

    updateStats() {
        document.getElementById('lives').textContent = this.lives;
    }

    completeGame(won) {
        this.gameComplete = true;
        const statusElement = document.getElementById('gameStatus');
        
        if (won) {
            statusElement.textContent = '🎉 Congratulations! You guessed the word!';
            statusElement.className = 'game-status success';
        } else {
            statusElement.textContent = 'Game Over! The word was: ' + this.word;
            statusElement.className = 'game-status error';
        }
        
        setTimeout(() => {
            this.showModal(won);
        }, 1500);
    }

    showModal(won) {
        document.getElementById('modalTitle').textContent = won ? '🎉 You Won!' : '💀 Game Over';
        document.getElementById('modalMessage').textContent = won 
            ? 'Great job guessing the word!' 
            : 'Better luck next time!';
        document.getElementById('modalWord').textContent = this.word;
        document.getElementById('gameModal').classList.add('show');
    }

    closeModal() {
        document.getElementById('gameModal').classList.remove('show');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new HangmanGame();
});
