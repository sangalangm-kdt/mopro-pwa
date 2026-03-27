let audioContext: AudioContext | null = null;

export function playBeep() {
  try {
    if (!audioContext) {
      audioContext = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
    }

    const duration = 0.12; // seconds
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = 950; // scanner-like tone
    gainNode.gain.value = 0.15; // volume

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  } catch (err) {
    console.warn("Beep failed:", err);
  }
}
