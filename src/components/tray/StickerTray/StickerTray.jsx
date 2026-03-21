'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CATEGORIES, STICKERS } from '@/lib/constants';
import styles from './StickerTray.module.css';

export default function StickerTray({ onStickerDragStart, onExpand }) {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredStickers = activeCategory === 'all'
    ? STICKERS
    : STICKERS.filter(s => s.category === activeCategory);

  return (
    <div className={`${styles.tray} glass`}>
      {/* Category tabs + expand */}
      <div className={styles.headerRow}>
        <div className={styles.categories}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`${styles.chip} ${
                activeCategory === cat.id ? styles.chipActive : styles.chipDefault
              }`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <button
          className={styles.expandButton}
          onClick={onExpand}
          title="Expand sticker tray"
        >
          ↗
        </button>
      </div>

      {/* Sticker rail */}
      <div className={styles.stickerRail}>
        {filteredStickers.map(sticker => (
          <motion.div
            key={sticker.id}
            className={styles.stickerThumb}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onPointerDown={(e) => onStickerDragStart?.(sticker, e)}
            title={sticker.name}
          >
            <img
              src={sticker.src}
              alt={sticker.name}
              className={styles.stickerThumbImage}
              draggable={false}
            />
          </motion.div>
        ))}

        {/* Upload tile */}
        <button className={styles.uploadTile} title="Upload custom sticker">
          <span className={styles.uploadIcon}>📤</span>
          <span>Upload</span>
        </button>
      </div>
    </div>
  );
}
