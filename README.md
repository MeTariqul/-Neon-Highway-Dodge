# Neon Highway Dodge

Neon Highway Dodge is a fast‑paced top‑down car dodging game built with **HTML5 Canvas**, **CSS3**, and **vanilla JavaScript**.

Drive along a glowing neon highway, avoid incoming traffic, collect coins, and try to beat the local high‑score table. The game is designed to be responsive and playable on desktop, laptop, tablet, and mobile browsers.

---

## Table of Contents

- [Features](#features)
- [Gameplay](#gameplay)
  - [Goal](#goal)
  - [Controls](#controls)
  - [Difficulty & Levels](#difficulty--levels)
  - [Lives & Game Over](#lives--game-over)
  - [Coins & High Scores](#coins--high-scores)
- [New Features Added](#new-features-added)
- [Screens & UI](#screens--ui)
- [Responsive Design](#responsive-design)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Running Locally](#running-locally)
- [Configuration](#configuration)
- [Customization Ideas](#customization-ideas)
- [Planned Improvements](#planned-improvements)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Top‑down car dodging gameplay** with smooth movement and simple, readable rules.
- **Neon highway theme** with custom‑drawn road, cars, and coins using Canvas.
- **Multiple input methods**:
  - Keyboard (A/D or Arrow keys),
  - Mouse movement,
  - Touch movement on mobile.
- **Lives and score system** with level progression and increasing difficulty.
- **Local high‑score table** stored in the browser using `localStorage`.
- **Multiple UI screens**:
  - Main Menu,
  - Start/Game screen,
  - Pause screen,
  - Game Over,
  - Controls,
  - Settings,
  - Credits,
  - High Scores.
- **Responsive layout** that scales to different screen sizes while keeping a clean 4:3 play area.
- **Modular codebase** split into configuration, input, UI, rendering, and main game logic files.

---

## New Features Added

Since the original version, the game has been enhanced with the following features:

- **Difficulty Progression**: Increasing speed, spawn frequency, and obstacle patterns as the game progresses.
- **Power-ups System**: Three distinct power-ups:
  - Shield: Temporary invincibility against collisions
  - Slow Motion: Slows down game speed temporarily
  - Score Multiplier: Doubles score temporarily
- **Lane-based Spawning**: 4-lane system with different obstacle patterns (Single, Double, Triple, Chain).
- **Combo/Streak System**: Bonus points for consecutive safe actions without collisions.
- **Level/Rank System**: Rank progression from "Rookie" to "Legend" based on score.
- **Upgrade Shop**: Persistent upgrades between game sessions using localStorage:
  - Speed Boost
  - Extended Shield Duration
  - Score Boost Duration
  - Time Warp Duration
  - Extra Life
- **Particle Effects**: Visual effects for collisions, coin/power-up collection, and level ups.
- **Audio System**: Sound effects for collisions, collection, level ups, and button clicks with mute functionality.
- **Performance Optimizations**: Improved collision detection, rendering performance, and game loop efficiency.

---

## Gameplay

### Goal

Survive as long as possible on the neon highway while:

- **Avoiding enemy cars / obstacles**
- **Collecting coins** to increase your score
- **Climbing through levels** as difficulty increases
- **Setting a new high score**

### Controls

Keyboard:

- `A` or `Arrow Left` – Move car left
- `D` or `Arrow Right` – Move car right
- `Space` – Pause / resume the game

Mouse:

- Move the mouse left/right over the game area to steer the car.

Touch (mobile/tablet):

- Drag your finger left/right across the game area to steer the car.

The player car is clamped so it cannot leave the road area.

### Difficulty & Levels

- The game starts at **level 1**.
- Every fixed amount of time (configured in the settings), the **level increases**.
- Higher levels:
  - Increase enemy car spawn rate,
  - Increase enemy speed,
  - Make the game progressively harder.

### Lives & Game Over

- You start with a limited number of **lives**.
- Colliding with an enemy car:
  - Decreases your life count.
  - May include a short collision cooldown to avoid losing multiple lives at once from a single overlap.
- When lives reach zero, the game ends and the **Game Over** screen appears showing your final score.

### Coins & High Scores

- **Coins** spawn on the road and move downwards.
- Collecting a coin:
  - Gives a score bonus.
- At the end of a run:
  - If your score is high enough, you can enter your **name** and save it to the local high‑score table.
  - High scores are stored using `localStorage` so they persist between sessions in the same browser.

---

## Screens & UI

The game uses several overlay screens:

- **Main Menu**
  - Game title.
  - Buttons: *Start Game*, *High Scores*, *Upgrade Shop*, *Controls*, *Settings*, *Credits*.
- **Controls Screen**
  - Explains keyboard, mouse, and touch controls.
- **Settings Screen**
  - Sound toggle option to mute/unmute audio.
- **Credits Screen**
  - Basic credits for the author and technologies used.
- **Upgrade Shop Screen**
  - Allows purchasing upgrades with earned points.
- **High Scores Screen**
  - Table listing top scores (name + score).
  - "Back" button to return to menu.
- **Pause Screen**
  - Semi‑transparent overlay with "Paused" message.
  - Resume option.
- **Game Over Screen**
  - Shows final score.
  - High‑score name input if applicable.
  - Buttons to restart or go back to menu.

---

## Responsive Design

The layout is designed to work on:

- **Desktop / Laptop** – game centered, maximum width limited for readability.
- **Tablets** – game scales to available width while keeping aspect ratio.
- **Phones** – game uses most of the screen width; text and buttons remain readable.

Typical techniques used:

- A container with a fixed **aspect ratio** (4:3) for the canvas.
- Canvas styled with `width: 100%; height: 100%;` inside the container.
- Media queries to adjust margins, font sizes, and button sizes on small screens.

---

## Project Structure

Typical file layout:

- `index.html`  
  Main HTML document, includes the canvas element, UI overlays, and loads all scripts.

- `style.css`  
  Global styles, neon theme colors, layout, button styles, responsive container, and screen overlays.

- `config.js`  
  Central configuration constants, such as:
  - Game width and height,
  - Player size and speed,
  - Obstacle/coin sizes and spawn rates,
  - Level duration,
  - Collision cooldown,
  - High‑score key name,
  - Game state enumeration.

- `game.js`  
  Core game logic:
  - Game state object,
  - Initialization,
  - Main loop (`requestAnimationFrame`),
  - Spawning obstacles and coins,
  - Collision detection,
  - Updating score, lives, and levels,
  - Pausing, resuming, restarting,
  - Hooking up input and UI modules.

- `input.js`  
  Handles:
  - Keyboard events (`keydown` / `keyup`),
  - Mouse movement events,
  - Touch movement events,
  - Player clamping within road bounds,
  - Optional helper functions to process input each frame.

- `rendering.js`  
  All drawing on the 2D canvas:
  - Road background (asphalt, lane markings, grass edges),
  - Player car (body, windows, wheels),
  - Enemy cars / obstacles,
  - Coins, including gradients or 3D‑style effects,
  - Power-ups and visual effects,
  - Optional pause or effect overlays.

- `ui.js`  
  UI state and high‑score logic:
  - Functions to show/hide screens based on game state,
  - Functions for navigation buttons (menu, start, back, etc.),
  - High‑score storage and retrieval using `localStorage`,
  - Filling the high‑score table in the DOM,
  - Handling saving a new high score,
  - Upgrade shop functionality.

- `README.md`  
  Project documentation (this file).

---

## Getting Started

### Prerequisites

- A modern web browser:
  - Google Chrome
  - Microsoft Edge
  - Mozilla Firefox
  - Safari
- Optional: a simple HTTP server if you prefer not to open `index.html` directly.

### Running Locally

1. **Clone the repository**

   ```bash
   git clone https://github.com/MeTariqul/-Neon-Highway-Dodge.git
   ```

2. **Open the game**

   - Option 1: Open `index.html` directly in your browser.
   - Option 2: Start a local server (e.g., using Python's `http.server` or Node's `http-server`):

     ```bash
     # Using Python 3
     python -m http.server 8000

     # Using Node.js with http-server
     npx http-server
     ```

     Then navigate to `http://localhost:8000` (or the port shown in your terminal).

---

## Configuration

Game parameters are defined in `config.js`. You can customize:

- Canvas dimensions
- Player size and speed
- Obstacle/coin sizes and spawn rates
- Level progression settings
- Power-up settings
- Audio settings
- UI element names and thresholds

---

## Customization Ideas

- Add new power-up types
- Implement different enemy car designs
- Add visual effects (screen shake, particle systems)
- Introduce new game modes (time-limited, survival, etc.)
- Add achievements system
- Implement local multiplayer

---

## Planned Improvements

- Further performance optimizations
- Additional power-up types
- Enhanced visual effects
- More challenging obstacle patterns
- Achievements system

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.