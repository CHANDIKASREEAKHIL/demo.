import React, { useState, useEffect, useRef } from "react";
import styles from "./games.module.css";
import LoginHeader from "../header/LoginHeader";

const BrickBreaker = () => {
  const [paddlePosition, setPaddlePosition] = useState(250);
  const [ballPosition, setBallPosition] = useState({ x: 290, y: 290 });
  const [ballVelocity, setBallVelocity] = useState({ dx: 2, dy: -2 });
  const [bricks, setBricks] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const gameContainerRef = useRef(null);

  useEffect(() => {
    const initializeBricks = () => {
      const rows = 5;
      const columns = 7;
      const brickWidth = 75;
      const brickHeight = 20;
      const brickPadding = 10;
      const offsetTop = 30;
      const offsetLeft = 30;
      const newBricks = [];

      for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows; r++) {
          newBricks.push({
            x: c * (brickWidth + brickPadding) + offsetLeft,
            y: r * (brickHeight + brickPadding) + offsetTop,
            status: 1,
          });
        }
      }

      setBricks(newBricks);
    };

    initializeBricks();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft" && paddlePosition > 0) {
        setPaddlePosition(paddlePosition - 20);
      } else if (e.key === "ArrowRight" && paddlePosition < 500) {
        setPaddlePosition(paddlePosition + 20);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [paddlePosition]);

  useEffect(() => {
    if (gameOver) {
      return;
    }

    const interval = setInterval(() => {
      const container = gameContainerRef.current;
      if (!container) return;

      let { x, y } = ballPosition;
      let { dx, dy } = ballVelocity;

      // Check for wall collisions
      if (x + dx > container.offsetWidth - 10 || x + dx < 0) dx = -dx;
      if (y + dy < 0) dy = -dy;

      // Check for paddle collision
      if (
        y + dy > container.offsetHeight - 30 &&
        x > paddlePosition &&
        x < paddlePosition + 100
      ) {
        dy = -dy;
      }

      // Check for brick collisions
      for (let i = 0; i < bricks.length; i++) {
        const b = bricks[i];
        if (b.status === 1) {
          if (x > b.x && x < b.x + 75 && y > b.y && y < b.y + 20) {
            dy = -dy;
            b.status = 0;
            setBricks([...bricks]);
          }
        }
      }

      // Check for game over
      if (y + dy > container.offsetHeight - 10) {
        setGameOver(true);
        clearInterval(interval); // Stop interval on game over
      }

      setBallPosition({ x: x + dx, y: y + dy });
      setBallVelocity({ dx, dy });
    }, 10);

    return () => clearInterval(interval);
  }, [ballPosition, ballVelocity, paddlePosition, bricks, gameOver]);

  const restartGame = () => {
    document.location.reload();
  };

  return (
    <div className={styles.mainDiv}>
      <LoginHeader />
      <div className={styles.innerGrid}>
        <div className={styles["game-container"]} ref={gameContainerRef}>
          <div className={styles.paddle} style={{ left: paddlePosition }}></div>
          <div
            className={styles.ball}
            style={{ left: ballPosition.x, top: ballPosition.y }}
          ></div>
           {!gameOver ? (
      <>
      {bricks.map((brick, index) =>
        brick.status === 1 ? (
          <div
            key={index}
            className={styles.brick}
            style={{ left: brick.x, top: brick.y }}
          ></div>
        ) : null,
      )}
      </>
      ) : (
        <>
        <h1> Game Over</h1>
        <button className={styles.gameButton} onClick={restartGame}>Restart</button>
        </>
      )}
        </div>
      </div>
    </div>
  );
};

export default BrickBreaker;
