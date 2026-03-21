'use client';

import { motion, AnimatePresence } from 'framer-motion';
import styles from './Toast.module.css';

export default function Toast({ message, isVisible }) {
  return (
    <div className={styles.toastContainer}>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={styles.toast}
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
