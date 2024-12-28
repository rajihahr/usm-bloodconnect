import * as React from "react";
import styles from './SuccessMessage.module.css';

export function EditSuccessMessage() {
  return (
    <main className={styles.successContainer}>
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/bacbee29f2a447828cd295512902341786a4e842ded528e13067fb9ae68325fb?placeholderIfAbsent=true&apiKey=db478cca7787456a84ce8791828a32a7"
        className={styles.successIcon}
        alt="Success checkmark icon"
      />
      <p className={styles.successMessage}>
        Event has been updated successfully!
      </p>
    </main>
  );
}


