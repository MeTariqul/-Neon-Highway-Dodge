// ==================== GAME CONFIGURATION ====================
// Import configuration from config module
const { GAME_WIDTH, GAME_HEIGHT, PLAYER_SIZE, PLAYER_SPEED, OBSTACLE_MIN_SIZE, 
        OBSTACLE_MAX_SIZE, OBSTACLE_MIN_SPEED, OBSTACLE_MAX_SPEED, STAR_SIZE,
        PLAYER_LIVES, STAR_BASE_SPAWN_RATE_MS, OBSTACLE_BASE_SPAWN_RATE_MS, 
        LEVEL_SECONDS, COLLISION_COOLDOWN_MS, PLAYER_DETAIL_OFFSET, PLAYER_DETAIL_WIDTH,
        GAME_STATES } = CONFIG;

// Game state
const gameState = {
    state: GAME_STATES.MENU, // Current game state
    score: 0,
    startTime: 0, // Timestamp when the game started
    lives: CONFIG.PLAYER_LIVES,
    player: {
        x: GAME_WIDTH / 2 - PLAYER_SIZE / 2,
        y: GAME_HEIGHT - PLAYER_SIZE - 20,
        width: PLAYER_SIZE,
        height: PLAYER_SIZE,
        speed: PLAYER_SPEED
    },
    obstacles: [],
    stars: [],
    lastObstacleTime: 0,
    lastCoinTime: 0,
    obstacleSpawnRate: CONFIG.OBSTACLE_BASE_SPAWN_RATE_MS, // milliseconds
    coinSpawnRate: CONFIG.COIN_BASE_SPAWN_RATE_MS, // milliseconds
    level: 1,
    lastCollisionTime: 0 // To prevent multiple collisions in quick succession
};

// ==================== STATE MANAGEMENT ====================
// Set game state and handle screen visibility
function setGameState(newState) {
    UI.setGameState(gameState, newState, mainMenu, startScreen, gameOverScreen, pauseScreen, controlsScreen, settingsScreen, creditsScreen, highScoresScreen, CONFIG);
}

// ==================== CANVAS AND DOM SETUP ====================
// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const levelElement = document.getElementById('level');
const gameStateElement = document.getElementById('gameState');
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const pauseScreen = document.getElementById('pauseScreen');
const finalScoreElement = document.getElementById('finalScore');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const resumeButton = document.getElementById('resumeButton');
const playButton = document.getElementById('playButton');
const menuButton = document.getElementById('menuButton');
const controlsButton = document.getElementById('controlsButton');
const settingsButton = document.getElementById('settingsButton');
const creditsButton = document.getElementById('creditsButton');
const highScoresButton = document.getElementById('highScoresButton');
const controlsScreen = document.getElementById('controlsScreen');
const settingsScreen = document.getElementById('settingsScreen');
const creditsScreen = document.getElementById('creditsScreen');
const highScoresScreen = document.getElementById('highScoresScreen');
const highScoresTableBody = document.getElementById('highScoresTableBody');
const newHighScoreDiv = document.getElementById('newHighScore');
const playerNameInput = document.getElementById('playerNameInput');
const saveScoreButton = document.getElementById('saveScoreButton');
const backFromHighScores = document.getElementById('backFromHighScores');
const backFromControls = document.getElementById('backFromControls');
const backFromSettings = document.getElementById('backFromSettings');
const backFromCredits = document.getElementById('backFromCredits');
const soundToggle = document.getElementById('soundToggle');
const mainMenu = document.getElementById('mainMenu');

// Input handling
const keys = {};

// ==================== HIGH SCORE SYSTEM ====================
// Import high score constants from config
const { HIGH_SCORES_KEY, MAX_HIGH_SCORES } = CONFIG;

// Get high scores from localStorage
function getHighScores() {
    return UI.getHighScores(CONFIG);
}

// Save high scores to localStorage
function saveHighScores(scores) {
    UI.saveHighScores(scores, CONFIG);
}

