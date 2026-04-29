import styles from "./SucessBookModal.module.css"
import {useModal} from "../../Contexts/ModalContext.ts";

function SuccessBookModal() {
  const {modalOptions, closeModal} = useModal()
  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div className={styles.iconWrap}>
          <svg className={styles.icon} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="24" className={styles.iconCircle} />
            <path
              d="M14 24.5L21 31.5L34 17"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h2 className={styles.title}>Книгу успішно додано</h2>
        <p className={styles.subtitle}>Книга тепер доступна в каталозі</p>

        <div className={styles.actions}>
          <button className={styles.btnSecondary} onClick={() => {
            modalOptions.onAddAnother?.()
            closeModal()
          }}>
            Додати ще одну
          </button>
          <button className={styles.btnPrimary} onClick={() => {
            closeModal()
            modalOptions.onCheckAddedPage?.()
          }} >
            Переглянути створену
          </button>
        </div>
      </div>
    </div>
  )
}

export default SuccessBookModal