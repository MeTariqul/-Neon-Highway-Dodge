// ==================== RENDERING MODULE ====================
// Rendering functions for the game

// Render game objects with enhanced pseudo-3D effects
function render(gameState, ctx, CONFIG) {
    // Clear canvas
    ctx.clearRect(0, 0, CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT);
    
    // Draw road background
    drawRoad(ctx, CONFIG);
    
    if (gameState.state === CONFIG.GAME_STATES.PLAYING || gameState.state === CONFIG.GAME_STATES.PAUSED) {
        // Draw obstacles (enemy cars)
        for (const obstacle of gameState.obstacles) {
            // Only draw obstacles that are on screen
            if (obstacle.y > -obstacle.height && obstacle.y < CONFIG.GAME_HEIGHT) {
                drawEnemyCar(obstacle, ctx, gameState, CONFIG);
            }
        }
        
        // Draw coins
        for (const coin of gameState.coins) {
            // Only draw coins that are on screen
            if (coin.y > -coin.height && coin.y < CONFIG.GAME_HEIGHT) {
                drawCoin(coin, ctx, CONFIG);
            }
        }
        
        // Draw power-ups
        for (const powerup of gameState.powerups) {
            // Only draw power-ups that are on screen
            if (powerup.y > -powerup.height && powerup.y < CONFIG.GAME_HEIGHT) {
                drawPowerup(powerup, ctx, CONFIG);
            }
        }
        
        // Draw particles
        for (const particle of gameState.particles) {
            // Only draw particles that are visible (life > 0)
            if (particle.life > 0) {
                drawParticle(particle, ctx);
            }
        }
        
        // Draw player car
        drawPlayerCar(gameState, ctx, CONFIG);
    }
    
    // Draw pause indicator if game is paused
    if (gameState.state === CONFIG.GAME_STATES.PAUSED) {
        // Semi-transparent overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT);
        
        // Draw pause text
        ctx.font = '48px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('PAUSED', CONFIG.GAME_WIDTH / 2, CONFIG.GAME_HEIGHT / 2);
    }
}

// Draw road background
function drawRoad(ctx, CONFIG) {
    // Draw road
    ctx.fillStyle = '#555';
    ctx.fillRect(0, 0, CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT);
    
    // Draw grassy sides
    ctx.fillStyle = '#4a7c59';
    ctx.fillRect(0, 0, CONFIG.LANE_OFFSET, CONFIG.GAME_HEIGHT); // Left grass
    ctx.fillRect(CONFIG.GAME_WIDTH - CONFIG.LANE_OFFSET, 0, CONFIG.LANE_OFFSET, CONFIG.GAME_HEIGHT); // Right grass
    
    // Draw lane dividers
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.setLineDash([20, 15]); // Dashed line
    
    // Draw lane dividers
    for (let i = 1; i < CONFIG.NUM_LANES; i++) {
        const x = CONFIG.LANE_OFFSET + i * CONFIG.LANE_WIDTH;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, CONFIG.GAME_HEIGHT);
        ctx.stroke();
    }
    
    // Draw center line
    ctx.setLineDash([20, 15]); // Dashed line
    ctx.beginPath();
    ctx.moveTo(CONFIG.GAME_WIDTH / 2, 0);
    ctx.lineTo(CONFIG.GAME_WIDTH / 2, CONFIG.GAME_HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]); // Reset line dash
    
    // Draw road edge lines
    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(CONFIG.LANE_OFFSET, 0);
    ctx.lineTo(CONFIG.LANE_OFFSET, CONFIG.GAME_HEIGHT);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(CONFIG.GAME_WIDTH - CONFIG.LANE_OFFSET, 0);
    ctx.lineTo(CONFIG.GAME_WIDTH - CONFIG.LANE_OFFSET, CONFIG.GAME_HEIGHT);
    ctx.stroke();
}