// Check if score is a high score
function isHighScore(score) {
    return UI.isHighScore(score, CONFIG);
}

// Add score to high scores list
function addHighScore(name, score) {
    return UI.addHighScore(name, score, CONFIG);
}

// Display high scores
function displayHighScores() {
    UI.displayHighScores(highScoresTableBody);
}

// Show high scores screen
function showHighScoresScreen() {
    UI.showHighScoresScreen(mainMenu, highScoresScreen, newHighScoreDiv, highScoresTableBody, CONFIG);
}

// Save high score from input
function saveHighScore() {
    UI.saveHighScore(playerNameInput, newHighScoreDiv, gameState, CONFIG);
}

// Initialize UI elements and event listeners
function initUI() {
    // Event listeners
    window.addEventListener('keydown', (e) => {
        const action = Input.handleKeyDown(e, keys, gameState, CONFIG);
        
        if (action === 'PAUSE') {
            pauseGame();
        } else if (action === 'RESUME') {
            resumeGame();
        }
    });
    
    window.addEventListener('keyup', (e) => {
        Input.handleKeyUp(e, keys);
    });
    
    // Main menu buttons
    startButton.addEventListener('click', showStartScreen);
    playButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', restartGame);
    resumeButton.addEventListener('click', resumeGame);
    menuButton.addEventListener('click', goToMainMenu);
    
    // Menu navigation buttons
    controlsButton.addEventListener('click', showControlsScreen);
    settingsButton.addEventListener('click', showSettingsScreen);
    creditsButton.addEventListener('click', showCreditsScreen);
    highScoresButton.addEventListener('click', showHighScoresScreen);
    backFromControls.addEventListener('click', showMainMenu);
    backFromSettings.addEventListener('click', showMainMenu);
    backFromCredits.addEventListener('click', showMainMenu);
    backFromHighScores.addEventListener('click', showMainMenu);
    
    // Sound toggle
    soundToggle.addEventListener('change', toggleSound);
    
    // High scores functionality
    saveScoreButton.addEventListener('click', saveHighScore);
    
    // Touch/mouse controls for mobile
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('mousemove', handleMouseMove);
}

// Helper function to resize canvas to display size
function resizeCanvasToDisplaySize(canvas, CONFIG) {
    // Get the display size from canvas.getBoundingClientRect()
    const rect = canvas.getBoundingClientRect();
    const displayWidth = rect.width;
    const displayHeight = rect.height;
    
    // Check if the canvas needs to be resized
    const needsResize = canvas.width !== displayWidth || canvas.height !== displayHeight;
    
    if (needsResize) {
        // Set the canvas size to the display size multiplied by device pixel ratio
        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.floor(displayWidth * dpr);
        canvas.height = Math.floor(displayHeight * dpr);
        
        // Calculate scale factors to map logical coordinates to actual pixels
        const scaleX = canvas.width / CONFIG.GAME_WIDTH;
        const scaleY = canvas.height / CONFIG.GAME_HEIGHT;
        
        // Set the transform to scale drawing operations appropriately
        // This allows us to continue drawing using logical coordinates
        ctx.setTransform(scaleX, 0, 0, scaleY, 0, 0);
    }
    
    return needsResize;
}

// Initialize game
function init() {
    // Initialize UI elements
    initUI();
    
    // Resize canvas on initial load
    resizeCanvasToDisplaySize(canvas, CONFIG);
    
    // Add resize event listener
    window.addEventListener('resize', () => {
        resizeCanvasToDisplaySize(canvas, CONFIG);
    });
    
    // Start the game loop
    requestAnimationFrame(gameLoop);
}

// Clamp player position within road bounds
function clampPlayerPosition(gameState, CONFIG) {
    // Road boundaries (leaving 50px margin on each side for grass)
    const roadLeft = 50;
    const roadRight = CONFIG.GAME_WIDTH - 50;
    
    if (gameState.player.x < roadLeft) {
        gameState.player.x = roadLeft;
    } else if (gameState.player.x + gameState.player.width > roadRight) {
        gameState.player.x = roadRight - gameState.player.width;
    }
}

