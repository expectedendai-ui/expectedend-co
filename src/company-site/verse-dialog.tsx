import * as React from "react";
import styles from "./style.module.css";

type VerseDialogProps = {
  onClose: () => void;
};

export function VerseDialog({ onClose }: VerseDialogProps) {
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const openerRef = React.useRef<HTMLElement | null>(null);
  const titleId = React.useId();
  const verseId = React.useId();

  React.useEffect(() => {
    openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    closeRef.current?.focus();

    return () => openerRef.current?.focus();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className={styles.verseDialog}
      aria-labelledby={titleId}
      aria-describedby={verseId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={styles.verseDialogInner}>
        <div className={styles.verseDialogHead}>
          <div>
            <p>King James Version</p>
            <h2 id={titleId}>Jeremiah 29:11</h2>
          </div>
          <button ref={closeRef} type="button" aria-label="Close Bible verse" onClick={onClose}>×</button>
        </div>
        <blockquote id={verseId}>
          <sup>11</sup> For I know the thoughts that I think toward you, saith the Lord, thoughts of peace, and not of evil, to give you an expected end.
        </blockquote>
      </div>
    </dialog>
  );
}
