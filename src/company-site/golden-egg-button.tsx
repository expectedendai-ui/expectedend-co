import styles from "./style.module.css";

type GoldenEggButtonProps = {
  onActivate: () => void;
};

export function GoldenEggButton({ onActivate }: GoldenEggButtonProps) {
  return (
    <button className={styles.eggButton} type="button" aria-label="Enter the hidden art world" onClick={onActivate}>
      <img src="/brand/golden-egg.png" alt="" width="25" height="25" />
    </button>
  );
}