// Handle touch movement for mobile
function handleTouchMove(e) {
    Input.handleTouchMove(e, canvas, gameState, CONFIG);
    
    // Clamp player position within canvas bounds
    clampPlayerPosition(gameState, CONFIG);
}

// Handle mouse movement for desktop
function handleMouseMove(e) {
    Input.handleMouseMove(e, canvas, gameState);
    
    // Clamp player position within canvas bounds
    clampPlayerPosition(gameState, CONFIG);
}

// Start the game
function startGame() {
    setGameState(GAME_STATES.PLAYING);
    gameState.score = 0;
    gameState.startTime = Date.now();
    gameState.lives = CONFIG.PLAYER_LIVES;
    gameState.level = 1;
    gameState.obstacles = [];
    gameState.coins = [];
    gameState.player.x = CONFIG.GAME_WIDTH / 2 - CONFIG.PLAYER_SIZE / 2;
    gameState.obstacleSpawnRate = CONFIG.OBSTACLE_BASE_SPAWN_RATE_MS;
    gameState.coinSpawnRate = CONFIG.COIN_BASE_SPAWN_RATE_MS;
    
    updateScore();
    updateLives();
    updateLevel();
    
    // Start background music if sound is enabled
    if (soundToggle.checked) {
        const backgroundMusic = document.getElementById('backgroundMusic');
        backgroundMusic.currentTime = 0;
        backgroundMusic.play().catch(e => console.log('Music play error:', e));
    }
}

// Restart the game
function restartGame() {
    setGameState(GAME_STATES.PLAYING);
    gameState.score = 0;
    gameState.startTime = Date.now();
    gameState.lives = CONFIG.PLAYER_LIVES;
    gameState.level = 1;
    gameState.obstacles = [];
    gameState.coins = [];
    gameState.player.x = CONFIG.GAME_WIDTH / 2 - CONFIG.PLAYER_SIZE / 2;
    gameState.obstacleSpawnRate = CONFIG.OBSTACLE_BASE_SPAWN_RATE_MS;
    gameState.coinSpawnRate = CONFIG.COIN_BASE_SPAWN_RATE_MS;
    
    newHighScoreDiv.classList.add('hidden');
    
    updateScore();
    updateLives();
    updateLevel();
    
    // Start background music if sound is enabled
    if (soundToggle.checked) {
        const backgroundMusic = document.getElementById('backgroundMusic');
        backgroundMusic.currentTime = 0;
        backgroundMusic.play().catch(e => console.log('Music play error:', e));
    }
}

// Pause the game
function pauseGame() {
    setGameState(GAME_STATES.PAUSED);
    gameStateElement.textContent = 'PAUSED';
    
    // Pause background music
    const backgroundMusic = document.getElementById('backgroundMusic');
    backgroundMusic.pause();
}

// Resume the game
function resumeGame() {
    setGameState(GAME_STATES.PLAYING);
    gameStateElement.textContent = '';
    
    // Resume background music if sound is enabled
    if (soundToggle.checked) {
        const backgroundMusic = document.getElementById('backgroundMusic');
        backgroundMusic.play().catch(e => console.log('Music play error:', e));
    }
}

// ==================== GAME LOOP AND UPDATE FUNCTIONS ====================
// Main game loop
function gameLoop(timestamp) {
    // Ensure canvas is the right size for the current display
    resizeCanvasToDisplaySize(canvas, CONFIG);
    
    if (gameState.state === GAME_STATES.PLAYING) {
        updateGame(timestamp);
    }
    render();
    requestAnimationFrame(gameLoop);
}

