'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Background from '@/components/layout/Background/Background';
import NavBar from '@/components/layout/NavBar/NavBar';
import EditorToolbar from '@/components/layout/EditorToolbar/EditorToolbar';
import LaptopCanvas from '@/components/canvas/LaptopCanvas/LaptopCanvas';
import StickerTray from '@/components/tray/StickerTray/StickerTray';
import ExpandedTray from '@/components/tray/ExpandedTray/ExpandedTray';
import Toast from '@/components/ui/Toast/Toast';
import useCanvasStore from '@/hooks/useCanvasStore';
import { isPointInRect } from '@/lib/bounds';
import { STORAGE_KEY } from '@/lib/constants';
import { initSharedAudio, playStickerSound } from '@/lib/audio';
import styles from './page.module.css';

export default function Home() {
  const [ghostSticker, setGhostSticker] = useState(null);
  const [ghostPos, setGhostPos] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [isTrayExpanded, setIsTrayExpanded] = useState(false);
  const toastTimer = useRef(null);

  const { addSticker, clearCanvas, shuffleStickers, placedStickers } = useCanvasStore();

  useEffect(() => {
    setMounted(true);
    initSharedAudio();

    // Restore from localStorage
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.placedStickers?.length > 0) {
          useCanvasStore.setState({
            placedStickers: parsed.placedStickers,
            nextZIndex: parsed.nextZIndex || 1,
          });
          showToastMessage('Canvas restored ✓');
        }
      }
    } catch (e) {
      // Ignore
    }
  }, []);

  // Auto-save
  useEffect(() => {
    if (!mounted) return;
    const state = useCanvasStore.getState();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        placedStickers: state.placedStickers,
        nextZIndex: state.nextZIndex,
      }));
    } catch (e) {}
  }, [placedStickers, mounted]);

  const showToastMessage = useCallback((msg) => {
    setToastMessage(msg);
    setShowToast(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setShowToast(false), 2000);
  }, []);

  const handleClear = useCallback(() => {
    clearCanvas();
    showToastMessage('Canvas cleared');
  }, [clearCanvas, showToastMessage]);

  const handleShuffle = useCallback(() => {
    const canvas = document.getElementById('laptop-canvas');
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      shuffleStickers(rect.width, rect.height);
      showToastMessage('Stickers shuffled ✨');
    }
  }, [shuffleStickers, showToastMessage]);

  const handleExport = useCallback(async () => {
    const canvas = document.getElementById('laptop-canvas');
    if (!canvas) return;
    
    const state = useCanvasStore.getState();
    if (state.placedStickers.length === 0) {
      showToastMessage('No stickers to export!');
      return;
    }

    showToastMessage('Exporting...');

    try {
      const canvasRect = canvas.getBoundingClientRect();
      const scale = 2; // 2x resolution
      const offscreen = document.createElement('canvas');
      offscreen.width = canvasRect.width * scale;
      offscreen.height = canvasRect.height * scale;
      const ctx = offscreen.getContext('2d');
      ctx.scale(scale, scale);

      // Draw laptop background color
      ctx.fillStyle = '#C8C8D0';
      ctx.fillRect(0, 0, canvasRect.width, canvasRect.height);

      // Sort stickers by z-index
      const sorted = [...state.placedStickers].sort((a, b) => a.zIndex - b.zIndex);

      // Draw each sticker
      for (const sticker of sorted) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
          img.src = sticker.src;
        });

        ctx.save();
        ctx.translate(sticker.x + sticker.width / 2, sticker.y + sticker.height / 2);
        ctx.rotate((sticker.rotation || 0) * Math.PI / 180);
        ctx.drawImage(img, -sticker.width / 2, -sticker.height / 2, sticker.width, sticker.height);
        ctx.restore();
      }

      // Download
      const link = document.createElement('a');
      link.download = 'my-laptop-design.png';
      link.href = offscreen.toDataURL('image/png');
      link.click();
      showToastMessage('Exported PNG ✓');
    } catch (err) {
      showToastMessage('Export failed');
    }
  }, [showToastMessage]);

  const handleStickerDragStart = useCallback((sticker, event) => {
    event.preventDefault();
    playStickerSound();
    setGhostSticker(sticker);
    setGhostPos({ x: event.clientX - 60, y: event.clientY - 60 });

    const handleMove = (e) => {
      setGhostPos({ x: e.clientX - 60, y: e.clientY - 60 });
    };

    const handleUp = (e) => {
      const canvas = document.getElementById('laptop-canvas');
      if (canvas) {
        const canvasRect = canvas.getBoundingClientRect();
        if (isPointInRect(e.clientX, e.clientY, canvasRect)) {
          const dropX = e.clientX - canvasRect.left - 60;
          const dropY = e.clientY - canvasRect.top - 60;
          addSticker(sticker,
            Math.max(0, Math.min(dropX, canvasRect.width - 120)),
            Math.max(0, Math.min(dropY, canvasRect.height - 120))
          );
        }
      }
      setGhostSticker(null);
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
  }, [addSticker]);

  const handleExpand = useCallback(() => {
    setIsTrayExpanded(true);
  }, []);

  const handleCollapse = useCallback(() => {
    setIsTrayExpanded(false);
  }, []);

  return (
    <div className={styles.editorPage}>
      <Background />
      <NavBar />

      <div className={styles.editorArea}>
        <EditorToolbar
          onClear={handleClear}
          onShuffle={handleShuffle}
          onExport={handleExport}
          isVisible={placedStickers.length > 0}
        />
        <LaptopCanvas />
      </div>

      <StickerTray
        onStickerDragStart={handleStickerDragStart}
        onExpand={handleExpand}
      />

      <ExpandedTray
        isOpen={isTrayExpanded}
        onClose={handleCollapse}
        onStickerDragStart={handleStickerDragStart}
      />

      <Toast message={toastMessage} isVisible={showToast} />

      {/* Ghost sticker */}
      {mounted && ghostSticker && createPortal(
        <div
          style={{
            position: 'fixed',
            left: ghostPos.x,
            top: ghostPos.y,
            width: 120,
            height: 120,
            pointerEvents: 'none',
            zIndex: 9999,
            opacity: 0.85,
          }}
        >
          <img
            src={ghostSticker.src}
            alt={ghostSticker.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.3))',
            }}
            draggable={false}
          />
        </div>,
        document.body
      )}
    </div>
  );
}
