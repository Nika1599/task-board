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
      setBoardId(""); // Очищаємо поле ID після пошуку
    }
  };

  const handleCreateBoard = () => {
    if (boardName.trim()) {
      dispatch(createBoard(boardName.trim()));
      setBoardName(""); // Очищаємо поле після створення
    }
  };

  const handleCopyId = () => {
    if (board?._id) {
      navigator.clipboard.writeText(board._id);
      alert("ID скопійовано!");
    }
  };

  const handleGoBack = () => {
    setBoardId(""); // Очищаємо поле ID дошки
    setBoardName(""); // Очищаємо поле для назви нової дошки
    dispatch(resetBoard());
  };

  // Функція обробки натискання клавіші Enter
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
      {/* Заголовок "Керування Дошками" відображається тільки якщо дошка не існує */}
      {!board && <h3 className={styles.header}>Керування Дошками</h3>}

      {/* Якщо дошки ще немає, показуємо поле для пошуку */}
      {!board && (
        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="Введіть ID дошки"
            value={boardId}
            onChange={(e) => setBoardId(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, handleFetchBoard)} // Додаємо обробник для Enter
            className={styles.inputField}
          />
          <button
            onClick={handleFetchBoard}
            className={styles.button}
            onKeyDown={(e) => handleKeyDown(e, handleFetchBoard)} // Обробник для кнопки
          >
            🔍 Знайти
          </button>
        </div>
      )}

      {/* Повідомлення про стан */}
      {loading && <p className={styles.loadingMessage}>Завантаження...</p>}
      {error && <p className={styles.errorMessage}>{error}</p>}

      {/* Відображення знайденої або створеної дошки */}
      {board && (
        <div className={styles.boardInfo}>
          <h3 className={styles.boardName}>Дошка: {board.name}</h3>
          <p className={styles.boardId}>
            ID: <span>{board._id}</span>
            <button onClick={handleCopyId} className={styles.copyButton}>
              📋 Копіювати
            </button>
          </p>
          {/* Кнопка для повернення назад */}
          <button onClick={handleGoBack} className={styles.goBackButton}>
            ↩️ Повернення назад
          </button>
        </div>
      )}

      {/* Поле створення нової дошки (завжди доступне, тільки якщо дошки ще немає) */}
      {!board && (
        <div className={styles.inputGroup}>
          <input
            type="text"
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, handleCreateBoard)} // Додаємо обробник для Enter
            placeholder="Введіть назву нової дошки"
            className={styles.inputField}
          />
          <button
            onClick={handleCreateBoard}
            className={styles.button}
            onKeyDown={(e) => handleKeyDown(e, handleCreateBoard)} // Обробник для кнопки
          >
            ➕ Створити
          </button>
        </div>
      )}
    </div>
  );
};

export default BoardList;
