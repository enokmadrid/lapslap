'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Shuffle, Download } from 'lucide-react';
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
                <Trash2 size={16} />
              </span>
              <span>Clear</span>
            </button>
            <button className={styles.toolbarButton} onClick={onShuffle} title="Shuffle stickers">
              <span className={styles.toolbarIcon}>
                <Shuffle size={16} />
              </span>
              <span>Shuffle</span>
            </button>
          </div>

          {/* Right: Export */}
          <button className={styles.exportButton} onClick={onExport} title="Export as PNG">
            <span className={styles.exportIcon}>
              <Download size={16} />
            </span>
            <span>Export</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
