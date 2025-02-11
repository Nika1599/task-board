import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { RootState, AppDispatch } from "../store/store";
import {
  createCard,
  fetchCards,
  updateCard,
  deleteCard,
} from "../store/cardSlice";
import { deleteBoard } from "../store/boardSlice";
import BoardCard from "./BoardCard";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import styles from "./Board.module.css";
import Modal from "./Modal/Modal";

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
  const [modalType, setModalType] = useState<
    "create" | "delete" | "deleteBoard" | null
  >(null);
  const [columnToAdd, setColumnToAdd] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [cardToDelete, setCardToDelete] = useState<string | null>(null);
  const [boardToDelete, setBoardToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (board?._id) {
      dispatch(fetchCards(board._id));
    }
  }, [board, dispatch]);

  if (!board) return null;

  const handleCreateCard = (column: string) => {
    setColumnToAdd(column);
    setModalType("create");
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
        description: description || "",
        column: columnToAdd,
      })
    );
    setIsModalOpen(false);
    setTitle("");
    setDescription("");
  };

  const handleDeleteCard = (cardId: string) => {
    setCardToDelete(cardId);
    setModalType("delete");
    setIsModalOpen(true);
  };

  const confirmDeleteCard = () => {
    if (cardToDelete) {
      dispatch(deleteCard(cardToDelete));
      setIsModalOpen(false);
      setCardToDelete(null);
    }
  };

  const cancelDeleteCard = () => {
    setIsModalOpen(false);
    setCardToDelete(null);
  };

  const handleDeleteBoard = () => {
    if (board._id) {
      dispatch(deleteBoard(board._id));
    }
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

  return (
    <div className={styles.board}>
      {boardLoading && <p>Завантаження дошки...</p>}
      {boardError && <p>{boardError}</p>}
      {cardsLoading && <p>Завантаження карток...</p>}
      {cardsError && <p>{cardsError}</p>}

      <div>
        <h3>{board.name}</h3>
        <button
          className={styles.deleteBoardButton}
          onClick={handleDeleteBoard}
        >
          Видалити дошку
        </button>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <div className={styles["board-columns"]}>
            {["ToDo", "InProgress", "Done"].map((column) => (
              <Droppable
                droppableId={column}
                key={column}
                isCombineEnabled={false}
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
                                style={provided.draggableProps.style}
                              >
                                <BoardCard card={card} />
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

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={
            modalType === "create" ? handleModalSubmit : confirmDeleteCard
          }
          onCancel={
            modalType === "delete"
              ? cancelDeleteCard
              : modalType === "deleteBoard"
              ? cancelDeleteBoard
              : undefined
          }
          title={
            modalType === "create"
              ? "Створити нову картку"
              : modalType === "delete"
              ? "Видалити картку?"
              : "Видалити дошку?"
          }
          buttonLabel={modalType === "create" ? "Створити" : "Видалити"}
        >
          {modalType === "create" && (
            <div>
              <input
                type="text"
                placeholder="Заголовок картки"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="inputField"
              />
              <textarea
                placeholder="Опис картки"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="inputField"
              />
            </div>
          )}

          {modalType === "deleteBoard" && (
            <p>Ви впевнені, що хочете видалити цю дошку?</p>
          )}
        </Modal>
      )}
    </div>
  );
};

export default Board;
