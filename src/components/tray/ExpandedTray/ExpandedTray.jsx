'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search as SearchIcon, Sticker } from 'lucide-react';
import { CATEGORIES, STICKERS } from '@/lib/constants';
import styles from './ExpandedTray.module.css';

export default function ExpandedTray({ isOpen, onClose, onStickerDragStart }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Escape key to close
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKey);
      return () => document.removeEventListener('keydown', handleKey);
    }
  }, [isOpen, onClose]);

  const filteredStickers = STICKERS.filter(s => {
    const matchesCategory = activeCategory === 'all' || s.category === activeCategory;
    const matchesSearch = !search || s.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleStickerPointerDown = useCallback((sticker, e) => {
    onClose();
    // Small delay to let tray collapse before activating ghost
    setTimeout(() => {
      onStickerDragStart?.(sticker, e);
    }, 50);
  }, [onClose, onStickerDragStart]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Expanded tray */}
          <motion.div
            className={styles.expandedTray}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className={styles.header}>
              <span className={styles.headerTitle}>
                <Sticker size={20} style={{ marginRight: 8 }} />
                Sticker Library
              </span>
              <button className={styles.closeButton} onClick={onClose} title="Close window">
                <X size={20} />
              </button>
            </div>

            {/* Search */}
            <div className={styles.searchRow}>
              <div className={styles.searchContainer}>
                <SearchIcon size={16} className={styles.searchIcon} />
                <input
                  className={styles.searchInput}
                  type="text"
                  placeholder="Search stickers..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            {/* Categories */}
            <div className={styles.categoriesRow}>
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

            {/* Sticker grid */}
            <div className={styles.stickerGrid}>
              {filteredStickers.length === 0 ? (
                <div className={styles.emptyState}>
                  No stickers found {search && `for "${search}"`}
                </div>
              ) : (
                filteredStickers.map(sticker => (
                  <motion.div
                    key={sticker.id}
                    className={styles.stickerCell}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onPointerDown={(e) => handleStickerPointerDown(sticker, e)}
                  >
                    <img
                      src={sticker.src}
                      alt={sticker.name}
                      className={styles.stickerCellImage}
                      draggable={false}
                    />
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
