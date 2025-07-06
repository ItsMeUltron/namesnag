import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useTelegram } from '../hooks/useTelegram';

interface GameState {
  mario: {
    x: number;
    y: number;
    velocityX: number;
    velocityY: number;
    onGround: boolean;
    direction: 'left' | 'right';
    isJumping: boolean;
  };
  coins: Array<{ x: number; y: number; collected: boolean; id: number }>;
  enemies: Array<{ x: number; y: number; direction: 'left' | 'right'; id: number; alive: boolean }>;
  score: number;
  lives: number;
  gameOver: boolean;
  gameWon: boolean;
}

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
const MARIO_SIZE = 32;
const COIN_SIZE = 20;
const ENEMY_SIZE = 24;
const GRAVITY = 0.8;
const JUMP_FORCE = -15;
const MOVE_SPEED = 5;

export const GameCanvas: React.FC<{
  onScoreChange: (score: number) => void;
  onGameEnd: (won: boolean, score: number) => void;
}> = ({ onScoreChange, onGameEnd }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { hapticFeedback, notificationFeedback } = useTelegram();
  const [gameState, setGameState] = useState<GameState>({
    mario: {
      x: 50,
      y: 300,
      velocityX: 0,
      velocityY: 0,
      onGround: false,
      direction: 'right',
      isJumping: false
    },
    coins: [
      { x: 200, y: 250, collected: false, id: 1 },
      { x: 350, y: 200, collected: false, id: 2 },
      { x: 500, y: 180, collected: false, id: 3 },
      { x: 650, y: 220, collected: false, id: 4 },
      { x: 300, y: 100, collected: false, id: 5 }
    ],
    enemies: [
      { x: 400, y: 320, direction: 'left', id: 1, alive: true },
      { x: 600, y: 320, direction: 'right', id: 2, alive: true }
    ],
    score: 0,
    lives: 3,
    gameOver: false,
    gameWon: false
  });

  const [keys, setKeys] = useState<{ [key: string]: boolean }>({});

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(prev => ({ ...prev, [e.key]: true }));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys(prev => ({ ...prev, [e.key]: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Touch controls for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = touch.clientX - rect.left;
    const canvasWidth = rect.width;
    
    if (x < canvasWidth / 3) {
      setKeys(prev => ({ ...prev, 'ArrowLeft': true }));
    } else if (x > (canvasWidth * 2) / 3) {
      setKeys(prev => ({ ...prev, 'ArrowRight': true }));
    } else {
      setKeys(prev => ({ ...prev, ' ': true }));
    }
    
    hapticFeedback('light');
  }, [hapticFeedback]);

  const handleTouchEnd = useCallback(() => {
    setKeys({});
  }, []);

  // Game physics and logic
  const updateGame = useCallback(() => {
    if (gameState.gameOver || gameState.gameWon) return;

    setGameState(prevState => {
      const newState = { ...prevState };
      const mario = { ...newState.mario };

      // Handle input
      if (keys['ArrowLeft'] || keys['a']) {
        mario.velocityX = -MOVE_SPEED;
        mario.direction = 'left';
      } else if (keys['ArrowRight'] || keys['d']) {
        mario.velocityX = MOVE_SPEED;
        mario.direction = 'right';
      } else {
        mario.velocityX *= 0.8; // Friction
      }

      if ((keys[' '] || keys['ArrowUp'] || keys['w']) && mario.onGround) {
        mario.velocityY = JUMP_FORCE;
        mario.onGround = false;
        mario.isJumping = true;
        hapticFeedback('medium');
      }

      // Apply gravity
      mario.velocityY += GRAVITY;

      // Update position
      mario.x += mario.velocityX;
      mario.y += mario.velocityY;

      // Ground collision
      if (mario.y > 320) {
        mario.y = 320;
        mario.velocityY = 0;
        mario.onGround = true;
        mario.isJumping = false;
      }

      // Wall boundaries
      if (mario.x < 0) mario.x = 0;
      if (mario.x > CANVAS_WIDTH - MARIO_SIZE) mario.x = CANVAS_WIDTH - MARIO_SIZE;

      // Platform collisions (simple platforms)
      const platforms = [
        { x: 150, y: 280, width: 100, height: 20 },
        { x: 300, y: 230, width: 100, height: 20 },
        { x: 450, y: 200, width: 100, height: 20 },
        { x: 600, y: 250, width: 100, height: 20 }
      ];

      platforms.forEach(platform => {
        if (mario.x < platform.x + platform.width &&
            mario.x + MARIO_SIZE > platform.x &&
            mario.y < platform.y + platform.height &&
            mario.y + MARIO_SIZE > platform.y &&
            mario.velocityY > 0) {
          mario.y = platform.y - MARIO_SIZE;
          mario.velocityY = 0;
          mario.onGround = true;
          mario.isJumping = false;
        }
      });

      // Coin collection
      newState.coins = newState.coins.map(coin => {
        if (!coin.collected &&
            mario.x < coin.x + COIN_SIZE &&
            mario.x + MARIO_SIZE > coin.x &&
            mario.y < coin.y + COIN_SIZE &&
            mario.y + MARIO_SIZE > coin.y) {
          newState.score += 100;
          notificationFeedback('success');
          return { ...coin, collected: true };
        }
        return coin;
      });

      // Enemy movement and collision
      newState.enemies = newState.enemies.map(enemy => {
        if (!enemy.alive) return enemy;

        // Move enemy
        const newEnemy = { ...enemy };
        newEnemy.x += newEnemy.direction === 'left' ? -2 : 2;

        // Reverse direction at boundaries
        if (newEnemy.x <= 0 || newEnemy.x >= CANVAS_WIDTH - ENEMY_SIZE) {
          newEnemy.direction = newEnemy.direction === 'left' ? 'right' : 'left';
        }

        // Check collision with Mario
        if (mario.x < newEnemy.x + ENEMY_SIZE &&
            mario.x + MARIO_SIZE > newEnemy.x &&
            mario.y < newEnemy.y + ENEMY_SIZE &&
            mario.y + MARIO_SIZE > newEnemy.y) {
          
          // If Mario is jumping on enemy
          if (mario.velocityY > 0 && mario.y < newEnemy.y) {
            newEnemy.alive = false;
            mario.velocityY = JUMP_FORCE / 2; // Small bounce
            newState.score += 200;
            notificationFeedback('success');
          } else {
            // Mario takes damage
            newState.lives -= 1;
            notificationFeedback('error');
            
            if (newState.lives <= 0) {
              newState.gameOver = true;
            } else {
              // Reset Mario position
              mario.x = 50;
              mario.y = 300;
              mario.velocityX = 0;
              mario.velocityY = 0;
            }
          }
        }

        return newEnemy;
      });

      // Check win condition
      const allCoinsCollected = newState.coins.every(coin => coin.collected);
      if (allCoinsCollected && !newState.gameWon) {
        newState.gameWon = true;
        notificationFeedback('success');
      }

      newState.mario = mario;
      return newState;
    });
  }, [keys, gameState.gameOver, gameState.gameWon, hapticFeedback, notificationFeedback]);

  // Game loop
  useEffect(() => {
    const gameLoop = setInterval(updateGame, 1000 / 60); // 60 FPS
    return () => clearInterval(gameLoop);
  }, [updateGame]);

  // Update score callback
  useEffect(() => {
    onScoreChange(gameState.score);
  }, [gameState.score, onScoreChange]);

  // Handle game end
  useEffect(() => {
    if (gameState.gameOver || gameState.gameWon) {
      onGameEnd(gameState.gameWon, gameState.score);
    }
  }, [gameState.gameOver, gameState.gameWon, gameState.score, onGameEnd]);

  // Render game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw clouds
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(100, 80, 30, 0, Math.PI * 2);
    ctx.arc(130, 80, 40, 0, Math.PI * 2);
    ctx.arc(160, 80, 30, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(500, 60, 25, 0, Math.PI * 2);
    ctx.arc(520, 60, 35, 0, Math.PI * 2);
    ctx.arc(545, 60, 25, 0, Math.PI * 2);
    ctx.fill();

    // Draw ground
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, 350, CANVAS_WIDTH, 50);

    // Draw platforms
    ctx.fillStyle = '#228B22';
    const platforms = [
      { x: 150, y: 280, width: 100, height: 20 },
      { x: 300, y: 230, width: 100, height: 20 },
      { x: 450, y: 200, width: 100, height: 20 },
      { x: 600, y: 250, width: 100, height: 20 }
    ];
    platforms.forEach(platform => {
      ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });

    // Draw coins
    gameState.coins.forEach(coin => {
      if (!coin.collected) {
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(coin.x + COIN_SIZE/2, coin.y + COIN_SIZE/2, COIN_SIZE/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Coin shine effect
        ctx.fillStyle = '#FFFF00';
        ctx.beginPath();
        ctx.arc(coin.x + COIN_SIZE/2 - 5, coin.y + COIN_SIZE/2 - 5, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Draw enemies
    gameState.enemies.forEach(enemy => {
      if (enemy.alive) {
        ctx.fillStyle = '#8B0000';
        ctx.fillRect(enemy.x, enemy.y, ENEMY_SIZE, ENEMY_SIZE);
        
        // Enemy eyes
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(enemy.x + 4, enemy.y + 4, 4, 4);
        ctx.fillRect(enemy.x + 16, enemy.y + 4, 4, 4);
        
        ctx.fillStyle = '#000000';
        ctx.fillRect(enemy.x + 6, enemy.y + 6, 2, 2);
        ctx.fillRect(enemy.x + 18, enemy.y + 6, 2, 2);
      }
    });

    // Draw Mario
    const mario = gameState.mario;
    ctx.fillStyle = '#FF0000'; // Red hat/shirt
    ctx.fillRect(mario.x, mario.y, MARIO_SIZE, MARIO_SIZE/2);
    
    ctx.fillStyle = '#0000FF'; // Blue overalls
    ctx.fillRect(mario.x, mario.y + MARIO_SIZE/2, MARIO_SIZE, MARIO_SIZE/2);
    
    // Mario face
    ctx.fillStyle = '#FFDBAC';
    ctx.fillRect(mario.x + 8, mario.y + 8, 16, 16);
    
    // Mario eyes
    ctx.fillStyle = '#000000';
    ctx.fillRect(mario.x + 10, mario.y + 12, 2, 2);
    ctx.fillRect(mario.x + 20, mario.y + 12, 2, 2);
    
    // Mario mustache
    ctx.fillRect(mario.x + 12, mario.y + 16, 8, 2);

    // Draw UI
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 20px Arial';
    ctx.fillText(`Score: ${gameState.score}`, 10, 30);
    ctx.fillText(`Lives: ${gameState.lives}`, 10, 60);
    
    // Draw controls hint
    ctx.font = '14px Arial';
    ctx.fillStyle = '#333333';
    ctx.fillText('Touch: Left/Right/Center(Jump) or Arrow Keys/WASD', 10, CANVAS_HEIGHT - 10);

    if (gameState.gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
      ctx.font = 'bold 24px Arial';
      ctx.fillText(`Final Score: ${gameState.score}`, CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 50);
    }

    if (gameState.gameWon) {
      ctx.fillStyle = 'rgba(0, 255, 0, 0.7)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('YOU WIN!', CANVAS_WIDTH/2, CANVAS_HEIGHT/2);
      ctx.font = 'bold 24px Arial';
      ctx.fillText(`Final Score: ${gameState.score}`, CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 50);
    }

    ctx.textAlign = 'left';
  }, [gameState]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="border-4 border-black rounded-lg bg-blue-200 max-w-full"
      style={{ touchAction: 'none' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    />
  );
};
