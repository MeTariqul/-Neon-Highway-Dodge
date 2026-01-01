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
    powerups: [], // Power-ups array
    activePowerups: { // Currently active power-ups
        shield: false,
        shieldEndTime: 0,
        slowmo: false,
        slowmoEndTime: 0,
        scoreMultiplier: false,
        scoreMultiplierEndTime: 0
    },
    // Combo/streak system
    combo: 0,
    lastComboTime: 0,
    comboScore: 0,
    
    // Upgrade system
    upgrades: {}, // Purchased upgrades
    
    // Particle system
    particles: [],
    
    lastObstacleTime: 0,
    lastCoinTime: 0,
    lastPowerupTime: 0, // For power-up spawning
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
const rankElement = document.getElementById('rank');
const comboElement = document.getElementById('combo');
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
const upgradeShopButton = document.getElementById('upgradeShopButton');
const controlsScreen = document.getElementById('controlsScreen');
const settingsScreen = document.getElementById('settingsScreen');
const creditsScreen = document.getElementById('creditsScreen');
const highScoresScreen = document.getElementById('highScoresScreen');
const upgradeShopScreen = document.getElementById('upgradeShopScreen');
const highScoresTableBody = document.getElementById('highScoresTableBody');
const newHighScoreDiv = document.getElementById('newHighScore');
const playerNameInput = document.getElementById('playerNameInput');
const saveScoreButton = document.getElementById('saveScoreButton');
const backFromHighScores = document.getElementById('backFromHighScores');
const backFromControls = document.getElementById('backFromControls');
const backFromSettings = document.getElementById('backFromSettings');
const backFromCredits = document.getElementById('backFromCredits');
const backFromUpgradeShop = document.getElementById('backFromUpgradeShop');
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
    startButton.addEventListener('click', () => {
        playButtonClickSound();
        showStartScreen();
    });
    playButton.addEventListener('click', () => {
        playButtonClickSound();
        startGame();
    });
    restartButton.addEventListener('click', () => {
        playButtonClickSound();
        restartGame();
    });
    resumeButton.addEventListener('click', () => {
        playButtonClickSound();
        resumeGame();
    });
    menuButton.addEventListener('click', () => {
        playButtonClickSound();
        goToMainMenu();
    });
    
    // Menu navigation buttons
    controlsButton.addEventListener('click', () => {
        playButtonClickSound();
        showControlsScreen();
    });
    settingsButton.addEventListener('click', () => {
        playButtonClickSound();
        showSettingsScreen();
    });
    creditsButton.addEventListener('click', () => {
        playButtonClickSound();
        showCreditsScreen();
    });
    highScoresButton.addEventListener('click', () => {
        playButtonClickSound();
        showHighScoresScreen();
    });
    backFromControls.addEventListener('click', () => {
        playButtonClickSound();
        showMainMenu();
    });
    backFromSettings.addEventListener('click', () => {
        playButtonClickSound();
        showMainMenu();
    });
    backFromCredits.addEventListener('click', () => {
        playButtonClickSound();
        showMainMenu();
    });
    backFromHighScores.addEventListener('click', () => {
        playButtonClickSound();
        showMainMenu();
    });
    
    // Sound toggle
    soundToggle.addEventListener('change', toggleSound);
    
    // High scores functionality
    saveScoreButton.addEventListener('click', saveHighScore);
    
    // Upgrade shop functionality
    upgradeShopButton.addEventListener('click', () => {
        playButtonClickSound();
        showUpgradeShopScreen();
    });
    backFromUpgradeShop.addEventListener('click', () => {
        playButtonClickSound();
        showMainMenu();
    });
    
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

// Load upgrades from localStorage
function loadUpgrades() {
    const upgradesJSON = localStorage.getItem(CONFIG.UPGRADES_KEY);
    if (upgradesJSON) {
        gameState.upgrades = JSON.parse(upgradesJSON);
    } else {
        gameState.upgrades = {};
    }
}

// Save upgrades to localStorage
function saveUpgrades() {
    localStorage.setItem(CONFIG.UPGRADES_KEY, JSON.stringify(gameState.upgrades));
}

// Initialize game
function init() {
    // Load upgrades
    loadUpgrades();
    
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
    
    // Apply upgrades to starting lives
    if (gameState.upgrades['starting_lives']) {
        gameState.lives += gameState.upgrades['starting_lives'];
    }
    
    gameState.level = 1;
    gameState.obstacles = [];
    gameState.coins = [];
    gameState.powerups = [];
    // Reset active power-ups
    gameState.activePowerups = {
        shield: false,
        shieldEndTime: 0,
        slowmo: false,
        slowmoEndTime: 0,
        scoreMultiplier: false,
        scoreMultiplierEndTime: 0
    };
    // Reset combo system
    gameState.combo = 0;
    gameState.lastComboTime = Date.now();
    gameState.comboScore = 0;
    
    // Set player speed based on upgrades
    gameState.player.speed = CONFIG.PLAYER_SPEED;
    if (gameState.upgrades['speed_boost']) {
        gameState.player.speed += gameState.upgrades['speed_boost'];
    }
    
    gameState.player.x = CONFIG.GAME_WIDTH / 2 - CONFIG.PLAYER_SIZE / 2;
    gameState.obstacleSpawnRate = CONFIG.OBSTACLE_BASE_SPAWN_RATE_MS;
    gameState.coinSpawnRate = CONFIG.COIN_BASE_SPAWN_RATE_MS;
    
    // Reset particles
    gameState.particles = [];
    
    updateScore();
    updateLives();
    updateLevel();
    
    // Start background music if sound is enabled
    AudioManager.playBackgroundMusic();
}

