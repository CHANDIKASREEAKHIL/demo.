import React, { useState, useEffect } from "react";
import styles from "./games.module.css";
import LoginHeader from "../header/LoginHeader";

const SlidingPuzzle = () => {
  const [board, setBoard] = useState([]);
  const [emptyTile, setEmptyTile] = useState(15);

  useEffect(() => {
    initializeBoard();
  }, []);

  const initializeBoard = () => {
    const tiles = Array.from({ length: 16 }, (_, index) => index);
    const shuffledTiles = shuffle(tiles);
    setBoard(shuffledTiles);
    setEmptyTile(shuffledTiles.indexOf(15));
  };

  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleTileClick = (index) => {
    if (canMove(index)) {
      const newBoard = [...board];
      newBoard[emptyTile] = newBoard[index];
      newBoard[index] = 15;
      setBoard(newBoard);
      setEmptyTile(index);
    }
  };

  const canMove = (index) => {
    const emptyRow = Math.floor(emptyTile / 4);
    const emptyCol = emptyTile % 4;
    const row = Math.floor(index / 4);
    const col = index % 4;
    return (
      (Math.abs(emptyRow - row) === 1 && emptyCol === col) ||
      (Math.abs(emptyCol - col) === 1 && emptyRow === row)
    );
  };

  const restartGame = () => {
    initializeBoard();
  };

  return (
    <div className={styles.mainDiv}>
      <LoginHeader />
      <div >
        <div className={styles["sliding-puzzle"]} style={{marginBottom:"5vh"}}>
          <div className={styles["puzzle-board"]}>
            {board.map((tile, index) => (
              <div
                key={index}
                className={`${styles.tile} ${tile === 15 ? styles["tile-empty"] : ""}`}
                onClick={() => handleTileClick(index)}
              >
                {tile !== 15 ? tile + 1 : ""}
              </div>
            ))}
          </div>
        </div>
          <button className={styles.gameButton} onClick={restartGame}>
            Restart
          </button>
      </div>
    </div>
  );
};

export default SlidingPuzzle;
