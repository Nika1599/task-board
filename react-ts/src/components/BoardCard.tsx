import { useState } from "react";
import { Card } from "../types/types";
import styles from "./BoardCard.module.css";
import { useDispatch } from "react-redux";
import { updateCard, deleteCard } from "../store/cardSlice";
import { AppDispatch } from "../store/store";

interface BoardCardProps {
  card: Card;
}

const BoardCard: React.FC<BoardCardProps> = ({ card }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    if (title.trim() === "") {
      alert("Заголовок є обов'язковим");
      return;
    }
    dispatch(
      updateCard({
        cardId: card._id,
        updates: { title, description },
      })
    );
    setIsEditing(false); // вимикаємо режим редагування
  };

  const handleCancelClick = () => {
    setIsEditing(false); // скидаємо зміни і вимикаємо режим редагування
    setTitle(card.title);
    setDescription(card.description);
  };

  const handleDeleteClick = () => {
    dispatch(deleteCard(card._id)); // Видалити картку через Redux
  };

  return (
    <div className={styles.boardCard}>
      {isEditing ? (
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.cardTitleInput}
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.cardDescriptionInput}
          />
          <button onClick={handleSaveClick} className={styles.saveButton}>
            Зберегти
          </button>
          <button onClick={handleCancelClick} className={styles.cancelButton}>
            Скасувати
          </button>
        </div>
      ) : (
        <div>
          <h4>{title}</h4>
          <p>{description}</p>
          <button onClick={handleEditClick} className={styles.editButton}>
            Редагувати
          </button>
          <button onClick={handleDeleteClick} className={styles.deleteButton}>
            Видалити
          </button>
        </div>
      )}
    </div>
  );
};

export default BoardCard;