// Restart the game
function restartGame() {
    setGameState(GAME_STATES.PLAYING);
    gameState.score = 0;
    gameState.startTime = Date.now();
    gameState.lives = CONFIG.PLAYER_LIVES;
    
    // Apply upgrades to starting lives
    if (gameState.upgrades['starting_lives']) {
        gameState.lives += gameState.upgrades['starting_lives'];
    }
    
    gameState.level = 1;
    gameState.obstacles = [];
    gameState.coins = [];
    gameState.powerups = [];
    // Reset active power-ups
    gameState.activePowerups = {
        shield: false,
        shieldEndTime: 0,
        slowmo: false,
        slowmoEndTime: 0,
        scoreMultiplier: false,
        scoreMultiplierEndTime: 0
    };
    // Reset combo system
    gameState.combo = 0;
    gameState.lastComboTime = Date.now();
    gameState.comboScore = 0;
    
    // Set player speed based on upgrades
    gameState.player.speed = CONFIG.PLAYER_SPEED;
    if (gameState.upgrades['speed_boost']) {
        gameState.player.speed += gameState.upgrades['speed_boost'];
    }
    
    gameState.player.x = CONFIG.GAME_WIDTH / 2 - CONFIG.PLAYER_SIZE / 2;
    gameState.obstacleSpawnRate = CONFIG.OBSTACLE_BASE_SPAWN_RATE_MS;
    gameState.coinSpawnRate = CONFIG.COIN_BASE_SPAWN_RATE_MS;
    
    newHighScoreDiv.classList.add('hidden');
    
    updateScore();
    updateLives();
    updateLevel();
    
    // Start background music if sound is enabled
    AudioManager.playBackgroundMusic();
}

// Pause the game
function pauseGame() {
    setGameState(GAME_STATES.PAUSED);
    gameStateElement.textContent = 'PAUSED';
    
    // Pause background music
    AudioManager.pauseBackgroundMusic();
}

// Resume the game
function resumeGame() {
    setGameState(GAME_STATES.PLAYING);
    gameStateElement.textContent = '';
    
    // Resume background music if sound is enabled
    AudioManager.playBackgroundMusic();
}

// ==================== GAME LOOP AND UPDATE FUNCTIONS ====================
/**
 * Main game loop that runs continuously
 * @param {number} timestamp - Current time in milliseconds
 */
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
    // Calculate time factor for slow motion effect
    const timeFactor = gameState.activePowerups.slowmo ? CONFIG.SLOWMO_FACTOR : 1;
    
    // Update score (1 point per second since game started)
    const elapsedSeconds = Math.floor((Date.now() - gameState.startTime) / 1000);
    gameState.score = elapsedSeconds;
    updateScore();
    
    // Update rank based on score
    updateRank();
    
    // Handle player movement with keyboard
    Input.processKeyboardInput(keys, gameState, CONFIG, clampPlayerPosition);
    
    // Calculate spawn rates with time factor
    const adjustedObstacleSpawnRate = gameState.obstacleSpawnRate * timeFactor;
    const adjustedCoinSpawnRate = gameState.coinSpawnRate * timeFactor;
    const adjustedPowerupSpawnRate = CONFIG.POWERUP_SPAWN_RATE_MS * timeFactor;
    
    // Spawn obstacles
    if (timestamp - gameState.lastObstacleTime > adjustedObstacleSpawnRate) {
        spawnObstacle();
        gameState.lastObstacleTime = timestamp;
    }
    
    // Spawn coins
    if (timestamp - gameState.lastCoinTime > adjustedCoinSpawnRate) {
        spawnCoin();
        gameState.lastCoinTime = timestamp;
    }
    
    // Spawn power-ups
    if (timestamp - gameState.lastPowerupTime > adjustedPowerupSpawnRate) {
        spawnPowerup();
        gameState.lastPowerupTime = timestamp;
    }
    
    // Update obstacles
    for (let i = gameState.obstacles.length - 1; i >= 0; i--) {
        const obstacle = gameState.obstacles[i];
        obstacle.y += obstacle.speed * timeFactor;
        
        // Remove obstacles that go off screen
        if (obstacle.y > GAME_HEIGHT) {
            gameState.obstacles.splice(i, 1);
        }
    }
    
    // Update coins
    for (let i = gameState.coins.length - 1; i >= 0; i--) {
        const coin = gameState.coins[i];
        coin.y += coin.speed * timeFactor;
        
        // Remove coins that go off screen
        if (coin.y > GAME_HEIGHT) {
            gameState.coins.splice(i, 1);
        }
    }
    
    // Update power-ups
    for (let i = gameState.powerups.length - 1; i >= 0; i--) {
        const powerup = gameState.powerups[i];
        powerup.y += powerup.speed * timeFactor;
        
        // Remove power-ups that go off screen
        if (powerup.y > GAME_HEIGHT) {
            gameState.powerups.splice(i, 1);
        }
    }
    
    // Check collisions
    checkCollisions();
    
    // Check and update active power-ups
    updateActivePowerups();
    
    // Update combo system
    updateCombo();
    
    // Update particles
    updateParticles();
    
    // Increase difficulty over time
    updateDifficulty(timestamp);
}

