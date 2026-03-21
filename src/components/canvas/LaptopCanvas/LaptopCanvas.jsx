'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import PlacedSticker from '@/components/canvas/PlacedSticker/PlacedSticker';
import FloatingToolbar from '@/components/canvas/FloatingToolbar/FloatingToolbar';
import useCanvasStore from '@/hooks/useCanvasStore';
import styles from './LaptopCanvas.module.css';

export default function LaptopCanvas() {
  const canvasRef = useRef(null);
  const [canvasRect, setCanvasRect] = useState(null);
  const { placedStickers, selectedStickerId, deselectAll } = useCanvasStore();

  const selectedSticker = placedStickers.find(s => s.id === selectedStickerId);

  // Track canvas rect for bounds clamping
  useEffect(() => {
    const updateRect = () => {
      if (canvasRef.current) {
        setCanvasRect(canvasRef.current.getBoundingClientRect());
      }
    };
    updateRect();
    window.addEventListener('resize', updateRect);
    return () => window.removeEventListener('resize', updateRect);
  }, []);

  const handleCanvasClick = useCallback((e) => {
    if (e.target === canvasRef.current) {
      deselectAll();
    }
  }, [deselectAll]);

  return (
    <div className={styles.laptop}>
      <div
        className={styles.canvas}
        ref={canvasRef}
        id="laptop-canvas"
        onPointerDown={handleCanvasClick}
      >
        {/* Apple logo watermark */}
        <div className={styles.appleLogo}>
          <svg viewBox="0 0 170 210" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M150.4 71.4c-1-0.8-18.1-10.4-18.1-31.1 0-17.4 14.2-25.8 14.9-26.3C140.5 4.6 129.5 0 120 0c-7.4 0-14.9 4.3-19.5 4.3-4.9 0-12-4.1-18.4-4.1C67.9 0.3 55 14.5 55 35.4c0 13 5 26.7 11.2 35.6 6.1 8.4 11.4 15.3 18.5 15.3 7.4 0 10.3-4.8 19.2-4.8 9.1 0 11.4 4.8 19.2 4.8 7.2 0 12.9-7.8 18.1-15.3 3.8-5.3 6.6-10.5 8.1-13.5C149.7 57.3 150.4 71.4 150.4 71.4z M119.6 0c-1.3 10-4.3 18.9-10.1 26.1-6.6 8.2-14.5 12.5-24 12.9 0-0.5 0-1.1 0-1.7C85.5 18.6 102.4 0 119.6 0z" transform="translate(10,70) scale(0.9)"/>
          </svg>
        </div>

        {/* Empty state hint */}
        {placedStickers.length === 0 && (
          <div className={styles.emptyHint}>Drag Stickers Here</div>
        )}

        {/* Placed stickers */}
        {placedStickers.map(sticker => (
          <PlacedSticker
            key={sticker.id}
            sticker={sticker}
            canvasRect={canvasRect}
          />
        ))}

        {/* Floating toolbar for selected sticker */}
        <AnimatePresence>
          {selectedSticker && (
            <FloatingToolbar
              key="floating-toolbar"
              sticker={selectedSticker}
              canvasRect={canvasRect}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
