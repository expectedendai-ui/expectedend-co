import * as React from "react";
import styles from "./style.module.css";

type BioDialogProps = {
  projectName: string;
  onClose: () => void;
};

export function BioDialog({ projectName, onClose }: BioDialogProps) {
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const openerRef = React.useRef<HTMLElement | null>(null);
  const titleId = React.useId();

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
      className={styles.bioDialog}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={styles.bioDialogInner}>
        <div className={styles.bioDialogHead}>
          <h2 id={titleId}>{projectName} bio</h2>
          <button ref={closeRef} type="button" aria-label="Close bio" onClick={onClose}>×</button>
        </div>
        <div className={styles.bioBlank} aria-hidden="true" />
      </div>
    </dialog>
  );
}