/**
 * Spawns a new obstacle with a chance to spawn a pattern instead of a single obstacle
 */
function spawnObstacle() {
    // Determine if we should spawn a pattern or a single obstacle
    if (Math.random() < CONFIG.PATTERN_SPAWN_CHANCE) {
        spawnPattern();
    } else {
        spawnSingleObstacle();
    }
}

/**
 * Spawns a single obstacle in a random lane based on the current difficulty level
 */
function spawnSingleObstacle() {
    // Calculate obstacle size based on level (obstacles get smaller as difficulty increases)
    const sizeReduction = Math.min(gameState.level * CONFIG.DIFFICULTY_SIZE_DECREASE_PER_LEVEL, 
                                  CONFIG.OBSTACLE_MAX_SIZE - CONFIG.OBSTACLE_MIN_SIZE - 5);
    const adjustedMinSize = Math.max(CONFIG.OBSTACLE_MIN_SIZE, CONFIG.OBSTACLE_MAX_SIZE - sizeReduction);
    const size = Math.random() * (CONFIG.OBSTACLE_MAX_SIZE - adjustedMinSize) + adjustedMinSize;
    
    // Calculate obstacle speed based on level
    const speed = Math.random() * (CONFIG.OBSTACLE_MAX_SPEED - CONFIG.OBSTACLE_MIN_SPEED) + 
                 CONFIG.OBSTACLE_MIN_SPEED + (gameState.level * CONFIG.DIFFICULTY_SPEED_INCREASE_PER_LEVEL);
    
    // Calculate lane positions
    const laneWidth = CONFIG.LANE_WIDTH;
    const laneOffset = CONFIG.LANE_OFFSET;
    
    // Choose a random lane
    const lane = Math.floor(Math.random() * CONFIG.NUM_LANES);
    const laneX = laneOffset + lane * laneWidth + (laneWidth - size) / 2; // Center the obstacle in the lane
    
    gameState.obstacles.push({
        x: laneX,
        y: -size,
        width: size,
        height: size,
        speed: speed
    });
}

// Spawn a pattern of obstacles
function spawnPattern() {
    const patternType = Object.values(CONFIG.PATTERN_TYPES)[Math.floor(Math.random() * Object.values(CONFIG.PATTERN_TYPES).length)];
    
    switch(patternType) {
        case CONFIG.PATTERN_TYPES.SINGLE:
            spawnSingleObstacle();
            break;
        case CONFIG.PATTERN_TYPES.DOUBLE:
            spawnDoublePattern();
            break;
        case CONFIG.PATTERN_TYPES.TRIPLE:
            spawnTriplePattern();
            break;
        case CONFIG.PATTERN_TYPES.CHAIN:
            spawnChainPattern();
            break;
    }
}

// Spawn two obstacles side by side
function spawnDoublePattern() {
    const sizeReduction = Math.min(gameState.level * CONFIG.DIFFICULTY_SIZE_DECREASE_PER_LEVEL, 
                                  CONFIG.OBSTACLE_MAX_SIZE - CONFIG.OBSTACLE_MIN_SIZE - 5);
    const adjustedMinSize = Math.max(CONFIG.OBSTACLE_MIN_SIZE, CONFIG.OBSTACLE_MAX_SIZE - sizeReduction);
    const size = Math.random() * (CONFIG.OBSTACLE_MAX_SIZE - adjustedMinSize) + adjustedMinSize;
    
    const speed = Math.random() * (CONFIG.OBSTACLE_MAX_SPEED - CONFIG.OBSTACLE_MIN_SPEED) + 
                 CONFIG.OBSTACLE_MIN_SPEED + (gameState.level * CONFIG.DIFFICULTY_SPEED_INCREASE_PER_LEVEL);
    
    // Calculate lane positions
    const laneWidth = CONFIG.LANE_WIDTH;
    const laneOffset = CONFIG.LANE_OFFSET;
    
    // Choose two adjacent lanes
    const lane1 = Math.floor(Math.random() * (CONFIG.NUM_LANES - 1));
    const lane2 = lane1 + 1;
    
    const lane1X = laneOffset + lane1 * laneWidth + (laneWidth - size) / 2;
    const lane2X = laneOffset + lane2 * laneWidth + (laneWidth - size) / 2;
    
    gameState.obstacles.push({
        x: lane1X,
        y: -size,
        width: size,
        height: size,
        speed: speed
    });
    
    gameState.obstacles.push({
        x: lane2X,
        y: -size,
        width: size,
        height: size,
        speed: speed
    });
}

