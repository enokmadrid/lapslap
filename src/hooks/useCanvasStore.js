import { create } from 'zustand';

const useCanvasStore = create((set, get) => ({
  // State
  placedStickers: [],
  selectedStickerId: null,
  isDragging: false,
  nextZIndex: 1,

  // Actions
  addSticker: (sticker, x, y) => {
    const state = get();
    const newSticker = {
      id: `sticker-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      name: sticker.name,
      category: sticker.category,
      src: sticker.src,
      x,
      y,
      width: 120,
      height: 120,
      rotation: 0,
      zIndex: state.nextZIndex,
    };
    set({
      placedStickers: [...state.placedStickers, newSticker],
      nextZIndex: state.nextZIndex + 1,
      selectedStickerId: newSticker.id,
    });
    return newSticker;
  },

  removeSticker: (id) => {
    set((state) => ({
      placedStickers: state.placedStickers.filter(s => s.id !== id),
      selectedStickerId: state.selectedStickerId === id ? null : state.selectedStickerId,
    }));
  },

  updateSticker: (id, updates) => {
    set((state) => ({
      placedStickers: state.placedStickers.map(s =>
        s.id === id ? { ...s, ...updates } : s
      ),
    }));
  },

  selectSticker: (id) => {
    set({ selectedStickerId: id });
  },

  deselectAll: () => {
    set({ selectedStickerId: null });
  },

  bringForward: (id) => {
    const state = get();
    set({
      placedStickers: state.placedStickers.map(s =>
        s.id === id ? { ...s, zIndex: state.nextZIndex } : s
      ),
      nextZIndex: state.nextZIndex + 1,
    });
  },

  sendBackward: (id) => {
    set((state) => {
      const sticker = state.placedStickers.find(s => s.id === id);
      if (!sticker) return state;
      const minZ = Math.min(...state.placedStickers.map(s => s.zIndex));
      return {
        placedStickers: state.placedStickers.map(s =>
          s.id === id ? { ...s, zIndex: minZ - 1 } : s
        ),
      };
    });
  },

  duplicateSticker: (id) => {
    const state = get();
    const sticker = state.placedStickers.find(s => s.id === id);
    if (!sticker) return;
    const dup = {
      ...sticker,
      id: `sticker-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      x: sticker.x + 20,
      y: sticker.y + 20,
      zIndex: state.nextZIndex,
    };
    set({
      placedStickers: [...state.placedStickers, dup],
      nextZIndex: state.nextZIndex + 1,
      selectedStickerId: dup.id,
    });
  },

  clearCanvas: () => {
    set({ placedStickers: [], selectedStickerId: null });
  },

  shuffleStickers: (canvasWidth, canvasHeight) => {
    set((state) => ({
      placedStickers: state.placedStickers.map(s => ({
        ...s,
        x: Math.random() * (canvasWidth - s.width),
        y: Math.random() * (canvasHeight - s.height),
        rotation: (Math.random() - 0.5) * 30,
      })),
    }));
  },

  setDragging: (isDragging) => {
    set({ isDragging });
  },
}));

export default useCanvasStore;
