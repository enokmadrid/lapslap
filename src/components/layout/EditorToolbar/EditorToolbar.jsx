'use client';

import { motion, AnimatePresence } from 'framer-motion';
import styles from './EditorToolbar.module.css';

export default function EditorToolbar({ onClear, onShuffle, onExport, isVisible }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={styles.toolbar}
          initial={{ opacity: 0, y: 8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
          {/* Left: Clear & Shuffle */}
          <div className={styles.leftActions}>
            <button className={styles.toolbarButton} onClick={onClear} title="Clear canvas">
              <span className={styles.toolbarIcon}>
                <svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.75 0.75V1.5H0.75V3H1.5V10.5C1.5 10.8978 1.65804 11.2794 1.93934 11.5607C2.22064 11.842 2.60218 12 3 12H8.25C8.64782 12 9.02936 11.842 9.31066 11.5607C9.59196 11.2794 9.75 10.8978 9.75 10.5V3H10.5V1.5H7.5V0.75H3.75ZM3 3H9.75V10.5H3V3ZM4.5 4.5V9H6V4.5H4.5ZM7.5 4.5V9H9V4.5H7.5Z" fill="white" fillOpacity="0.9"/>
                </svg>
              </span>
              <span>Clear</span>
            </button>
            <button className={styles.toolbarButton} onClick={onShuffle} title="Shuffle stickers">
              <span className={styles.toolbarIcon}>
                <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.5 0L13 2.5L10.5 5M10.5 7L13 9.5L10.5 12M1 2.5H4C5.5 2.5 6.5 3.5 7 5C7.5 6.5 8.5 9.5 10 9.5H13M1 9.5H4C5.5 9.5 6.5 8.5 7 7C7.5 5.5 8.5 2.5 10 2.5H13" stroke="white" strokeOpacity="0.9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </span>
              <span>Shuffle</span>
            </button>
          </div>

          {/* Right: Export */}
          <button className={styles.exportButton} onClick={onExport} title="Export as PNG">
            <span className={styles.exportIcon}>
              <svg viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 10V13C1 13.5523 1.44772 14 2 14H10C10.5523 14 11 13.5523 11 13V10M6 1V10M6 1L3 4M6 1L9 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span>Export</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
