export async function stopCamera(video: HTMLVideoElement | null) {
  if (!video) return;

  const stream = video.srcObject;

  if (stream && stream instanceof MediaStream) {
    const tracks = stream.getTracks();

    for (const track of tracks) {
      try {
        // Try turning off torch if supported
        const caps = (track as any).getCapabilities?.();
        if (caps?.torch) {
          await track.applyConstraints({
            advanced: [{ torch: false }] as any,
          });
        }
      } catch {
        // Ignore torch errors
      }

      try {
        track.stop();
      } catch {
        // Ignore stop errors
      }
    }
  }

  try {
    video.pause();
  } catch {}

  video.srcObject = null;
}