// Update game state
function updateGame(timestamp) {
    // Update score (1 point per second since game started)
    const elapsedSeconds = Math.floor((Date.now() - gameState.startTime) / 1000);
    gameState.score = elapsedSeconds;
    updateScore();
    
    // Handle player movement with keyboard
    Input.processKeyboardInput(keys, gameState, CONFIG, clampPlayerPosition);
    
    // Spawn obstacles
    if (timestamp - gameState.lastObstacleTime > gameState.obstacleSpawnRate) {
        spawnObstacle();
        gameState.lastObstacleTime = timestamp;
    }
    
    // Spawn coins
    if (timestamp - gameState.lastCoinTime > gameState.coinSpawnRate) {
        spawnCoin();
        gameState.lastCoinTime = timestamp;
    }
    
    // Update obstacles
    for (let i = gameState.obstacles.length - 1; i >= 0; i--) {
        const obstacle = gameState.obstacles[i];
        obstacle.y += obstacle.speed;
        
        // Remove obstacles that go off screen
        if (obstacle.y > GAME_HEIGHT) {
            gameState.obstacles.splice(i, 1);
        }
    }
    
    // Update coins
    for (let i = gameState.coins.length - 1; i >= 0; i--) {
        const coin = gameState.coins[i];
        coin.y += coin.speed;
        
        // Remove coins that go off screen
        if (coin.y > GAME_HEIGHT) {
            gameState.coins.splice(i, 1);
        }
    }
    
    // Check collisions
    checkCollisions();
    
    // Increase difficulty over time
    updateDifficulty(timestamp);
}

// Spawn a new obstacle
function spawnObstacle() {
    const size = Math.random() * (CONFIG.OBSTACLE_MAX_SIZE - CONFIG.OBSTACLE_MIN_SIZE) + CONFIG.OBSTACLE_MIN_SIZE;
    const speed = Math.random() * (CONFIG.OBSTACLE_MAX_SPEED - CONFIG.OBSTACLE_MIN_SPEED) + CONFIG.OBSTACLE_MIN_SPEED + (gameState.level * 0.2);
    
    gameState.obstacles.push({
        x: Math.random() * (GAME_WIDTH - size),
        y: -size,
        width: size,
        height: size,
        speed: speed
    });
}

// Spawn a new coin
function spawnCoin() {
    gameState.coins.push({
        x: Math.random() * (GAME_WIDTH - CONFIG.COIN_SIZE),
        y: -CONFIG.COIN_SIZE,
        width: CONFIG.COIN_SIZE,
        height: CONFIG.COIN_SIZE,
        speed: 3 + (gameState.level * 0.1)
    });
}

// Check for collisions
function checkCollisions() {
    const currentTime = Date.now();
    
    // Check player-obstacle collisions
    for (let i = 0; i < gameState.obstacles.length; i++) {
        const obstacle = gameState.obstacles[i];
        if (isColliding(gameState.player, obstacle) && (currentTime - gameState.lastCollisionTime) > CONFIG.COLLISION_COOLDOWN_MS) { // 1 second cooldown
            // Lose a life
            gameState.lives--;
            updateLives();
            
            // Play collision sound
            playCollisionSound();
            
            // Visual feedback for collision
            gameState.lastCollisionTime = currentTime;
            
            // Check if game over
            if (gameState.lives <= 0) {
                endGame();
                return; // Exit early if game over
            }
            
            // Remove the obstacle
            gameState.obstacles.splice(i, 1);
            break; // Only handle one collision per frame
        }
    }
    
    // Check player-coin collisions
    for (let i = gameState.coins.length - 1; i >= 0; i--) {
        const coin = gameState.coins[i];
        if (isColliding(gameState.player, coin)) {
            // Add points for collecting coin
            gameState.score += 20;
            updateScore();
            
            // Play coin collection sound
            playStarSound();
            
            gameState.coins.splice(i, 1);
        }
    }
}

