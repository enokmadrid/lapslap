'use client';

import { useRef, useCallback, useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import useCanvasStore from '@/hooks/useCanvasStore';
import { clampToCanvas } from '@/lib/bounds';
import { STICKER_DEFAULTS } from '@/lib/constants';
import { playStickerSound } from '@/lib/audio';
import styles from './PlacedSticker.module.css';

export default function PlacedSticker({ sticker, canvasRect }) {
  const dragOffset = useRef({ x: 0, y: 0 });
  const [showRipple, setShowRipple] = useState(false);
  const [ripplePos, setRipplePos] = useState({ x: 0, y: 0 });

  const {
    selectedStickerId,
    selectSticker,
    updateSticker,
    setDragging,
    bringForward,
  } = useCanvasStore();

  const isSelected = selectedStickerId === sticker.id;
  const liftControls = useAnimation();

  // Trigger 3D peel-lift when sticker becomes selected
  useEffect(() => {
    if (isSelected) {
      liftControls.start({
        // Left edge lifts first → whole sticker settles lifted
        rotateY: [0, -12, -6, 0],
        rotateX: [0, 4, 2, 0],
        scale: [1, 1.04, 1.06, 1.05],
        y: [0, -3, -5, -4],
        transition: {
          duration: 0.5,
          ease: [0.25, 0.46, 0.45, 0.94],
          times: [0, 0.3, 0.7, 1],
        },
      });
    } else {
      liftControls.start({
        rotateY: 0,
        rotateX: 0,
        scale: 1,
        y: 0,
        transition: { duration: 0.2, ease: 'easeOut' },
      });
    }
  }, [isSelected, liftControls]);

  // ---- Drag on canvas ----
  const handlePointerDown = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Play the pop sound only when not already selected
    if (selectedStickerId !== sticker.id) {
      playStickerSound();
    }

    selectSticker(sticker.id);
    bringForward(sticker.id);

    // Trigger ripple
    setRipplePos({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
    setShowRipple(true);
    setTimeout(() => setShowRipple(false), 350);

    dragOffset.current = {
      x: e.clientX - (canvasRect?.left || 0) - sticker.x,
      y: e.clientY - (canvasRect?.top || 0) - sticker.y,
    };

    setDragging(true);

    const handlePointerMove = (moveEvent) => {
      if (!canvasRect) return;
      const newX = moveEvent.clientX - canvasRect.left - dragOffset.current.x;
      const newY = moveEvent.clientY - canvasRect.top - dragOffset.current.y;
      const clamped = clampToCanvas(
        newX, newY,
        sticker.width, sticker.height,
        canvasRect.width, canvasRect.height
      );
      updateSticker(sticker.id, { x: clamped.x, y: clamped.y });
    };

    const handlePointerUp = () => {
      setDragging(false);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  }, [sticker, canvasRect, selectSticker, updateSticker, setDragging, bringForward]);

  // ---- Resize ----
  const handleResizeStart = useCallback((e, corner) => {
    e.stopPropagation();
    e.preventDefault();

    const startX = e.clientX;
    const startY = e.clientY;
    const startW = sticker.width;
    const startH = sticker.height;
    const startStickerX = sticker.x;
    const startStickerY = sticker.y;

    const handleMove = (moveEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;

      let newW, newH, newX, newY;

      if (corner === 'se') {
        newW = Math.max(STICKER_DEFAULTS.minSize, startW + dx);
        newH = newW; // keep square
        newX = startStickerX;
        newY = startStickerY;
      } else if (corner === 'nw') {
        newW = Math.max(STICKER_DEFAULTS.minSize, startW - dx);
        newH = newW;
        newX = startStickerX + (startW - newW);
        newY = startStickerY + (startH - newH);
      } else if (corner === 'ne') {
        newW = Math.max(STICKER_DEFAULTS.minSize, startW + dx);
        newH = newW;
        newX = startStickerX;
        newY = startStickerY + (startH - newH);
      } else {
        newW = Math.max(STICKER_DEFAULTS.minSize, startW - dx);
        newH = newW;
        newX = startStickerX + (startW - newW);
        newY = startStickerY;
      }

      updateSticker(sticker.id, { width: newW, height: newH, x: newX, y: newY });
    };

    const handleUp = () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
  }, [sticker, updateSticker]);

  // ---- Rotate ----
  const handleRotateStart = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();

    const centerX = (canvasRect?.left || 0) + sticker.x + sticker.width / 2;
    const centerY = (canvasRect?.top || 0) + sticker.y + sticker.height / 2;

    const handleMove = (moveEvent) => {
      const angle = Math.atan2(
        moveEvent.clientY - centerY,
        moveEvent.clientX - centerX
      ) * (180 / Math.PI) + 90;
      updateSticker(sticker.id, { rotation: angle });
    };

    const handleUp = () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
  }, [sticker, canvasRect, updateSticker]);

  return (
    <motion.div
      className={styles.sticker}
      style={{
        left: sticker.x,
        top: sticker.y,
        width: sticker.width,
        height: sticker.height,
        zIndex: sticker.zIndex,
        rotate: sticker.rotation,
        perspective: 600,
      }}
      initial={{ scale: 0.6, opacity: 0, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      onPointerDown={handlePointerDown}
    >
      {/* Inner wrapper — 3D peel tilt + lift */}
      <motion.div
        style={{
          width: '100%',
          height: '100%',
          transformOrigin: 'right center',
          transformStyle: 'preserve-3d',
        }}
        animate={liftControls}
      >
        {/* Sticker image */}
        <motion.img
          src={sticker.src}
          alt={sticker.name}
          className={styles.stickerImage}
          draggable={false}
          animate={{
            filter: isSelected
              ? 'drop-shadow(0px 14px 28px rgba(0,0,0,0.4))'
              : 'drop-shadow(0px 2px 6px rgba(0,0,0,0.15))',
          }}
          transition={{ filter: { duration: 0.3 } }}
        />

      {/* Ripple effect on tap */}
      <div className={styles.rippleContainer}>
        <AnimatePresence>
          {showRipple && (
            <motion.div
              className={styles.ripple}
              style={{
                left: ripplePos.x - 40,
                top: ripplePos.y - 40,
                width: 80,
                height: 80,
              }}
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: 4, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Selection UI */}
      <AnimatePresence>
        {isSelected && (
          <>
            {/* Selection ring */}
            <motion.div
              className={styles.selectionRing}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
            />

            {/* Rotate connector line */}
            <div className={styles.rotateLine} />

            {/* Rotate handle */}
            <motion.div
              className={styles.rotateHandle}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ delay: 0.05 }}
              onPointerDown={handleRotateStart}
            >
              ↻
            </motion.div>

            {/* Resize handles */}
            <motion.div
              className={`${styles.resizeHandle} ${styles.resizeNW}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              onPointerDown={(e) => handleResizeStart(e, 'nw')}
            />
            <motion.div
              className={`${styles.resizeHandle} ${styles.resizeNE}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              onPointerDown={(e) => handleResizeStart(e, 'ne')}
            />
            <motion.div
              className={`${styles.resizeHandle} ${styles.resizeSW}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              onPointerDown={(e) => handleResizeStart(e, 'sw')}
            />
            <motion.div
              className={`${styles.resizeHandle} ${styles.resizeSE}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              onPointerDown={(e) => handleResizeStart(e, 'se')}
            />
          </>
        )}
      </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
