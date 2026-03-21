'use client';

import Image from 'next/image';
import { Folder, Sparkles, User } from 'lucide-react';
import styles from './NavBar.module.css';

export default function NavBar() {
  return (
    <nav className={`${styles.nav}`}>
      <div className={styles.left}>
        <div className={styles.logo}>
          <Image
            src="/lapslaps_logo.svg"
            alt="LAPSLAPS Logo"
            width={151}
            height={48}
            priority
          />
        </div>
      </div>

      <div className={styles.center}>
        <button className={`${styles.navLink} ${styles.navLinkActive}`}>
          <span className={styles.navIcon}>
            <Folder size={16} />
          </span>
          My Slaps
        </button>
        <button className={styles.navLink}>
          <span className={styles.navIcon}>
            <Sparkles size={16} />
          </span>
          Trending
        </button>
      </div>

      <div className={styles.right}>
        <button className={styles.profileButton} title="User Profile">
          <User size={20} />
        </button>
      </div>
    </nav>
  );
}
