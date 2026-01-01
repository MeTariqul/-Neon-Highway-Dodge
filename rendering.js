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
            drawEnemyCar(obstacle, ctx, gameState, CONFIG);
        }
        
        // Draw coins
        for (const coin of gameState.coins) {
            drawCoin(coin, ctx, CONFIG);
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
    ctx.fillRect(0, 0, 50, CONFIG.GAME_HEIGHT); // Left grass
    ctx.fillRect(CONFIG.GAME_WIDTH - 50, 0, 50, CONFIG.GAME_HEIGHT); // Right grass
    
    // Draw road markings
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 4;
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
    ctx.moveTo(50, 0);
    ctx.lineTo(50, CONFIG.GAME_HEIGHT);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(CONFIG.GAME_WIDTH - 50, 0);
    ctx.lineTo(CONFIG.GAME_WIDTH - 50, CONFIG.GAME_HEIGHT);
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
    module.exports = { render, drawRoad, drawPlayerCar, drawEnemyCar, drawCoin, lightenColor, darkenColor };
} else {
    window.Rendering = { render, drawRoad, drawPlayerCar, drawEnemyCar, drawCoin, lightenColor, darkenColor };
}