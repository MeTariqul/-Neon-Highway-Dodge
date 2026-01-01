// ==================== UI STATE MANAGEMENT ====================
// UI state management functions for the game

// Set game state and handle screen visibility
function setGameState(gameState, newState, mainMenu, startScreen, gameOverScreen, pauseScreen, controlsScreen, settingsScreen, creditsScreen, highScoresScreen, CONFIG) {
    gameState.state = newState;
    
    // Hide all screens first
    mainMenu.classList.add('hidden');
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    pauseScreen.classList.add('hidden');
    controlsScreen.classList.add('hidden');
    settingsScreen.classList.add('hidden');
    creditsScreen.classList.add('hidden');
    highScoresScreen.classList.add('hidden');
    
    // Show appropriate screen based on state
    switch (newState) {
        case CONFIG.GAME_STATES.MENU:
            mainMenu.classList.remove('hidden');
            break;
        case CONFIG.GAME_STATES.PLAYING:
            // No screen overlay needed when playing
            break;
        case CONFIG.GAME_STATES.PAUSED:
            pauseScreen.classList.remove('hidden');
            break;
        case CONFIG.GAME_STATES.GAME_OVER:
            // Special handling for game over - it might show high scores
            // The game over screen will be managed in endGame() function
            break;
        default:
            // Default to main menu
            mainMenu.classList.remove('hidden');
    }
}

// Show high scores screen
function showHighScoresScreen(mainMenu, highScoresScreen, newHighScoreDiv, highScoresTableBody, CONFIG) {
    // Temporarily hide all screens and show high scores
    mainMenu.classList.add('hidden');
    highScoresScreen.classList.remove('hidden');
    
    // Hide the new high score form by default
    newHighScoreDiv.classList.add('hidden');
    
    // Display current high scores
    displayHighScores(highScoresTableBody);
}

// Display high scores
function displayHighScores(highScoresTableBody) {
    const highScores = getHighScores();
    
    // Clear the table
    highScoresTableBody.innerHTML = '';
    
    if (highScores.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="3">No high scores yet</td>';
        highScoresTableBody.appendChild(row);
        return;
    }
    
    // Add each score to the table
    highScores.forEach((entry, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.name}</td>
            <td>${entry.score}</td>
        `;
        highScoresTableBody.appendChild(row);
    });
}

// Get high scores from localStorage
function getHighScores(CONFIG) {
    const scoresJSON = localStorage.getItem(CONFIG.HIGH_SCORES_KEY);
    if (scoresJSON) {
        return JSON.parse(scoresJSON);
    }
    // Return default high scores if none exist
    return [
        { name: 'AAA', score: 100 },
        { name: 'BBB', score: 50 },
        { name: 'CCC', score: 10 }
    ];
}

// Save high scores to localStorage
function saveHighScores(scores, CONFIG) {
    localStorage.setItem(CONFIG.HIGH_SCORES_KEY, JSON.stringify(scores));
}

// Check if score is a high score
function isHighScore(score, CONFIG) {
    const highScores = getHighScores(CONFIG);
    if (highScores.length < CONFIG.MAX_HIGH_SCORES) {
        return true;
    }
    return score > highScores[highScores.length - 1].score;
}

// Add score to high scores list
function addHighScore(name, score, CONFIG) {
    const highScores = getHighScores(CONFIG);
    highScores.push({ name: name || 'Anonymous', score: score });
    
    // Sort scores in descending order
    highScores.sort((a, b) => b.score - a.score);
    
    // Keep only top 3 scores
    const topScores = highScores.slice(0, CONFIG.MAX_HIGH_SCORES);
    
    saveHighScores(topScores, CONFIG);
    
    return topScores;
}

// Save high score from input
function saveHighScore(playerNameInput, newHighScoreDiv, gameState, CONFIG) {
    const name = playerNameInput.value.trim() || 'Anonymous';
    const score = gameState.score;
    
    // Add to high scores
    addHighScore(name, score, CONFIG);
    
    // Update display
    displayHighScores(document.getElementById('highScoresTableBody'));
    
    // Hide the new high score form
    newHighScoreDiv.classList.add('hidden');
    
    // Clear input
    playerNameInput.value = '';
}

// Update score display
function updateScore(scoreElement, gameState) {
    scoreElement.textContent = `Score: ${gameState.score}`;
}

// Update lives display
function updateLives(livesElement, gameState) {
    livesElement.textContent = `Lives: ${gameState.lives}`;
}

// Update level display
function updateLevel(levelElement, gameState) {
    levelElement.textContent = `Level: ${gameState.level}`;
}

// Menu functions
function showMainMenu(setGameState, CONFIG) {
    setGameState(CONFIG.GAME_STATES.MENU);
}

function showStartScreen(mainMenu, startScreen, gameOverScreen, pauseScreen, controlsScreen, settingsScreen, creditsScreen) {
    mainMenu.classList.add('hidden');
    startScreen.classList.remove('hidden');
    gameOverScreen.classList.add('hidden');
    pauseScreen.classList.add('hidden');
    controlsScreen.classList.add('hidden');
    settingsScreen.classList.add('hidden');
    creditsScreen.classList.add('hidden');
}

function showControlsScreen(mainMenu, controlsScreen) {
    mainMenu.classList.add('hidden');
    controlsScreen.classList.remove('hidden');
}

function showSettingsScreen(mainMenu, settingsScreen) {
    mainMenu.classList.add('hidden');
    settingsScreen.classList.remove('hidden');
}

function showCreditsScreen(mainMenu, creditsScreen) {
    mainMenu.classList.add('hidden');
    creditsScreen.classList.remove('hidden');
}

function goToMainMenu(setGameState, CONFIG) {
    setGameState(CONFIG.GAME_STATES.MENU);
}

// Export UI functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        setGameState, 
        showHighScoresScreen, 
        displayHighScores, 
        getHighScores, 
        saveHighScores, 
        isHighScore, 
        addHighScore, 
        saveHighScore,
        updateScore,
        updateLives,
        updateLevel,
        showMainMenu,
        showStartScreen,
        showControlsScreen,
        showSettingsScreen,
        showCreditsScreen,
        goToMainMenu
    };
} else {
    window.UI = { 
        setGameState, 
        showHighScoresScreen, 
        displayHighScores, 
        getHighScores, 
        saveHighScores, 
        isHighScore, 
        addHighScore, 
        saveHighScore,
        updateScore,
        updateLives,
        updateLevel,
        showMainMenu,
        showStartScreen,
        showControlsScreen,
        showSettingsScreen,
        showCreditsScreen,
        goToMainMenu
    };
}