// Draw player car
function drawPlayerCar(gameState, ctx, CONFIG) {
    const player = gameState.player;
    
    // Car body
    ctx.fillStyle = '#3498db'; // Blue car
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    // Car details
    ctx.fillStyle = '#2980b9'; // Darker blue
    ctx.fillRect(player.x + 5, player.y + 5, player.width - 10, 8); // Front window
    ctx.fillRect(player.x + 5, player.y + player.height - 13, player.width - 10, 8); // Rear window
    
    // Wheels
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(player.x - 2, player.y + 5, 3, 10); // Left front wheel
    ctx.fillRect(player.x + player.width - 1, player.y + 5, 3, 10); // Right front wheel
    ctx.fillRect(player.x - 2, player.y + player.height - 15, 3, 10); // Left rear wheel
    ctx.fillRect(player.x + player.width - 1, player.y + player.height - 15, 3, 10); // Right rear wheel
    
    // Draw shield indicator if active
    if (gameState.activePowerups.shield) {
        ctx.strokeStyle = '#3498db'; // Blue border
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(player.x + player.width/2, player.y + player.height/2, player.width/2 + 5, 0, Math.PI * 2);
        ctx.stroke();
        
        // Add a pulsing effect
        const pulse = Math.sin(Date.now() / 200) * 2;
        ctx.shadowColor = '#3498db';
        ctx.shadowBlur = 10 + pulse;
        ctx.beginPath();
        ctx.arc(player.x + player.width/2, player.y + player.height/2, player.width/2 + 5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0; // Reset shadow
    }
}

// Draw enemy car
function drawEnemyCar(obstacle, ctx, gameState, CONFIG) {
    // Different colors based on level
    const hue = (gameState.level * 20) % 360;
    ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
    
    // Draw car body
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    
    // Car details
    ctx.fillStyle = `hsl(${hue}, 70%, 30%)`;
    ctx.fillRect(obstacle.x + 3, obstacle.y + 3, obstacle.width - 6, 5); // Front window
    ctx.fillRect(obstacle.x + 3, obstacle.y + obstacle.height - 8, obstacle.width - 6, 5); // Rear window
    
    // Wheels
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(obstacle.x - 1, obstacle.y + 3, 2, 6); // Left front wheel
    ctx.fillRect(obstacle.x + obstacle.width - 1, obstacle.y + 3, 2, 6); // Right front wheel
    ctx.fillRect(obstacle.x - 1, obstacle.y + obstacle.height - 9, 2, 6); // Left rear wheel
    ctx.fillRect(obstacle.x + obstacle.width - 1, obstacle.y + obstacle.height - 9, 2, 6); // Right rear wheel
}

// Draw coin
function drawCoin(coin, ctx, CONFIG) {
    // Create radial gradient for 3D effect
    const gradient = ctx.createRadialGradient(
        coin.x + coin.width/2, coin.y + coin.height/2, 0,
        coin.x + coin.width/2, coin.y + coin.height/2, coin.width
    );
    gradient.addColorStop(0, '#ffff00');
    gradient.addColorStop(0.7, '#ffcc00');
    gradient.addColorStop(1, '#ff9900');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(coin.x + coin.width/2, coin.y + coin.height/2, coin.width/2, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw coin details
    ctx.fillStyle = '#ffaa00';
    ctx.beginPath();
    ctx.arc(coin.x + coin.width/2, coin.y + coin.height/2, coin.width/4, 0, Math.PI * 2);
    ctx.fill();
}

// Draw power-up
function drawPowerup(powerup, ctx, CONFIG) {
    // Different colors for different power-up types
    let color;
    switch(powerup.type) {
        case CONFIG.POWERUP_TYPES.SHIELD:
            color = '#3498db'; // Blue for shield
            break;
        case CONFIG.POWERUP_TYPES.SLOWMO:
            color = '#e74c3c'; // Red for slow motion
            break;
        case CONFIG.POWERUP_TYPES.SCORE_MULTIPLIER:
            color = '#f1c40f'; // Yellow for score multiplier
            break;
        default:
            color = '#ffffff'; // White as fallback
    }
    
    // Draw power-up as a square with a symbol inside
    ctx.fillStyle = color;
    ctx.fillRect(powerup.x, powerup.y, powerup.width, powerup.height);
    
    // Draw a border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(powerup.x, powerup.y, powerup.width, powerup.height);
    
    // Draw a symbol inside based on type
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    let symbol;
    switch(powerup.type) {
        case CONFIG.POWERUP_TYPES.SHIELD:
            symbol = 'S'; // Shield
            break;
        case CONFIG.POWERUP_TYPES.SLOWMO:
            symbol = 'T'; // Time
            break;
        case CONFIG.POWERUP_TYPES.SCORE_MULTIPLIER:
            symbol = 'X'; // Multiplier
            break;
    }
    
    ctx.fillText(symbol, powerup.x + powerup.width/2, powerup.y + powerup.height/2);
}

// Draw a particle
function drawParticle(particle, ctx) {
    // Calculate alpha based on remaining life
    const alpha = particle.life / particle.maxLife;
    
    // Skip drawing if particle is almost invisible
    if (alpha < 0.05) return;
    
    // Create gradient for particle
    const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size
    );
    
    // Set gradient colors based on the particle's color
    gradient.addColorStop(0, particle.color);
    gradient.addColorStop(1, `${particle.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`);
    
    ctx.fillStyle = gradient;
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1; // Reset alpha
}

// Helper function to lighten a color
function lightenColor(color, percent) {
    // Convert HSL to a more manipulable format
    const match = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (!match) return color;
    
    const h = parseInt(match[1]);
    const s = parseInt(match[2]);
    let l = parseInt(match[3]);
    
    l = Math.min(100, l + percent);
    
    return `hsl(${h}, ${s}%, ${l}%)`;
}

// Helper function to darken a color
function darkenColor(color, percent) {
    // Convert HSL to a more manipulable format
    const match = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (!match) return color;
    
    const h = parseInt(match[1]);
    const s = parseInt(match[2]);
    let l = parseInt(match[3]);
    
    l = Math.max(0, l - percent);
    
    return `hsl(${h}, ${s}%, ${l}%)`;
}

// Draw a star shape
function drawStar(ctx, cx, cy, outerRadius, innerRadius) {
    ctx.beginPath();
    
    const spikes = 5;
    const rot = Math.PI / 2;
    
    for (let i = 0; i < spikes * 2; i++) {
        const radius = (i % 2 === 0) ? outerRadius : innerRadius;
        const x = cx + Math.cos(rot * i + Math.PI / spikes) * radius;
        const y = cy + Math.sin(rot * i + Math.PI / spikes) * radius;
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    
    ctx.closePath();
    ctx.fill();
    
    // Add glow effect
    ctx.shadowColor = '#ffd700';
    ctx.shadowBlur = 5;
    ctx.stroke();
}

// Export rendering functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { render, drawRoad, drawPlayerCar, drawEnemyCar, drawCoin, drawPowerup, drawParticle, lightenColor, darkenColor };
} else {
    window.Rendering = { render, drawRoad, drawPlayerCar, drawEnemyCar, drawCoin, drawPowerup, drawParticle, lightenColor, darkenColor };
}