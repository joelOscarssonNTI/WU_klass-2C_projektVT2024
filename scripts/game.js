/*
    Flie: game.js
    author: Joel Oscarsson
    Date: 2023-11-29
    Description: this code sets up a simple game using HTML canvas and JavaScript. 
    It creates a player, projectiles, and enemies, and handles their movement and interactions.
*/


// Import the gsap library
console.log(gsap);

// Select canvas and get 2d context
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

// Set canvas width and height
canvas.width = innerWidth;
canvas.height = innerHeight;

// Select HTML elements
const scoreEl = document.querySelector('#scoreEl');
const startGameBtn = document.querySelector('#startGameBtn');
const modalEl = document.querySelector('#modalEl');
const bigScoreEl = document.querySelector('#bigScoreEl');

// Player class
class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    draw() {
        // Draw player
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
    }
}

// Projectile class
class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw() {
        // Draw projectile
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
    }

    update() {
        // Update projectile position
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}

// Enemy class
class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw() {
        // Draw enemy
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.fill();
    }

    update() {
        // Update enemy position
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}

// Initialize player, projectiles, and enemies
const x = canvas.width / 2;
const y = canvas.height / 2;
let player = new Player(x, y, 10, 'white');
let projectiles = [];
let enemies = [];

// Initialize score
let score = 0;

// Initialize game
function init() {
    player = new Player(x, y, 10, 'white');
    projectiles = [];
    enemies = [];
    score = 0;
    scoreEl.innerHTML = score;
    bigScoreEl.innerHTML = score;
}

// Function to spawn enemies at intervals
function spawnEnemies() {
    setInterval(() => {
        // Randomize enemy attributes
        const radius = Math.random() * (30 - 4) + 4;
        let x;
        let y;

        // Randomize enemy spawn position
        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            y = Math.random() * canvas.height;
        } else {
            x = Math.random() * canvas.width;
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
        }

        const color = `hsl(${Math.random() * 360}, 100%, 50%)`;

        const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);

        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        };

        // Create new enemy and add to array
        enemies.push(new Enemy(x, y, radius, color, velocity));
        console.log(enemies);
    }, 700);
}

// Animation loop
let animationId;
function animate() {
    animationId = requestAnimationFrame(animate);
    c.fillStyle = 'rgba(0, 0, 0, 0.1)';
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.draw();

    // Update and check projectiles
    projectiles.forEach((projectile, index) => {
        projectile.update();

        // Remove projectiles out of bounds
        if (
            projectile.x + projectile.radius < 0 ||
            projectile.x - projectile.radius > canvas.width ||
            projectile.y + projectile.radius < 0 ||
            projectile.y - projectile.radius > canvas.height
        ) {
            setTimeout(() => {
                projectiles.splice(index, 1);
            }, 0);
        }
    });

    // Update and check enemies
    enemies.forEach((enemy, index) => {
        enemy.update();

        // Check collision with player
        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
        if (dist - enemy.radius - player.radius < 1) {
            cancelAnimationFrame(animationId);
            modalEl.style.display = 'block';
            bigScoreEl.innerHTML = score;
        }

        // Check collision with projectiles
        projectiles.forEach((projectile, projectileIndex) => {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
            if (dist - enemy.radius - projectile.radius < 1) {
                if (enemy.radius - 10 > 5) {
                    // Reduce enemy radius and remove projectile
                    score += 100;
                    scoreEl.innerHTML = score;
                    gsap.to(enemy, {
                        radius: enemy.radius - 10
                    });
                    setTimeout(() => {
                        projectiles.splice(projectileIndex, 1);
                    }, 0);
                } else {
                    // Remove enemy and projectile
                    score += 250;
                    scoreEl.innerHTML = score;
                    setTimeout(() => {
                        enemies.splice(index, 1);
                        projectiles.splice(projectileIndex, 1);
                    }, 0);
                }
            }
        });
    });
}

// Event listener for shooting projectiles
addEventListener('click', () => {
    const angle = Math.atan2(
        event.clientY - canvas.height / 2,
        event.clientX - canvas.width / 2
    );

    const velocity = {
        x: Math.cos(angle) * 5,
        y: Math.sin(angle) * 5
    };

    // Create projectile and add to array
    projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, 5, 'white', velocity));
});

// Event listener to start game
startGameBtn.addEventListener('click', () => {
    // Initialize game and start animations
    init();
    animate();
    spawnEnemies();
    modalEl.style.display = 'none';
});