// Simple collision detection
function isColliding(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Update difficulty based on time
function updateDifficulty(timestamp) {
    const elapsedSeconds = Math.floor((Date.now() - gameState.startTime) / 1000);
    const newLevel = Math.floor(elapsedSeconds / CONFIG.LEVEL_SECONDS) + 1;
    
    if (newLevel > gameState.level) {
        gameState.level = newLevel;
        
        // Update spawn rates based on level
        updateSpawnRates();
        
        // Update level display
        updateLevel();
        
        // Play level up sound
        playLevelUpSound();
    }
}

// Update spawn rates based on current level
function updateSpawnRates() {
    // Increase obstacle spawn rate as level increases (faster spawning)
    gameState.obstacleSpawnRate = Math.max(300, CONFIG.OBSTACLE_BASE_SPAWN_RATE_MS - (gameState.level * 50));
}

// Update score display
function updateScore() {
    UI.updateScore(scoreElement, gameState);
}

// Update lives display
function updateLives() {
    UI.updateLives(livesElement, gameState);
}

// Update level display
function updateLevel() {
    UI.updateLevel(levelElement, gameState);
}

// End the game
function endGame() {
    gameState.state = GAME_STATES.GAME_OVER; // We set this directly to avoid changing screens
    finalScoreElement.textContent = `Final Score: ${gameState.score}`;
    
    // Check if the score is a high score
    if (isHighScore(gameState.score)) {
        // Show the high score input form
        gameOverScreen.classList.add('hidden');
        highScoresScreen.classList.remove('hidden');
        newHighScoreDiv.classList.remove('hidden');
        
        // Display current high scores
        displayHighScores();
        
        // Focus on the name input
        playerNameInput.focus();
    } else {
        // Just show the game over screen
        gameOverScreen.classList.remove('hidden');
        highScoresScreen.classList.add('hidden');
    }
    
    // Stop background music
    const backgroundMusic = document.getElementById('backgroundMusic');
    backgroundMusic.pause();
}

// ==================== RENDERING FUNCTIONS ====================
// Render game objects using the external rendering module
function render() {
    // Call the external rendering module
    Rendering.render(gameState, ctx, CONFIG);
}

// ==================== SOUND FUNCTIONS ====================
// Sound functions
function playCollisionSound() {
    const collisionSound = document.getElementById('collisionSound');
    if (collisionSound && soundToggle.checked) {
        collisionSound.currentTime = 0;
        collisionSound.play().catch(e => console.log('Sound play error:', e));
    }
}

function playStarSound() {
    const starSound = document.getElementById('starSound');
    if (starSound && soundToggle.checked) {
        starSound.currentTime = 0;
        starSound.play().catch(e => console.log('Sound play error:', e));
    }
}

function playLevelUpSound() {
    const levelUpSound = document.getElementById('levelUpSound');
    if (levelUpSound && soundToggle.checked) {
        levelUpSound.currentTime = 0;
        levelUpSound.play().catch(e => console.log('Sound play error:', e));
    }
}

function toggleSound() {
    const backgroundMusic = document.getElementById('backgroundMusic');
    if (soundToggle.checked) {
        // Sound is enabled
        if (gameState.state === GAME_STATES.PLAYING) {
            backgroundMusic.play().catch(e => console.log('Music play error:', e));
        }
    } else {
        // Sound is disabled
        backgroundMusic.pause();
    }
}

// Menu functions
function showMainMenu() {
    UI.showMainMenu(setGameState, CONFIG);
}

function showStartScreen() {
    UI.showStartScreen(mainMenu, startScreen, gameOverScreen, pauseScreen, controlsScreen, settingsScreen, creditsScreen);
}

function showControlsScreen() {
    UI.showControlsScreen(mainMenu, controlsScreen);
}

function showSettingsScreen() {
    UI.showSettingsScreen(mainMenu, settingsScreen);
}

function showCreditsScreen() {
    UI.showCreditsScreen(mainMenu, creditsScreen);
}

function goToMainMenu() {
    UI.goToMainMenu(setGameState, CONFIG);
}

// Initialize the game when the page loads
window.onload = init;