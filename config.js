// ==================== GAME CONFIGURATION ====================
// Game canvas dimensions
const CONFIG = {
    // Game canvas dimensions
    GAME_WIDTH: 800,
    GAME_HEIGHT: 600,

    // Player properties
    PLAYER_SIZE: 50, // Car is wider
    PLAYER_SPEED: 5,
    PLAYER_LIVES: 3,

    // Obstacle properties
    OBSTACLE_MIN_SIZE: 40,
    OBSTACLE_MAX_SIZE: 70,
    OBSTACLE_MIN_SPEED: 3,
    OBSTACLE_MAX_SPEED: 8,

    // Coin properties
    COIN_SIZE: 15,

    // Game settings
    COIN_BASE_SPAWN_RATE_MS: 4000,  // milliseconds
    OBSTACLE_BASE_SPAWN_RATE_MS: 1200,  // milliseconds
    LEVEL_SECONDS: 30,  // seconds before next level
    COLLISION_COOLDOWN_MS: 1000,  // milliseconds between collisions
    PLAYER_DETAIL_OFFSET: 5,
    PLAYER_DETAIL_WIDTH: 10,

    // High score settings
    HIGH_SCORES_KEY: 'neonHighwayDodgeHighScores',
    MAX_HIGH_SCORES: 3,

    // Game states
    GAME_STATES: {
        MENU: 'MENU',
        PLAYING: 'PLAYING',
        PAUSED: 'PAUSED',
        GAME_OVER: 'GAME_OVER'
    }
};

// Export configuration for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else {
    window.CONFIG = CONFIG;
}