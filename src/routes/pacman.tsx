import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useTheme } from "../components/theme";

const GameContainer = styled.div<{ darkMode: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: ${(props) => (props.darkMode ? "#1e1e1e" : "#000")};
  padding: 20px;
`;

const Canvas = styled.canvas<{ darkMode: boolean }>`
  border: 2px solid ${(props) => (props.darkMode ? "#3e3e3e" : "#333")};
  background-color: #000;
`;

const ScoreBoard = styled.div<{ darkMode: boolean }>`
  color: ${(props) => (props.darkMode ? "white" : "white")};
  font-size: 24px;
  margin-bottom: 20px;
  font-family: 'Courier New', monospace;
`;

const Instructions = styled.div<{ darkMode: boolean }>`
  color: ${(props) => (props.darkMode ? "#aaa" : "#ccc")};
  font-size: 14px;
  margin-top: 20px;
  text-align: center;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: #000;
`;

const LoadingText = styled.div`
  color: #ffff00;
  font-size: 32px;
  font-family: 'Courier New', monospace;
  margin-top: 40px;
`;

const LoadingAnimation = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const PacmanLoaderWrapper = styled.div`
  position: relative;
  width: 60px;
  height: 60px;
`;

const PacmanLoader = styled.div`
  width: 60px;
  height: 60px;
  background: #ffff00;
  border-radius: 50%;
  position: relative;
  animation: pacman-chomp 0.5s ease-in-out infinite;

  @keyframes pacman-chomp {
    0%, 100% {
      clip-path: polygon(50% 50%, 100% 35%, 100% 0%, 0% 0%, 0% 100%, 100% 100%, 100% 65%);
    }
    50% {
      clip-path: polygon(50% 50%, 100% 48%, 100% 0%, 0% 0%, 0% 100%, 100% 100%, 100% 52%);
    }
  }
`;

const Dot = styled.div<{ delay: number }>`
  width: 12px;
  height: 12px;
  background-color: #fff;
  border-radius: 50%;
  animation: dot-fade 1.5s ease-in-out ${props => props.delay}s infinite;

  @keyframes dot-fade {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0;
      transform: scale(0);
    }
  }
