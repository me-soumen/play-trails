document.addEventListener('DOMContentLoaded', () => {
    const gameCards = document.querySelectorAll('.game-card');
    
    gameCards.forEach(card => {
        const playButton = card.querySelector('.btn-play');
        const gameName = card.getAttribute('data-game');
        
        // Make entire card clickable
        card.addEventListener('click', (e) => {
            // Don't trigger if clicking the button directly
            if (e.target !== playButton) {
                navigateToGame(gameName);
            }
        });
        
        // Button click
        playButton.addEventListener('click', (e) => {
            e.stopPropagation();
            navigateToGame(gameName);
        });
    });
});

function navigateToGame(gameName) {
    window.location.href = `${gameName}/index.html`;
}
