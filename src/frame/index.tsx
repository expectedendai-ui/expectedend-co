import styles from "./style.module.css";

export function Frame() {
  return (
    <header className={`frame ${styles.frame}`}>
      <h1 className={styles.frame__title}>Denzel Rigaud</h1>
      <a className={styles.frame__back} href="https://mybiblelens.us">
        MyBibleLens
      </a>
      <a className={styles.frame__archive} href="https://www.instagram.com/smiledenzel/">
        Instagram
      </a>
      <a className={styles.frame__github} href="https://www.tiktok.com/@smiledenzel">
        TikTok
      </a>
      <a className={styles.frame__linkedin} href="https://www.linkedin.com/feed/">
        LinkedIn
      </a>
      <a className={styles.frame__snapchat} href="https://snapchat.com/t/NsQxXMoF">
        Snapchat
      </a>
      <div className={styles.frame__credits}>
        <span>Made by </span>
        <a href="https://mybiblelens.us">Denzel · ExpectedEnd</a>
      </div>
      <nav className={styles.frame__tags}>
        <a href="https://mybiblelens.us">#believer</a>
        <a href="https://mybiblelens.us">#mybiblelens</a>
        <a href="https://mybiblelens.us/legal.html#about">#scriptoriumdigital</a>
      </nav>
    </header>
  );
}
