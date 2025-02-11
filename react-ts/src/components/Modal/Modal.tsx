import React, { useState, useEffect } from "react";
import styles from "./Modal.module.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, description?: string) => void; // description - опціонально
  onCancel?: () => void;
  title: string;
  buttonLabel: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onCancel,
  title,
  buttonLabel,
}) => {
  const [inputTitle, setInputTitle] = useState(""); // Стан для введення заголовка картки
  const [inputDescription, setInputDescription] = useState(""); // Стан для введення опису картки

  useEffect(() => {
    // Обробник для натискання клавіші Escape
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    // Додаємо обробник події для клавіші Escape, коли модальне вікно відкрите
    if (isOpen) {
      window.addEventListener("keydown", handleEscapeKey);
    }

    // При закритті модального вікна видаляємо обробник
    return () => {
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    // Перевіряємо заголовок тільки для створення картки
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
          {/* Якщо це не модальне вікно для видалення картки, показуємо поля для заголовка і опису */}
          {title !== "Видалити картку?" && (
            <>
              <input
                type="text"
                placeholder="Заголовок картки"
                value={inputTitle}
                onChange={(e) => setInputTitle(e.target.value)} // Оновлення заголовка
              />
              <textarea
                placeholder="Опис картки"
                value={inputDescription}
                onChange={(e) => setInputDescription(e.target.value)} // Оновлення опису
              />
            </>
          )}
        </div>
        <div className={styles.buttons}>
          {/* Кнопка підтвердження */}
          <button className={styles.confirmButton} onClick={handleSubmit}>
            {buttonLabel}
          </button>
          {/* Кнопка скасування, тільки для модального вікна видалення */}
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
