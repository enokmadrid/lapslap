'use client';

import { motion } from 'framer-motion';
import useCanvasStore from '@/hooks/useCanvasStore';
import styles from './FloatingToolbar.module.css';

export default function FloatingToolbar({ sticker, canvasRect }) {
  const { bringForward, sendBackward, duplicateSticker, removeSticker } = useCanvasStore();

  if (!sticker || !canvasRect) return null;

  // Position toolbar below the sticker to avoid rotation handle
  const toolbarWidth = 180;
  const toolbarX = sticker.x + sticker.width / 2 - toolbarWidth / 2;
  const toolbarY = sticker.y + sticker.height + 24;

  return (
    <motion.div
      className={styles.toolbar}
      style={{
        left: toolbarX,
        top: toolbarY,
      }}
      initial={{ scale: 0.85, opacity: 0, y: 8 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.85, opacity: 0, y: 8 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    >
      <button
        className={styles.action}
        onClick={() => bringForward(sticker.id)}
        title="Bring Forward"
      >
        ↑
      </button>
      <button
        className={styles.action}
        onClick={() => sendBackward(sticker.id)}
        title="Send Backward"
      >
        ↓
      </button>

      <div className={styles.divider} />

      <button
        className={styles.action}
        onClick={() => duplicateSticker(sticker.id)}
        title="Duplicate"
      >
        ⧉
      </button>
      <button
        className={`${styles.action} ${styles.deleteAction}`}
        onClick={() => removeSticker(sticker.id)}
        title="Delete"
      >
        🗑
      </button>
    </motion.div>
  );
}
