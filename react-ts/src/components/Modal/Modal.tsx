import React, { useState, useEffect } from "react";
import styles from "./Modal.module.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, description?: string) => void;
  onCancel?: () => void;
  title: string;
  buttonLabel: string;
  children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onCancel,
  title,
  buttonLabel,
}) => {
  const [inputTitle, setInputTitle] = useState("");
  const [inputDescription, setInputDescription] = useState("");

  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (title !== "Видалити картку?" && inputTitle.trim() === "") {
      alert("Заголовок є обов'язковим");
      return;
    }
    onSubmit(inputTitle, inputDescription); // передаємо введені значення
    onClose(); // закриваємо модальне вікно
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Закрити модальне вікно, якщо натиснуто на бекдроп (зовнішню область модального вікна)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <h2>{title}</h2>

        <div className={styles.form}>
          {title !== "Видалити картку?" && (
            <>
              <input
                type="text"
                placeholder="Заголовок картки"
                value={inputTitle}
                onChange={(e) => setInputTitle(e.target.value)}
              />
              <textarea
                placeholder="Опис картки"
                value={inputDescription}
                onChange={(e) => setInputDescription(e.target.value)}
              />
            </>
          )}
        </div>
        <div className={styles.buttons}>
          <button className={styles.confirmButton} onClick={handleSubmit}>
            {buttonLabel}
          </button>

          {onCancel && (
            <button className={styles.cancelButton} onClick={onCancel}>
              Скасувати
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
