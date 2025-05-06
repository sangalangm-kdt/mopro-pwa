// utils/camera.ts
export function stopCamera(video: HTMLVideoElement | null) {
  if (video?.srcObject) {
    const stream = video.srcObject as MediaStream;
    stream.getTracks().forEach((track) => track.stop());
    video.srcObject = null;
  }
}
