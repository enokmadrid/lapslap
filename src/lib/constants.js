/**
 * LAPSLAPS Constants
 * Categories, sticker catalog, and app configuration
 */

export const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'uploads', label: 'Uploads' },
  { id: 'trending', label: 'Trending' },
  { id: 'design', label: 'Design' },
  { id: 'code', label: 'Code' },
  { id: 'products', label: 'Products' },
  { id: 'ai', label: 'AI' },
  { id: 'emoji', label: 'Emoji' },
  { id: 'quotes', label: 'Quotes' },
];

export const STICKERS = [
  { id: 'trust_me_doctor', name: 'Trust Me Doctor', src: '/stickers/trust_me_doctor.png', category: 'quotes' },
  { id: 'moo', name: 'Moo', src: '/stickers/moo.png', category: 'emoji' },
  { id: 'figma_boss', name: 'Figma Boss', src: '/stickers/figma_boss.png', category: 'design' },
  { id: 'claude', name: 'Claude AI', src: '/stickers/claude.png', category: 'ai' },
  { id: 'cat', name: 'Cat', src: '/stickers/cat.png', category: 'emoji' },
  { id: 'openclaw', name: 'Open Claw', src: '/stickers/openclaw.png', category: 'products' },
  { id: 'design_for_humans', name: 'Design for Humans', src: '/stickers/design_for_humans.png', category: 'design' },
  { id: 'overthink_this', name: 'Overthink This', src: '/stickers/overthink_this.png', category: 'quotes' },
];

export const STORAGE_KEY = 'stickerbook:canvas:v1';

export const LAPTOP = {
  width: 896,
  height: 550,
  canvasInset: 12,
  get canvasWidth() { return this.width - (this.canvasInset * 2); },
  get canvasHeight() { return this.height - (this.canvasInset * 2); },
};

export const STICKER_DEFAULTS = {
  minSize: 40,
  defaultSize: 120,
  traySize: 100,
};
