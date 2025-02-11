import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createBoard, fetchBoard, resetBoard } from "../store/boardSlice";
import { RootState, AppDispatch } from "../store/store";
import styles from "./BoardList.module.css";

const BoardList = () => {
  const [boardId, setBoardId] = useState<string>("");
  const [boardName, setBoardName] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();

  const { board, loading, error } = useSelector(
    (state: RootState) => state.board
  );

  const handleFetchBoard = () => {
    if (boardId.trim()) {
      dispatch(fetchBoard(boardId.trim()));
      setBoardId("");
    }
  };

  const handleCreateBoard = () => {
    if (boardName.trim()) {
      dispatch(createBoard(boardName.trim()));
      setBoardName("");
    }
  };

  const handleCopyId = () => {
    if (board?._id) {
      navigator.clipboard.writeText(board._id);
      alert("ID скопійовано!");
    }
  };

  const handleGoBack = () => {
    setBoardId("");
    setBoardName("");
    dispatch(resetBoard());
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    action: () => void
  ) => {
    if (event.key === "Enter") {
      action();
    }
  };

  return (
    <div className={styles.boardList}>
      {!board && <h3 className={styles.header}>Керування Дошками</h3>}
      {!board && (
        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="Введіть ID дошки"
            value={boardId}
            onChange={(e) => setBoardId(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, handleFetchBoard)}
            className={styles.inputField}
          />
          <button
            onClick={handleFetchBoard}
            className={styles.button}
            onKeyDown={(e) => handleKeyDown(e, handleFetchBoard)}
          >
            🔍 Знайти
          </button>
        </div>
      )}

      {loading && <p className={styles.loadingMessage}>Завантаження...</p>}
      {error && <p className={styles.errorMessage}>{error}</p>}

      {board && (
        <div className={styles.boardInfo}>
          <h3 className={styles.boardName}>Дошка: {board.name}</h3>
          <p className={styles.boardId}>
            ID: <span>{board._id}</span>
            <button onClick={handleCopyId} className={styles.copyButton}>
              📋 Копіювати
            </button>
          </p>

          <button onClick={handleGoBack} className={styles.goBackButton}>
            ↩️ Повернення назад
          </button>
        </div>
      )}

      {!board && (
        <div className={styles.inputGroup}>
          <input
            type="text"
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, handleCreateBoard)}
            placeholder="Введіть назву нової дошки"
            className={styles.inputField}
          />
          <button
            onClick={handleCreateBoard}
            className={styles.button}
            onKeyDown={(e) => handleKeyDown(e, handleCreateBoard)}
          >
            ➕ Створити
          </button>
        </div>
      )}
    </div>
  );
};

export default BoardList;
