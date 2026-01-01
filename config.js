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

    // Difficulty progression settings
    DIFFICULTY_SPEED_INCREASE_PER_LEVEL: 0.3,  // Speed increase per level
    DIFFICULTY_SPAWN_RATE_DECREASE_PER_LEVEL: 40,  // Spawn rate decrease per level (faster spawning)
    DIFFICULTY_SIZE_DECREASE_PER_LEVEL: 2,  // Size decrease per level (smaller obstacles)
    MAX_LEVEL: 15,  // Maximum level cap

    // Power-up settings
    POWERUP_SIZE: 20,
    POWERUP_SPAWN_RATE_MS: 8000,  // milliseconds
    POWERUP_DURATION_MS: 5000,  // milliseconds
    POWERUP_TYPES: {
        SHIELD: 'SHIELD',
        SLOWMO: 'SLOWMO',
        SCORE_MULTIPLIER: 'SCORE_MULTIPLIER'
    },
    
    // Power-up effects
    SHIELD_DURATION_MS: 5000,
    SLOWMO_FACTOR: 0.5,  // Slow motion to 50% speed
    SCORE_MULTIPLIER_VALUE: 2,  // Double score
    
    // Lane-based spawning settings
    NUM_LANES: 4,  // Number of lanes
    LANE_WIDTH: 150,  // Width of each lane
    LANE_OFFSET: 100,  // Offset from the sides
    
    // Pattern spawning settings
    PATTERN_TYPES: {
        SINGLE: 'SINGLE',
        DOUBLE: 'DOUBLE',
        TRIPLE: 'TRIPLE',
        CHAIN: 'CHAIN'
    },
    PATTERN_SPAWN_CHANCE: 0.3,  // 30% chance to spawn a pattern instead of random
    
    // Combo/streak system settings
    COMBO_BASE_SCORE: 1,  // Base score for combo counter
    COMBO_RESET_TIME_MS: 3000,  // Time in ms before combo resets
    COMBO_BONUS_MULTIPLIER: 1.5,  // Multiplier for each combo level
    COMBO_BONUS_THRESHOLD: 5,  // Score bonus after reaching this combo count
    COMBO_BONUS_VALUE: 50,  // Bonus points for reaching combo threshold
    
    // Level/rank system settings
    RANK_THRESHOLDS: {
        'Rookie': 100,
        'Amateur': 250,
        'Semi-Pro': 500,
        'Pro': 1000,
        'Expert': 2000,
        'Master': 3500,
        'Legend': 5000
    },
    
    // Upgrade system settings
    UPGRADES: {
        'SPEED_BOOST': {
            id: 'speed_boost',
            name: 'Speed Boost',
            description: 'Slightly increase your base speed',
            cost: 100,
            effect: 'player_speed',
            value: 1
        },
        'SHIELD_DURATION': {
            id: 'shield_duration',
            name: 'Extended Shield',
            description: 'Increase shield duration by 2 seconds',
            cost: 150,
            effect: 'shield_duration',
            value: 2000
        },
        'SCORE_MULTIPLIER': {
            id: 'score_multiplier',
            name: 'Score Boost',
            description: 'Increase score multiplier duration',
            cost: 200,
            effect: 'score_multiplier_duration',
            value: 2000
        },
        'SLOWMO_DURATION': {
            id: 'slowmo_duration',
            name: 'Time Warp',
            description: 'Increase slow motion duration',
            cost: 250,
            effect: 'slowmo_duration',
            value: 2000
        },
        'STARTING_LIVES': {
            id: 'starting_lives',
            name: 'Extra Life',
            description: 'Start with an additional life',
            cost: 300,
            effect: 'starting_lives',
            value: 1
        }
    },
    UPGRADES_KEY: 'neonHighwayDodgeUpgrades',
    
    // Particle effects settings
    PARTICLE_COUNT: 10,  // Number of particles for each effect
    PARTICLE_LIFETIME: 1000,  // Lifetime in ms
    PARTICLE_MIN_SPEED: 1,
    PARTICLE_MAX_SPEED: 5,
    PARTICLE_MIN_SIZE: 2,
    PARTICLE_MAX_SIZE: 6,
    MAX_PARTICLES: 200,  // Maximum number of particles to prevent performance issues
    
    // Audio settings
    AUDIO: {
        collision: { id: 'collisionSound', volume: 0.7 },
        coin: { id: 'starSound', volume: 0.6 },
        levelUp: { id: 'levelUpSound', volume: 0.8 },
        background: { id: 'backgroundMusic', volume: 0.5 },
        buttonClick: { id: 'buttonClickSound', volume: 0.5 }
    },
    
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