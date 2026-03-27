type TorchCapableTrack = MediaStreamTrack & {
  getCapabilities?: () => MediaTrackCapabilities & { torch?: boolean };
};

function getVideoTrackFromVideoEl(videoEl: HTMLVideoElement | null) {
  const stream = videoEl?.srcObject;
  if (!stream || !(stream instanceof MediaStream)) return null;
  return stream.getVideoTracks()[0] ?? null;
}

async function applyTorch(track: TorchCapableTrack, enable: boolean) {
  const caps = track.getCapabilities?.() as
    | (MediaTrackCapabilities & {
        torch?: boolean;
      })
    | null;

  if (!caps?.torch) {
    throw new Error("Torch is not supported on this device.");
  }

  // Some TS libs don't include torch in constraints typing
  await track.applyConstraints({
    advanced: [{ torch: enable }] as unknown as MediaTrackConstraintSet[],
  });
}

/**
 * ✅ Best practice:
 * - Prefer using the EXISTING camera track from <video srcObject>
 * - Only fall back to getUserMedia if there's no active stream yet
 * - If we create a fallback stream, stop it after applying constraints
 */
export const toggleFlashlight = async (
  enable: boolean,
  videoEl?: HTMLVideoElement | null,
) => {
  // 1) Try existing track first (recommended)
  const existingTrack = getVideoTrackFromVideoEl(
    videoEl ?? null,
  ) as TorchCapableTrack | null;

  if (existingTrack) {
    await applyTorch(existingTrack, enable);
    return;
  }

  // 2) Fallback: request a stream (only if no existing stream)
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "environment" },
  });

  const track = stream.getVideoTracks()[0] as TorchCapableTrack;

  try {
    await applyTorch(track, enable);
  } finally {
    // ✅ Important: don't leak this fallback stream
    stream.getTracks().forEach((t) => t.stop());
  }
};
