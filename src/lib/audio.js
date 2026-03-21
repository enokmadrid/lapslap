let stickerAudio = null;

export const initSharedAudio = () => {
  if (typeof window !== 'undefined' && !stickerAudio) {
    stickerAudio = new Audio('/sticker_sound.m4a');
    stickerAudio.volume = 0.3;
  }
};

export const playStickerSound = () => {
  if (!stickerAudio) {
    initSharedAudio();
  }
  if (stickerAudio) {
    stickerAudio.currentTime = 0;
    stickerAudio.play().catch((err) => {
      console.warn('Audio play failed:', err);
    });
  }
};
