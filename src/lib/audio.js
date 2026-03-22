let stickerAudio = null;
let slapAudio = null;

export const initSharedAudio = () => {
  if (typeof window !== 'undefined') {
    if (!stickerAudio) {
      stickerAudio = new Audio('/sticker_sound.m4a');
      stickerAudio.volume = 0.3;
    }
    if (!slapAudio) {
      slapAudio = new Audio('/slap_sound.m4a');
      slapAudio.volume = 0.4; // Slightly louder for the slap impact
    }
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

export const playSlapSound = () => {
  if (!slapAudio) {
    initSharedAudio();
  }
  if (slapAudio) {
    slapAudio.currentTime = 0;
    slapAudio.play().catch((err) => {
      console.warn('Audio play failed:', err);
    });
  }
};
