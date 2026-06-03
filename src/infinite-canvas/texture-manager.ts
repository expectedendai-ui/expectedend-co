import * as THREE from "three";
import type { MediaItem } from "./types";

const textureCache = new Map<string, THREE.Texture>();
const loadCallbacks = new Map<string, Set<(tex: THREE.Texture) => void>>();
const loader = new THREE.TextureLoader();

const isTextureLoaded = (tex: THREE.Texture): boolean => {
  const media = tex.image as HTMLImageElement | HTMLVideoElement | undefined;
  if (media instanceof HTMLImageElement) return media.complete && media.naturalWidth > 0;
  // HAVE_CURRENT_DATA (2) or better means the video has a frame to draw.
  if (media instanceof HTMLVideoElement) return media.readyState >= 2;
  return false;
};

const createVideoTexture = (key: string): THREE.VideoTexture => {
  const video = document.createElement("video");
  video.src = key;
  video.loop = true;
  video.muted = true;
  video.defaultMuted = true;
  video.autoplay = true;
  video.playsInline = true;
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");
  video.preload = "auto";

  const texture = new THREE.VideoTexture(video);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.colorSpace = THREE.SRGBColorSpace;

  const fireCallbacks = () => {
    loadCallbacks.get(key)?.forEach((cb) => {
      try {
        cb(texture);
      } catch (err) {
        console.error(`Callback failed: ${JSON.stringify(err)}`);
      }
    });
    loadCallbacks.delete(key);
  };

  video.addEventListener(
    "loadeddata",
    () => {
      video.play().catch(() => {});
      fireCallbacks();
    },
    { once: true }
  );
  video.play().catch(() => {});

  return texture;
};

export const getTexture = (item: MediaItem, onLoad?: (texture: THREE.Texture) => void): THREE.Texture => {
  const key = item.url;
  const existing = textureCache.get(key);

  if (existing) {
    if (onLoad) {
      if (isTextureLoaded(existing)) {
        onLoad(existing);
      } else {
        loadCallbacks.get(key)?.add(onLoad);
      }
    }
    return existing;
  }

  const callbacks = new Set<(tex: THREE.Texture) => void>();
  if (onLoad) callbacks.add(onLoad);
  loadCallbacks.set(key, callbacks);

  if (item.type === "video") {
    const videoTexture = createVideoTexture(key);
    textureCache.set(key, videoTexture);
    return videoTexture;
  }

  const texture = loader.load(
    key,
    (tex) => {
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = true;
      tex.anisotropy = 4;
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;

      loadCallbacks.get(key)?.forEach((cb) => {
        try {
          cb(tex);
        } catch (err) {
          console.error(`Callback failed: ${JSON.stringify(err)}`);
        }
      });
      loadCallbacks.delete(key);
    },
    undefined,
    (err) => console.error("Texture load failed:", key, err)
  );

  textureCache.set(key, texture);
  return texture;
};
