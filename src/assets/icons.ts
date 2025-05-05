export const allIcons = [
  // Android required sizes
  {
    src: "/android/android-launchericon-192-192.png",
    sizes: "192x192",
    type: "image/png",
    purpose: "any maskable", // enables Chrome splash with circle crop
  },
  {
    src: "/android/android-launchericon-512-512.png",
    sizes: "512x512",
    type: "image/png",
    purpose: "any maskable",
  },

  // iOS recommended sizes
  {
    src: "/ios/120.png",
    sizes: "120x120",
    type: "image/png",
  },
  {
    src: "/ios/152.png",
    sizes: "152x152",
    type: "image/png",
  },
  {
    src: "/ios/167.png",
    sizes: "167x167",
    type: "image/png",
  },
  {
    src: "/ios/180.png",
    sizes: "180x180",
    type: "image/png",
  },
  {
    src: "/ios/1024.png",
    sizes: "1024x1024",
    type: "image/png",
  },

  // Optional: Fallback for older Android or Windows
  {
    src: "/ios/144.png",
    sizes: "144x144",
    type: "image/png",
  },
];