// Spawn three obstacles in a row
function spawnTriplePattern() {
    const sizeReduction = Math.min(gameState.level * CONFIG.DIFFICULTY_SIZE_DECREASE_PER_LEVEL, 
                                  CONFIG.OBSTACLE_MAX_SIZE - CONFIG.OBSTACLE_MIN_SIZE - 5);
    const adjustedMinSize = Math.max(CONFIG.OBSTACLE_MIN_SIZE, CONFIG.OBSTACLE_MAX_SIZE - sizeReduction);
    const size = Math.random() * (CONFIG.OBSTACLE_MAX_SIZE - adjustedMinSize) + adjustedMinSize;
    
    const speed = Math.random() * (CONFIG.OBSTACLE_MAX_SPEED - CONFIG.OBSTACLE_MIN_SPEED) + 
                 CONFIG.OBSTACLE_MIN_SPEED + (gameState.level * CONFIG.DIFFICULTY_SPEED_INCREASE_PER_LEVEL);
    
    // Calculate lane positions
    const laneWidth = CONFIG.LANE_WIDTH;
    const laneOffset = CONFIG.LANE_OFFSET;
    
    // Choose three consecutive lanes if possible, or spread across available lanes
    if (CONFIG.NUM_LANES >= 3) {
        const startLane = Math.floor(Math.random() * (CONFIG.NUM_LANES - 2));
        
        for (let i = 0; i < 3; i++) {
            const lane = startLane + i;
            const laneX = laneOffset + lane * laneWidth + (laneWidth - size) / 2;
            
            gameState.obstacles.push({
                x: laneX,
                y: -size,
                width: size,
                height: size,
                speed: speed
            });
        }
    } else {
        // If we don't have enough lanes, just spawn 3 obstacles in random lanes
        for (let i = 0; i < 3; i++) {
            const lane = Math.floor(Math.random() * CONFIG.NUM_LANES);
            const laneX = laneOffset + lane * laneWidth + (laneWidth - size) / 2;
            
            gameState.obstacles.push({
                x: laneX,
                y: -size,
                width: size,
                height: size,
                speed: speed
            });
        }
    }
}

// Spawn a chain of obstacles with some time delay
function spawnChainPattern() {
    const sizeReduction = Math.min(gameState.level * CONFIG.DIFFICULTY_SIZE_DECREASE_PER_LEVEL, 
                                  CONFIG.OBSTACLE_MAX_SIZE - CONFIG.OBSTACLE_MIN_SIZE - 5);
    const adjustedMinSize = Math.max(CONFIG.OBSTACLE_MIN_SIZE, CONFIG.OBSTACLE_MAX_SIZE - sizeReduction);
    const size = Math.random() * (CONFIG.OBSTACLE_MAX_SIZE - adjustedMinSize) + adjustedMinSize;
    
    const speed = Math.random() * (CONFIG.OBSTACLE_MAX_SPEED - CONFIG.OBSTACLE_MIN_SPEED) + 
                 CONFIG.OBSTACLE_MIN_SPEED + (gameState.level * CONFIG.DIFFICULTY_SPEED_INCREASE_PER_LEVEL);
    
    // Calculate lane positions
    const laneWidth = CONFIG.LANE_WIDTH;
    const laneOffset = CONFIG.LANE_OFFSET;
    
    // Choose a lane for the chain
    const lane = Math.floor(Math.random() * CONFIG.NUM_LANES);
    const laneX = laneOffset + lane * laneWidth + (laneWidth - size) / 2;
    
    // Add multiple obstacles in the same lane with different Y positions
    const numInChain = Math.floor(Math.random() * 3) + 2; // 2-4 obstacles in chain
    
    for (let i = 0; i < numInChain; i++) {
        const yPosition = -size - (i * (size + 30)); // Space them out vertically
        
        gameState.obstacles.push({
            x: laneX,
            y: yPosition,
            width: size,
            height: size,
            speed: speed
        });
    }
}

// Spawn a new coin
function spawnCoin() {
    // Create coin object with initial properties
    const coin = {
        x: Math.random() * (GAME_WIDTH - CONFIG.COIN_SIZE),
        y: -CONFIG.COIN_SIZE,
        width: CONFIG.COIN_SIZE,
        height: CONFIG.COIN_SIZE,
        speed: 3 + (gameState.level * 0.1)
    };
    
    gameState.coins.push(coin);
}

// Spawn a new power-up
function spawnPowerup() {
    // Randomly select a power-up type
    const powerupTypes = Object.values(CONFIG.POWERUP_TYPES);
    const randomType = powerupTypes[Math.floor(Math.random() * powerupTypes.length)];
    
    // Create powerup object with initial properties
    const powerup = {
        x: Math.random() * (GAME_WIDTH - CONFIG.POWERUP_SIZE),
        y: -CONFIG.POWERUP_SIZE,
        width: CONFIG.POWERUP_SIZE,
        height: CONFIG.POWERUP_SIZE,
        speed: 3 + (gameState.level * 0.1),
        type: randomType
    };
    
    gameState.powerups.push(powerup);
}

