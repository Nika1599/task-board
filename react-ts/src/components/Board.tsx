import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { RootState, AppDispatch } from "../store/store";
import {
  createCard,
  fetchCards,
  updateCard,
  deleteCard,
} from "../store/cardSlice";
import BoardCard from "./BoardCard";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import styles from "./Board.module.css";
import Modal from "./Modal/Modal"; // ваш компонент модального вікна

const Board: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    board,
    loading: boardLoading,
    error: boardError,
  } = useSelector((state: RootState) => state.board);
  const {
    cards,
    loading: cardsLoading,
    error: cardsError,
  } = useSelector((state: RootState) => state.card);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"create" | "delete" | null>(null); // для визначення типу модального вікна
  const [columnToAdd, setColumnToAdd] = useState<string>("");

  const [title, setTitle] = useState<string>(""); // Додано для збереження значення заголовка
  const [description, setDescription] = useState<string>(""); // Додано для збереження опису картки (необов'язково)

  const [cardToDelete, setCardToDelete] = useState<string | null>(null); // картка для видалення

  useEffect(() => {
    if (board?._id) {
      dispatch(fetchCards(board._id));
    }
  }, [board, dispatch]);

  if (!board) return null;

  const handleCreateCard = (column: string) => {
    setColumnToAdd(column);
    setModalType("create"); // Відкриваємо модальне вікно для створення картки
    setIsModalOpen(true);
  };

  const handleModalSubmit = (title: string, description?: string) => {
    if (title.trim() === "") {
      alert("Заголовок є обов'язковим");
      return;
    }

    dispatch(
      createCard({
        boardId: board._id,
        title,
        description: description || "", // Якщо description не передано, передаємо порожній рядок
        column: columnToAdd,
      })
    );
    setIsModalOpen(false); // Закрити модальне вікно після створення картки
    setTitle(""); // Очистити значення заголовка після створення
    setDescription(""); // Очистити опис після створення
  };

  const handleDeleteCard = (cardId: string) => {
    setCardToDelete(cardId);
    setModalType("delete"); // Відкриваємо модальне вікно для підтвердження видалення
    setIsModalOpen(true);
  };

  const confirmDeleteCard = () => {
    if (cardToDelete) {
      dispatch(deleteCard(cardToDelete));
      setIsModalOpen(false); // Закриваємо модальне вікно після видалення
      setCardToDelete(null); // Скидаємо картку для видалення
    }
  };

  const cancelDeleteCard = () => {
    setIsModalOpen(false); // Закриваємо модальне вікно без змін
    setCardToDelete(null); // Скидаємо картку для видалення
  };

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result;
    if (!destination) return;

    const card = cards.find((c) => c._id === draggableId);
    if (!card) return;

    const status = destination.droppableId as "ToDo" | "InProgress" | "Done";
    if (status !== card.column) {
      dispatch(updateCard({ cardId: card._id, updates: { column: status } }))
        .unwrap()
        .catch((error) =>
          alert("Помилка при оновленні картки: " + error.message)
        );
    }
  };

  // Функція для обробки натискання клавіші Enter
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement | HTMLDivElement>,
    action: () => void
  ) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Забороняємо стандартну поведінку
      action(); // Викликаємо передану функцію
    }
  };

  return (
    <div className={styles.board}>
      {boardLoading && <p>Завантаження дошки...</p>}
      {boardError && <p>{boardError}</p>}
      {cardsLoading && <p>Завантаження карток...</p>}
      {cardsError && <p>{cardsError}</p>}

      <div>
        <h3>{board.name}</h3>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <div className={styles["board-columns"]}>
            {["ToDo", "InProgress", "Done"].map((column) => (
              <Droppable
                droppableId={column}
                key={column}
                isCombineEnabled={false} // Додано для уникнення помилки
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={styles.column}
                  >
                    <h4>{column}</h4>
                    {column === "ToDo" && (
                      <button
                        className={styles.addCardButton}
                        onClick={() => handleCreateCard(column)}
                        onKeyDown={(e) =>
                          handleKeyDown(e, () => handleCreateCard(column))
                        }
                      >
                        + Додати картку
                      </button>
                    )}
                    <div className={styles.cardList}>
                      {cards
                        .filter((card) => card.column === column)
                        .map((card, index) => (
                          <Draggable
                            key={card._id}
                            draggableId={card._id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={styles.boardCard}
                              >
                                <BoardCard card={card} />
                                <button
                                  className={styles.deleteButton}
                                  onClick={() => handleDeleteCard(card._id)}
                                  onKeyDown={(e) =>
                                    handleKeyDown(e, () =>
                                      handleDeleteCard(card._id)
                                    )
                                  }
                                >
                                  Видалити
                                </button>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>

      {/* Модальне вікно для створення картки або підтвердження видалення */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={
            modalType === "create" ? handleModalSubmit : confirmDeleteCard
          }
          onCancel={modalType === "delete" ? cancelDeleteCard : undefined}
          title={
            modalType === "create" ? "Створити нову картку" : "Видалити картку?"
          }
          buttonLabel={modalType === "create" ? "Створити" : "Видалити"}
        />
      )}
    </div>
  );
};

export default Board;
