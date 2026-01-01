// ==================== INPUT HANDLING MODULE ====================
// Input handling functions for the game

// Initialize input handling
function initInputHandling(keys) {
    // Initialize the keys object
    return {};
}

// Handle key down event
function handleKeyDown(e, keys, gameState, CONFIG) {
    keys[e.key] = true;
    
    // Space to pause/resume during gameplay
    if (e.key === ' ' && gameState.state === CONFIG.GAME_STATES.PLAYING) {
        return 'PAUSE';
    } else if (e.key === ' ' && gameState.state === CONFIG.GAME_STATES.PAUSED) {
        return 'RESUME';
    }
    
    return null; // No special action
}

// Handle key up event
function handleKeyUp(e, keys) {
    keys[e.key] = false;
}

// Handle touch movement for mobile
function handleTouchMove(e, canvas, gameState, CONFIG) {
    e.preventDefault();
    if (gameState.state !== CONFIG.GAME_STATES.PLAYING) return;
    
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const mouseX = touch.clientX - rect.left;
    
    // Convert from screen coordinates to logical game coordinates
    const scaleX = CONFIG.GAME_WIDTH / rect.width;
    const logicalX = mouseX * scaleX;
    
    gameState.player.x = logicalX - gameState.player.width / 2;
}

// Handle mouse movement for desktop
function handleMouseMove(e, canvas, gameState) {
    if (gameState.state !== CONFIG.GAME_STATES.PLAYING) return;
    
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    
    // Convert from screen coordinates to logical game coordinates
    const scaleX = CONFIG.GAME_WIDTH / rect.width;
    const logicalX = mouseX * scaleX;
    
    gameState.player.x = logicalX - gameState.player.width / 2;
}

// Clamp player position within canvas bounds
function clampPlayerPosition(gameState, CONFIG) {
    if (gameState.player.x < 0) {
        gameState.player.x = 0;
    } else if (gameState.player.x + gameState.player.width > CONFIG.GAME_WIDTH) {
        gameState.player.x = CONFIG.GAME_WIDTH - gameState.player.width;
    }
}

// Process keyboard input for player movement
function processKeyboardInput(keys, gameState, CONFIG, clampPlayerPosition) {
    // Handle player movement with keyboard
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
        gameState.player.x -= gameState.player.speed;
    }
    if (keys['ArrowRight'] || keys['d'] || keys['D']) {
        gameState.player.x += gameState.player.speed;
    }
    
    // Clamp player position within canvas bounds
    clampPlayerPosition(gameState, CONFIG);
}

// Export input functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        initInputHandling, 
        handleKeyDown, 
        handleKeyUp, 
        handleTouchMove, 
        handleMouseMove, 
        clampPlayerPosition,
        processKeyboardInput
    };
} else {
    window.Input = { 
        initInputHandling, 
        handleKeyDown, 
        handleKeyUp, 
        handleTouchMove, 
        handleMouseMove, 
        clampPlayerPosition,
        processKeyboardInput
    };
}