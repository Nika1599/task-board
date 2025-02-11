import { Card } from "../types/types";
import styles from "./BoardCard.module.css";

interface BoardCardProps {
  card: Card;
}

const BoardCard: React.FC<BoardCardProps> = ({ card }) => {
  return (
    <div className={styles.boardCard}>
      <h4>{card.title}</h4>
      <p>{card.description}</p>
    </div>
  );
};

export default BoardCard;
