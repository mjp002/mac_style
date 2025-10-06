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
  [0,0,0,0,0,0,1,0,0,2,0,0,0,0,0,0,0,0,2,0,0,1,0,0,0,0,0,0],
  [0,1,1,1,1,1,1,1,1,2,0,2,2,2,2,2,2,0,2,1,1,1,1,1,1,1,1,0],
  [0,1,0,0,0,0,1,0,0,2,0,2,2,2,2,2,2,0,2,0,0,1,0,0,0,0,1,0],
  [0,1,0,0,0,0,1,0,0,2,0,0,0,0,0,0,0,0,2,0,0,1,0,0,0,0,1,0],
  [0,3,1,1,0,0,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,0,0,1,1,3,0],
  [0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0],
  [0,1,1,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,1,1,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];

interface Position {
  x: number;
  y: number;
}

const PacmanGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { darkMode } = useTheme();
  const [score, setScore] = useState(0);
  const [pacman, setPacman] = useState<Position>({ x: 1, y: 1 });
  const [direction, setDirection] = useState<Position>({ x: 0, y: 0 });
  const [maze, setMaze] = useState(MAZE.map(row => [...row]));
  const [mouthOpen, setMouthOpen] = useState(true);

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
        if (maze[newY][newX] === 1 || maze[newY][newX] === 3) {
          const points = maze[newY][newX] === 3 ? 50 : 10;
          setScore((s) => s + points);
          setMaze((m) => {
            const newMaze = m.map(row => [...row]);
            newMaze[newY][newX] = 2;
            return newMaze;
          });
        }

        return { x: newX, y: newY };
      });

      setMouthOpen((m) => !m);
    }, 200);

    return () => clearInterval(gameLoop);
  }, [direction, maze]);

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
  }, [pacman, maze, mouthOpen, direction]);

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
