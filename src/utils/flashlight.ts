export const toggleFlashlight = async (enable: boolean) => {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "environment" },
  });

  const track = stream.getVideoTracks()[0];

  const capabilities = track.getCapabilities?.() as MediaTrackCapabilities & {
    torch?: boolean;
  };

  if (capabilities?.torch) {
    // ✅ Safe cast to bypass TS error 2352
    await track.applyConstraints({
      advanced: [{ torch: enable }] as unknown as MediaTrackConstraintSet[],
    });
  } else {
    throw new Error("Torch is not supported on this device.");
  }
};