// Check for collisions
function checkCollisions() {
    const currentTime = Date.now();
    
    // Check player-obstacle collisions
    // Only check obstacles that are on screen or about to be on screen
    for (let i = gameState.obstacles.length - 1; i >= 0; i--) {
        const obstacle = gameState.obstacles[i];
        
        // Quick bounds check to see if obstacle is potentially colliding
        // Only process collision if obstacle is on screen (y is between -obstacle.height and GAME_HEIGHT)
        if (obstacle.y > -obstacle.height && obstacle.y < GAME_HEIGHT) {
            if (isColliding(gameState.player, obstacle) && (currentTime - gameState.lastCollisionTime) > CONFIG.COLLISION_COOLDOWN_MS) { // 1 second cooldown
                // Reset combo on collision
                resetCombo();
                
                // Check if shield power-up is active
                if (gameState.activePowerups.shield) {
                    // Shield is active, remove the obstacle but don't lose a life
                    gameState.obstacles.splice(i, 1);
                    // Visual feedback for shield protection
                    gameState.activePowerups.shieldEndTime = currentTime + CONFIG.SHIELD_DURATION_MS;
                    break; // Only handle one collision per frame
                } else {
                    // Lose a life
                    gameState.lives--;
                    updateLives();
                    
                    // Play collision sound
                    playCollisionSound();
                                
                    // Visual feedback for collision
                    gameState.lastCollisionTime = currentTime;
                                
                    // Create collision particles
                    createCollisionParticles(obstacle.x + obstacle.width/2, obstacle.y + obstacle.height/2);
                                
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
        } else if (obstacle.y > GAME_HEIGHT) {
            // If obstacle is off screen, remove it to improve performance
            gameState.obstacles.splice(i, 1);
        }
    }
    
    // Check player-coin collisions
    for (let i = gameState.coins.length - 1; i >= 0; i--) {
        const coin = gameState.coins[i];
        
        // Only check coins that are on screen
        if (coin.y > -coin.height && coin.y < GAME_HEIGHT) {
            if (isColliding(gameState.player, coin)) {
                // Add points for collecting coin
                const coinValue = gameState.activePowerups.scoreMultiplier ? 20 * CONFIG.SCORE_MULTIPLIER_VALUE : 20;
                gameState.score += coinValue;
                updateScore();
                
                // Increase combo on coin collection
                increaseCombo();
                
                // Play coin collection sound
                playStarSound();
                
                // Create coin collection particles
                createCoinParticles(coin.x + coin.width/2, coin.y + coin.height/2);
                
                gameState.coins.splice(i, 1);
            }
        } else if (coin.y > GAME_HEIGHT) {
            // If coin is off screen, remove it to improve performance
            gameState.coins.splice(i, 1);
        }
    }
    
    // Check player-powerup collisions
    for (let i = gameState.powerups.length - 1; i >= 0; i--) {
        const powerup = gameState.powerups[i];
        
        // Only check powerups that are on screen
        if (powerup.y > -powerup.height && powerup.y < GAME_HEIGHT) {
            if (isColliding(gameState.player, powerup)) {
                // Activate the power-up
                activatePowerup(powerup.type);
                
                // Increase combo on power-up collection
                increaseCombo();
                
                // Play power-up collection sound
                playStarSound();
                
                // Create power-up collection particles
                createPowerupParticles(powerup.x + powerup.width/2, powerup.y + powerup.height/2, powerup.type);
                
                gameState.powerups.splice(i, 1);
            }
        } else if (powerup.y > GAME_HEIGHT) {
            // If powerup is off screen, remove it to improve performance
            gameState.powerups.splice(i, 1);
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

// Activate a power-up based on its type
function activatePowerup(type) {
    const currentTime = Date.now();
    
    switch(type) {
        case CONFIG.POWERUP_TYPES.SHIELD:
            gameState.activePowerups.shield = true;
            // Apply shield duration upgrade if purchased
            let shieldDuration = CONFIG.SHIELD_DURATION_MS;
            if (gameState.upgrades['shield_duration']) {
                shieldDuration += gameState.upgrades['shield_duration'];
            }
            gameState.activePowerups.shieldEndTime = currentTime + shieldDuration;
            break;
        case CONFIG.POWERUP_TYPES.SLOWMO:
            gameState.activePowerups.slowmo = true;
            // Apply slowmo duration upgrade if purchased
            let slowmoDuration = CONFIG.POWERUP_DURATION_MS;
            if (gameState.upgrades['slowmo_duration']) {
                slowmoDuration += gameState.upgrades['slowmo_duration'];
            }
            gameState.activePowerups.slowmoEndTime = currentTime + slowmoDuration;
            break;
        case CONFIG.POWERUP_TYPES.SCORE_MULTIPLIER:
            gameState.activePowerups.scoreMultiplier = true;
            // Apply score multiplier duration upgrade if purchased
            let scoreMultiplierDuration = CONFIG.POWERUP_DURATION_MS;
            if (gameState.upgrades['score_multiplier_duration']) {
                scoreMultiplierDuration += gameState.upgrades['score_multiplier_duration'];
            }
            gameState.activePowerups.scoreMultiplierEndTime = currentTime + scoreMultiplierDuration;
            break;
    }
}

// Update active power-ups, deactivate expired ones
function updateActivePowerups() {
    const currentTime = Date.now();
    
    // Check if shield has expired
    if (gameState.activePowerups.shield && currentTime > gameState.activePowerups.shieldEndTime) {
        gameState.activePowerups.shield = false;
    }
    
    // Check if slow motion has expired
    if (gameState.activePowerups.slowmo && currentTime > gameState.activePowerups.slowmoEndTime) {
        gameState.activePowerups.slowmo = false;
    }
    
    // Check if score multiplier has expired
    if (gameState.activePowerups.scoreMultiplier && currentTime > gameState.activePowerups.scoreMultiplierEndTime) {
        gameState.activePowerups.scoreMultiplier = false;
    }
}

// Update combo system
function updateCombo() {
    const currentTime = Date.now();
    
    // Check if combo has expired (no action for a while)
    if (currentTime - gameState.lastComboTime > CONFIG.COMBO_RESET_TIME_MS) {
        gameState.combo = 0;
    }
}

// Increase combo and add bonus points
function increaseCombo() {
    const currentTime = Date.now();
    
    // Update combo counter
    gameState.combo++;
    gameState.lastComboTime = currentTime;
    
    // Check if combo reached threshold for bonus
    if (gameState.combo > 0 && gameState.combo % CONFIG.COMBO_BONUS_THRESHOLD === 0) {
        // Add bonus points
        gameState.score += CONFIG.COMBO_BONUS_VALUE;
        updateScore();
        
        // Play bonus sound
        playLevelUpSound();
    }
}

// Reset combo
function resetCombo() {
    gameState.combo = 0;
}

// Get rank based on score
function getRankByScore(score) {
    const rankEntries = Object.entries(CONFIG.RANK_THRESHOLDS);
    
    // Find the highest rank that the score qualifies for
    let currentRank = 'Rookie'; // Default rank
    
    for (const [rank, threshold] of rankEntries) {
        if (score >= threshold) {
            currentRank = rank;
        }
    }
    
    return currentRank;
}

// Update rank display
function updateRank() {
    const currentRank = getRankByScore(gameState.score);
    
    // Check if rank has changed
    const previousRankElement = document.getElementById('rank');
    if (previousRankElement) {
        const previousRank = previousRankElement.textContent.replace('Rank: ', '');
        if (previousRank !== currentRank) {
            // Create level up particles
            createLevelUpParticles(CONFIG.GAME_WIDTH / 2, 50);
        }
    }
    
    // Update rank display element
    if (typeof rankElement !== 'undefined' && rankElement) {
        rankElement.textContent = `Rank: ${currentRank}`;
    }
}

// Update difficulty based on time
function updateDifficulty(timestamp) {
    const elapsedSeconds = Math.floor((Date.now() - gameState.startTime) / 1000);
    const newLevel = Math.min(CONFIG.MAX_LEVEL, Math.floor(elapsedSeconds / CONFIG.LEVEL_SECONDS) + 1);
    
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

/**
 * Update spawn rates based on current level
 * As the player progresses to higher levels, obstacles and coins spawn more frequently
 */
function updateSpawnRates() {
    // Increase obstacle spawn rate as level increases (faster spawning)
    gameState.obstacleSpawnRate = Math.max(300, CONFIG.OBSTACLE_BASE_SPAWN_RATE_MS - (gameState.level * CONFIG.DIFFICULTY_SPAWN_RATE_DECREASE_PER_LEVEL));
    
    // Also make coin spawn rate faster with level
    gameState.coinSpawnRate = Math.max(1000, CONFIG.COIN_BASE_SPAWN_RATE_MS - (gameState.level * 100));
}

/**
 * Update score display in the UI
 * This function updates both the score and combo displays
 */
function updateScore() {
    UI.updateScore(scoreElement, gameState);
    // Update combo display as well
    UI.updateCombo(comboElement, gameState);
}

/**
 * Update lives display in the UI
 */
function updateLives() {
    UI.updateLives(livesElement, gameState);
}

/**
 * Update level display in the UI
 */
function updateLevel() {
    UI.updateLevel(levelElement, gameState);
}

/**
 * End the game and show the game over screen
 * This function handles the game over state and displays appropriate UI
 */
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
    AudioManager.pauseBackgroundMusic();
}

// ==================== RENDERING FUNCTIONS ====================
// Render game objects using the external rendering module
function render() {
    // Call the external rendering module
    Rendering.render(gameState, ctx, CONFIG);
}

// ==================== SOUND FUNCTIONS ====================
// Sound functions

/**
 * Play collision sound effect
 */
function playCollisionSound() {
    AudioManager.playConfigSound('collision');
}

/**
 * Play coin/collectible sound effect
 */
function playStarSound() {
    AudioManager.playConfigSound('coin');
}

/**
 * Play level up sound effect
 */
function playLevelUpSound() {
    AudioManager.playConfigSound('levelUp');
}

/**
 * Play button click sound effect
 */
function playButtonClickSound() {
    AudioManager.playConfigSound('buttonClick');
}

/**
 * Toggle sound on/off based on checkbox state
 */
function toggleSound() {
    AudioManager.setSoundEnabled(soundToggle.checked);
}

// Menu functions

/**
 * Show main menu
 */
function showMainMenu() {
    UI.showMainMenu(setGameState, CONFIG);
    
    // Show start screen directly without tutorial
    showStartScreen();
}

/**
 * Show start screen
 */
function showStartScreen() {
    UI.showStartScreen(mainMenu, startScreen, gameOverScreen, pauseScreen, controlsScreen, settingsScreen, creditsScreen);
}

/**
 * Show controls screen
 */
function showControlsScreen() {
    UI.showControlsScreen(mainMenu, controlsScreen);
}

/**
 * Show settings screen
 */
function showSettingsScreen() {
    UI.showSettingsScreen(mainMenu, settingsScreen);
}

/**
 * Show credits screen
 */
function showCreditsScreen() {
    UI.showCreditsScreen(mainMenu, creditsScreen);
}

/**
 * Show upgrade shop screen
 */
function showUpgradeShopScreen() {
    UI.showUpgradeShop(mainMenu, upgradeShopScreen);
}

/**
 * Go to main menu
 */
function goToMainMenu() {
    UI.goToMainMenu(setGameState, CONFIG);
}

// Check if an upgrade is purchased
function isUpgradePurchased(upgradeId) {
    return gameState.upgrades[upgradeId] !== undefined;
}

// Purchase an upgrade
function purchaseUpgrade(upgradeId) {
    const upgrade = Object.values(CONFIG.UPGRADES).find(u => u.id === upgradeId);
    
    if (!upgrade) {
        console.error('Invalid upgrade ID:', upgradeId);
        return false;
    }
    
    // Check if upgrade is already purchased
    if (isUpgradePurchased(upgradeId)) {
        console.log('Upgrade already purchased:', upgradeId);
        return false;
    }
    
    // Check if player has enough score
    if (gameState.score < upgrade.cost) {
        console.log('Not enough score to purchase upgrade:', upgradeId);
        return false;
    }
    
    // Deduct cost from score
    gameState.score -= upgrade.cost;
    updateScore();
    
    // Apply the upgrade
    gameState.upgrades[upgradeId] = upgrade.value;
    
    // Save upgrades to localStorage
    saveUpgrades();
    
    console.log('Successfully purchased upgrade:', upgradeId);
    return true;
}

// Get all available upgrades
function getAvailableUpgrades() {
    return Object.values(CONFIG.UPGRADES);
}

// Get player's current score
function getPlayerScore() {
    return gameState.score;
}

// Audio manager
const AudioManager = {
    // Play a sound by ID
    playSound: function(soundId, volume = 1) {
        if (!soundToggle.checked) return; // Don't play if sound is disabled
        
        const soundElement = document.getElementById(soundId);
        if (soundElement) {
            soundElement.currentTime = 0;
            soundElement.volume = volume;
            soundElement.play().catch(e => console.log('Sound play error:', e));
        }
    },
    
    // Play a sound from config
    playConfigSound: function(soundType) {
        if (!soundToggle.checked) return; // Don't play if sound is disabled
        
        const soundConfig = CONFIG.AUDIO[soundType];
        if (soundConfig) {
            this.playSound(soundConfig.id, soundConfig.volume);
        }
    },
    
    // Play background music
    playBackgroundMusic: function() {
        if (!soundToggle.checked) return; // Don't play if sound is disabled
        
        const bgMusic = document.getElementById(CONFIG.AUDIO.background.id);
        if (bgMusic) {
            bgMusic.currentTime = 0;
            bgMusic.volume = CONFIG.AUDIO.background.volume;
            bgMusic.loop = true;
            bgMusic.play().catch(e => console.log('Background music play error:', e));
        }
    },
    
    // Pause background music
    pauseBackgroundMusic: function() {
        const bgMusic = document.getElementById(CONFIG.AUDIO.background.id);
        if (bgMusic) {
            bgMusic.pause();
        }
    },
    
    // Set sound enabled/disabled
    setSoundEnabled: function(enabled) {
        if (enabled) {
            // If enabling, resume background music if in playing state
            if (gameState.state === CONFIG.GAME_STATES.PLAYING) {
                this.playBackgroundMusic();
            }
        } else {
            // If disabling, pause background music
            this.pauseBackgroundMusic();
        }
    }
};

/**
 * Create particles for collision effect
 * @param {number} x - X coordinate where particles should be created
 * @param {number} y - Y coordinate where particles should be created
 */
function createCollisionParticles(x, y) {
    for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
        const angle = Math.random() * Math.PI * 2; // Random angle
        const speed = Math.random() * (CONFIG.PARTICLE_MAX_SPEED - CONFIG.PARTICLE_MIN_SPEED) + CONFIG.PARTICLE_MIN_SPEED;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        
        const size = Math.random() * (CONFIG.PARTICLE_MAX_SIZE - CONFIG.PARTICLE_MIN_SIZE) + CONFIG.PARTICLE_MIN_SIZE;
        
        const colors = ['#e74c3c', '#f39c12', '#e67e22']; // Red, orange, yellow
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        gameState.particles.push({
            x: x,
            y: y,
            vx: vx,
            vy: vy,
            size: size,
            color: color,
            life: CONFIG.PARTICLE_LIFETIME,
            maxLife: CONFIG.PARTICLE_LIFETIME
        });
    }
}

/**
 * Create particles for coin collection
 * @param {number} x - X coordinate where particles should be created
 * @param {number} y - Y coordinate where particles should be created
 */
function createCoinParticles(x, y) {
    for (let i = 0; i < Math.floor(CONFIG.PARTICLE_COUNT / 2); i++) { // Fewer particles for coins
        const angle = Math.random() * Math.PI * 2; // Random angle
        const speed = Math.random() * (CONFIG.PARTICLE_MAX_SPEED - CONFIG.PARTICLE_MIN_SPEED) + CONFIG.PARTICLE_MIN_SIZE;
        const vx = Math.cos(angle) * speed * 0.5; // Slower particles
        const vy = Math.sin(angle) * speed * 0.5;
        
        const size = Math.random() * (CONFIG.PARTICLE_MAX_SIZE - CONFIG.PARTICLE_MIN_SIZE) + CONFIG.PARTICLE_MIN_SIZE;
        
        const color = '#f1c40f'; // Yellow for coins
        
        gameState.particles.push({
            x: x,
            y: y,
            vx: vx,
            vy: vy,
            size: size,
            color: color,
            life: CONFIG.PARTICLE_LIFETIME,
            maxLife: CONFIG.PARTICLE_LIFETIME
        });
    }
}

/**
 * Create particles for power-up collection
 * @param {number} x - X coordinate where particles should be created
 * @param {number} y - Y coordinate where particles should be created
 * @param {string} type - Type of power-up to determine particle color
 */
function createPowerupParticles(x, y, type) {
    const colors = {
        [CONFIG.POWERUP_TYPES.SHIELD]: '#3498db',
        [CONFIG.POWERUP_TYPES.SLOWMO]: '#e74c3c',
        [CONFIG.POWERUP_TYPES.SCORE_MULTIPLIER]: '#f1c40f'
    };
    
    const color = colors[type] || '#ffffff';
    
    for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
        const angle = Math.random() * Math.PI * 2; // Random angle
        const speed = Math.random() * (CONFIG.PARTICLE_MAX_SPEED - CONFIG.PARTICLE_MIN_SPEED) + CONFIG.PARTICLE_MIN_SPEED;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        
        const size = Math.random() * (CONFIG.PARTICLE_MAX_SIZE - CONFIG.PARTICLE_MIN_SIZE) + CONFIG.PARTICLE_MIN_SIZE;
        
        gameState.particles.push({
            x: x,
            y: y,
            vx: vx,
            vy: vy,
            size: size,
            color: color,
            life: CONFIG.PARTICLE_LIFETIME,
            maxLife: CONFIG.PARTICLE_LIFETIME
        });
    }
}

/**
 * Create particles for level up
 * @param {number} x - X coordinate where particles should be created
 * @param {number} y - Y coordinate where particles should be created
 */
function createLevelUpParticles(x, y) {
    for (let i = 0; i < CONFIG.PARTICLE_COUNT * 1.5; i++) { // More particles for level up
        const angle = Math.random() * Math.PI * 2; // Random angle
        const speed = Math.random() * (CONFIG.PARTICLE_MAX_SPEED - CONFIG.PARTICLE_MIN_SPEED) + CONFIG.PARTICLE_MIN_SPEED;
        const vx = Math.cos(angle) * speed * 1.5; // Faster particles
        const vy = Math.sin(angle) * speed * 1.5;
        
        const colors = ['#9b59b6', '#8e44ad', '#3498db', '#2980b9']; // Purple and blue
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        const size = Math.random() * (CONFIG.PARTICLE_MAX_SIZE - CONFIG.PARTICLE_MIN_SIZE) + CONFIG.PARTICLE_MIN_SIZE;
        
        gameState.particles.push({
            x: x,
            y: y,
            vx: vx,
            vy: vy,
            size: size,
            color: color,
            life: CONFIG.PARTICLE_LIFETIME,
            maxLife: CONFIG.PARTICLE_LIFETIME
        });
    }
}

/**
 * Update particles
 * This function updates the position, life, and removes dead particles
 */
function updateParticles() {
    // Process particles from the end to beginning to avoid index issues when removing
    for (let i = gameState.particles.length - 1; i >= 0; i--) {
        const particle = gameState.particles[i];
        
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Apply gravity
        particle.vy += 0.1;
        
        // Decrease life
        particle.life -= 16; // Assuming ~60fps
        
        // Remove dead particles
        if (particle.life <= 0) {
            gameState.particles.splice(i, 1);
        }
    }
    
    // Limit total particles to prevent performance issues
    if (gameState.particles.length > CONFIG.MAX_PARTICLES) {
        gameState.particles = gameState.particles.slice(0, CONFIG.MAX_PARTICLES);
    }
}

// Initialize the game when the page loads
window.onload = init;