`;

const CELL_SIZE = 20;
const ROWS = 20;
const COLS = 28;

// 미로 맵 (0: 벽, 1: 점, 2: 빈 공간, 3: 파워 펠렛)
const MAZE = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
  [0,3,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,3,0],
  [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
  [0,1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0],
  [0,1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0],
  [0,1,1,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,1,1,0],
  [0,0,0,0,0,0,1,0,0,0,0,0,2,0,0,2,0,0,0,0,0,1,0,0,0,0,0,0],
  [2,2,2,2,2,0,1,0,0,0,0,0,2,0,0,2,0,0,0,0,0,1,0,2,2,2,2,2],
  [0,0,0,0,0,0,1,0,0,2,2,2,2,2,2,2,2,2,2,0,0,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,2,0,2,2,2,2,2,0,0,2,0,0,1,0,0,0,0,0,0],
  [2,2,2,2,2,2,1,2,2,2,0,2,2,2,2,2,2,0,2,2,2,1,2,2,2,2,2,2],
  [0,0,0,0,0,0,1,0,0,2,0,2,2,2,2,2,2,0,2,0,0,1,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,2,0,0,0,0,0,0,0,0,2,0,0,1,0,0,0,0,0,0],
  [0,3,1,1,0,0,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,0,0,1,1,3,0],
  [0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0],
  [0,1,1,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,1,1,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

interface Position {
  x: number;
  y: number;
}

interface Ghost {
  id: number;
  position: Position;
  color: string;
  direction: Position;
  vulnerable: boolean;
}

const PacmanGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { darkMode } = useTheme();
  const [score, setScore] = useState(0);
  const [pacman, setPacman] = useState<Position>({ x: 1, y: 1 });
  const [direction, setDirection] = useState<Position>({ x: 0, y: 0 });
  const [maze, setMaze] = useState(() => {
    const initialMaze = MAZE.map(row => [...row]);
    initialMaze[1][1] = 2; // Clear the starting position
    return initialMaze;
  });
  const [mouthOpen, setMouthOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [ghosts, setGhosts] = useState<Ghost[]>([
    { id: 1, position: { x: 12, y: 12 }, color: "#ff0000", direction: { x: 1, y: 0 }, vulnerable: false },
    { id: 2, position: { x: 15, y: 12 }, color: "#ffb8ff", direction: { x: -1, y: 0 }, vulnerable: false },
    { id: 3, position: { x: 13, y: 13 }, color: "#00ffff", direction: { x: 0, y: -1 }, vulnerable: false },
    { id: 4, position: { x: 14, y: 13 }, color: "#ffb852", direction: { x: 0, y: 1 }, vulnerable: false },
  ]);
  const [powerMode, setPowerMode] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          setDirection({ x: 0, y: -1 });
          break;
        case "ArrowDown":
          setDirection({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
          setDirection({ x: -1, y: 0 });
          break;
        case "ArrowRight":
          setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      setPacman((prev) => {
        const newX = prev.x + direction.x;
        const newY = prev.y + direction.y;

        // 벽 충돌 체크
        if (
          newX < 0 ||
          newX >= COLS ||
          newY < 0 ||
          newY >= ROWS ||
          maze[newY][newX] === 0
        ) {
          return prev;
        }

        // 점 먹기
        if (maze[newY][newX] === 1) {
          setScore((s) => s + 10);
          setMaze((m) => {
            const newMaze = m.map(row => [...row]);
            newMaze[newY][newX] = 2;
            return newMaze;
          });
        }

        // 파워 펠렛 먹기
        if (maze[newY][newX] === 3) {
          setScore((s) => s + 50);
          setPowerMode(true);
          setGhosts((g) => g.map(ghost => ({ ...ghost, vulnerable: true })));
          setMaze((m) => {
            const newMaze = m.map(row => [...row]);
            newMaze[newY][newX] = 2;
            return newMaze;
          });
          setTimeout(() => {
            setPowerMode(false);
            setGhosts((g) => g.map(ghost => ({ ...ghost, vulnerable: false })));
          }, 6000);
        }

        return { x: newX, y: newY };
      });

      setMouthOpen((m) => !m);
    }, 200);

    return () => clearInterval(gameLoop);
  }, [direction, maze]);

  // Ghost movement
  useEffect(() => {
    const ghostLoop = setInterval(() => {
      setGhosts((prevGhosts) =>
        prevGhosts.map((ghost) => {
          const possibleDirections: Position[] = [
            { x: 1, y: 0 },
            { x: -1, y: 0 },
            { x: 0, y: 1 },
            { x: 0, y: -1 },
          ];

          // Filter valid directions
          const validDirections = possibleDirections.filter((dir) => {
            const newX = ghost.position.x + dir.x;
            const newY = ghost.position.y + dir.y;
            return (
              newX >= 0 &&
              newX < COLS &&
              newY >= 0 &&
              newY < ROWS &&
              MAZE[newY][newX] !== 0
            );
          });

          // Choose direction (random for now, but prefer continuing in current direction)
          let newDirection = ghost.direction;
          const canContinue = validDirections.some(
            (dir) => dir.x === ghost.direction.x && dir.y === ghost.direction.y
          );

          if (!canContinue || Math.random() < 0.1) {
            newDirection = validDirections[Math.floor(Math.random() * validDirections.length)] || ghost.direction;
          }

          const newX = ghost.position.x + newDirection.x;
          const newY = ghost.position.y + newDirection.y;

          // Check if position is valid
          if (
            newX >= 0 &&
            newX < COLS &&
            newY >= 0 &&
            newY < ROWS &&
            MAZE[newY][newX] !== 0
          ) {
            return {
              ...ghost,
              position: { x: newX, y: newY },
              direction: newDirection,
            };
          }

          return ghost;
        })
      );
    }, 300);

    return () => clearInterval(ghostLoop);
  }, []);

  // Collision detection
  useEffect(() => {
    ghosts.forEach((ghost) => {
      if (ghost.position.x === pacman.x && ghost.position.y === pacman.y) {
        if (ghost.vulnerable) {
          // Eat ghost - send back to ghost house
          setScore((s) => s + 200);
          setGhosts((g) => g.map((currentGhost) =>
            currentGhost.id === ghost.id
              ? {
                  ...currentGhost,
                  position: {
                    x: currentGhost.id <= 2 ? (currentGhost.id === 1 ? 12 : 15) : (currentGhost.id === 3 ? 13 : 14),
                    y: currentGhost.id <= 2 ? 12 : 13
                  },
                  vulnerable: false
                }
              : currentGhost
          ));
        } else {
          // Game over - reset
          setPacman({ x: 1, y: 1 });
          setDirection({ x: 0, y: 0 });
          setScore(0);
          setMaze(() => {
            const newMaze = MAZE.map(row => [...row]);
            newMaze[1][1] = 2;
            return newMaze;
          });
          setGhosts([
            { id: 1, position: { x: 12, y: 12 }, color: "#ff0000", direction: { x: 1, y: 0 }, vulnerable: false },
            { id: 2, position: { x: 15, y: 12 }, color: "#ffb8ff", direction: { x: -1, y: 0 }, vulnerable: false },
            { id: 3, position: { x: 13, y: 13 }, color: "#00ffff", direction: { x: 0, y: -1 }, vulnerable: false },
            { id: 4, position: { x: 14, y: 13 }, color: "#ffb852", direction: { x: 0, y: 1 }, vulnerable: false },
          ]);
        }
      }
    });
  }, [pacman, ghosts]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, COLS * CELL_SIZE, ROWS * CELL_SIZE);

    // Draw maze
    maze.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === 0) {
          // 벽
          ctx.fillStyle = "#0000ff";
          ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        } else if (cell === 1) {
          // 점
          ctx.fillStyle = "#fff";
          ctx.beginPath();
          ctx.arc(
            x * CELL_SIZE + CELL_SIZE / 2,
            y * CELL_SIZE + CELL_SIZE / 2,
            2,
            0,
            Math.PI * 2
          );
          ctx.fill();
        } else if (cell === 3) {
          // 파워 펠렛
          ctx.fillStyle = "#fff";
          ctx.beginPath();
          ctx.arc(
            x * CELL_SIZE + CELL_SIZE / 2,
            y * CELL_SIZE + CELL_SIZE / 2,
            5,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
      });
    });

    // Draw Pacman
    ctx.fillStyle = "#ffff00";
    ctx.beginPath();

    const angle = direction.x > 0 ? 0 : direction.x < 0 ? Math.PI : direction.y > 0 ? Math.PI / 2 : direction.y < 0 ? -Math.PI / 2 : 0;
    const mouthAngle = mouthOpen ? 0.2 : 0.05;

    ctx.arc(
      pacman.x * CELL_SIZE + CELL_SIZE / 2,
      pacman.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2 - 2,
      angle + mouthAngle * Math.PI,
      angle - mouthAngle * Math.PI
    );
    ctx.lineTo(
      pacman.x * CELL_SIZE + CELL_SIZE / 2,
      pacman.y * CELL_SIZE + CELL_SIZE / 2
    );
    ctx.fill();

    // Draw Ghosts
    ghosts.forEach((ghost) => {
      const x = ghost.position.x * CELL_SIZE + CELL_SIZE / 2;
      const y = ghost.position.y * CELL_SIZE + CELL_SIZE / 2;
      const radius = CELL_SIZE / 2 - 2;

      // Ghost body
      ctx.fillStyle = ghost.vulnerable ? "#0000ff" : ghost.color;
      ctx.beginPath();
      ctx.arc(x, y - radius / 2, radius, Math.PI, 0, false);
      ctx.lineTo(x + radius, y + radius);
      ctx.lineTo(x + radius * 0.66, y + radius * 0.66);
      ctx.lineTo(x + radius * 0.33, y + radius);
      ctx.lineTo(x, y + radius * 0.66);
      ctx.lineTo(x - radius * 0.33, y + radius);
      ctx.lineTo(x - radius * 0.66, y + radius * 0.66);
      ctx.lineTo(x - radius, y + radius);
      ctx.closePath();
      ctx.fill();

      // Ghost eyes
      if (!ghost.vulnerable) {
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(x - radius / 3, y - radius / 3, radius / 4, 0, Math.PI * 2);
        ctx.arc(x + radius / 3, y - radius / 3, radius / 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.arc(x - radius / 3, y - radius / 3, radius / 6, 0, Math.PI * 2);
        ctx.arc(x + radius / 3, y - radius / 3, radius / 6, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }, [pacman, maze, mouthOpen, direction, ghosts]);

  if (loading) {
    return (
      <LoadingContainer>
        <LoadingAnimation>
          <PacmanLoaderWrapper>
            <PacmanLoader />
          </PacmanLoaderWrapper>
          <Dot delay={0} />
          <Dot delay={0.2} />
          <Dot delay={0.4} />
        </LoadingAnimation>
        <LoadingText>LOADING...</LoadingText>
      </LoadingContainer>
    );
  }

  return (
    <GameContainer darkMode={darkMode}>
      <ScoreBoard darkMode={darkMode}>Score: {score}</ScoreBoard>
      <Canvas
        ref={canvasRef}
        width={COLS * CELL_SIZE}
        height={ROWS * CELL_SIZE}
        darkMode={darkMode}
      />
      <Instructions darkMode={darkMode}>
        Use Arrow Keys to move Pacman
      </Instructions>
    </GameContainer>
  );
};

export default PacmanGame;
