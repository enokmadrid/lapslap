'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
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
          <Image
            src="/apple_logo.svg"
            alt="Apple Logo"
            width={104}
            height={127}
            priority
            draggable={false}
          />
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
