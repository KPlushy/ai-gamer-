document.addEventListener('DOMContentLoaded', () => {
    // --- Game State ---
    let currentPoints = 50;
    let pointMultiplier = 1.0;
    let baseMultiplierCost = 100;
    let multipliersPurchased = 0;

    // --- DOM Elements ---
    const screens = document.querySelectorAll('.screen');
    const playButton = document.getElementById('play-button');

    // Main Menu
    const pointsDisplay = document.getElementById('points-display');
    const dynamicPointDisplays = document.querySelectorAll('.points-display-dynamic');
    const slotsNavButton = document.getElementById('slots-nav-button');
    const plinkoNavButton = document.getElementById('plinko-nav-button');
    const shopNavButton = document.getElementById('shop-nav-button');

    // Game Screens
    const spinSlotsButton = document.getElementById('spin-slots-button');
    const slotsResultDisplay = document.getElementById('slots-result');
    const dropPlinkoButton = document.getElementById('drop-plinko-button');
    const plinkoResultDisplay = document.getElementById('plinko-result');

    // Shop Screen
    const currentMultiplierDisplay = document.getElementById('current-multiplier-display');
    const multiplierCostDisplay = document.getElementById('multiplier-cost-display');
    const buyMultiplierButton = document.getElementById('buy-multiplier-button');
    const shopMessageDisplay = document.getElementById('shop-message');

    // Back Buttons
    const backToMenuButtons = document.querySelectorAll('.back-to-menu');

    // --- Helper Functions ---
    function showScreen(screenId) {
        screens.forEach(screen => {
            screen.classList.remove('active');
            if (screen.id === screenId) {
                screen.classList.add('active');
            }
        });
        updateAllPointDisplays(); // Ensure points are fresh on screen change
    }

    function updateAllPointDisplays() {
        pointsDisplay.textContent = currentPoints;
        dynamicPointDisplays.forEach(display => display.textContent = currentPoints);
    }

    function updateShopDisplay() {
        currentMultiplierDisplay.textContent = `x${pointMultiplier.toFixed(1)}`;
        const nextCost = baseMultiplierCost * (1 + multipliersPurchased * 0.75); // Price increases
        multiplierCostDisplay.textContent = `${Math.ceil(nextCost)} Points`;
        buyMultiplierButton.disabled = currentPoints < Math.ceil(nextCost);
    }

    function addPoints(amount) {
        const earned = Math.round(amount * pointMultiplier);
        currentPoints += earned;
        updateAllPointDisplays();
        updateShopDisplay(); // Check if new multiplier can be afforded
        return earned; // Return actual earned points after multiplier
    }

    function spendPoints(amount) {
        if (currentPoints >= amount) {
            currentPoints -= amount;
            updateAllPointDisplays();
            updateShopDisplay();
            return true;
        }
        return false;
    }

    // --- Event Listeners ---

    // Title Screen to Main Menu
    playButton.addEventListener('click', () => {
        showScreen('main-menu-screen');
    });

    // Main Menu Navigation
    slotsNavButton.addEventListener('click', () => showScreen('slots-game-screen'));
    plinkoNavButton.addEventListener('click', () => showScreen('plinko-game-screen'));
    shopNavButton.addEventListener('click', () => {
        showScreen('shop-screen');
        updateShopDisplay(); // Ensure shop is up-to-date when opened
        shopMessageDisplay.textContent = ""; // Clear previous messages
    });

    // Back to Main Menu
    backToMenuButtons.forEach(button => {
        button.addEventListener('click', () => showScreen('main-menu-screen'));
    });

    // --- Game Logic (Placeholders) ---
    spinSlotsButton.addEventListener('click', () => {
        const cost = 5;
        slotsResultDisplay.textContent = "";
        if (spendPoints(cost)) {
            // Simple slots logic: 1 in 5 chance to win big, 2 in 5 to win small, 2 in 5 to lose
            const rand = Math.random();
            let winnings = 0;
            if (rand < 0.2) { // 20% chance win big
                winnings = 20;
                const earned = addPoints(winnings);
                slotsResultDisplay.textContent = `Jackpot! You won ${earned} points!`;
            } else if (rand < 0.6) { // 40% chance win small (0.2 + 0.4)
                winnings = 7;
                const earned = addPoints(winnings);
                slotsResultDisplay.textContent = `Nice! You won ${earned} points.`;
            } else { // 40% chance lose
                slotsResultDisplay.textContent = `Unlucky! No win this time.`;
            }
        } else {
            slotsResultDisplay.textContent = `Not enough points to spin (Cost: ${cost}).`;
        }
    });

    dropPlinkoButton.addEventListener('click', () => {
        const cost = 10;
        plinkoResultDisplay.textContent = "";
        if (spendPoints(cost)) {
            // Simple plinko logic: random win between 0 and 25
            const winnings = Math.floor(Math.random() * 26); // 0 to 25
            if (winnings > 0) {
                const earned = addPoints(winnings);
                plinkoResultDisplay.textContent = `The ball landed! You won ${earned} points!`;
            } else {
                plinkoResultDisplay.textContent = `Oh no! The ball missed all prizes.`;
            }
        } else {
            plinkoResultDisplay.textContent = `Not enough points to drop a ball (Cost: ${cost}).`;
        }
    });

    // --- Shop Logic ---
    buyMultiplierButton.addEventListener('click', () => {
        const currentCost = Math.ceil(baseMultiplierCost * (1 + multipliersPurchased * 0.75));
        shopMessageDisplay.textContent = "";

        if (spendPoints(currentCost)) {
            pointMultiplier += 0.1;
            multipliersPurchased++;
            shopMessageDisplay.textContent = "Multiplier upgraded successfully!";
            updateShopDisplay();
        } else {
            shopMessageDisplay.textContent = "Not enough points for this upgrade.";
        }
    });


    // --- Initial Setup ---
    showScreen('title-screen'); // Start on the title screen
    updateAllPointDisplays();
    // updateShopDisplay(); // Not strictly needed here as shop isn't visible yet
});
