import styles from './Background.module.css';

export default function Background() {
  return (
    <div className={styles.background}>
      <div className={styles.patternOverlay} />
      <div className={styles.orb1} />
      <div className={styles.orb2} />
      <div className={styles.orb3} />
    </div>
  );
}
