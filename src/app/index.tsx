import * as React from "react";
import manifest from "~/src/artworks/manifest.json";
import { Frame } from "~/src/frame";
import { InfiniteCanvas } from "~/src/infinite-canvas";
import type { MediaItem } from "~/src/infinite-canvas/types";
import { MatrixLoader } from "~/src/loader";
import { AiNotice, ScareModal, useScareTriggers } from "~/src/scare";

// Local-only media file (gitignored — never committed). Served from /public.
// We use a real MP4 (silent 1px video stream + AAC audio) rather than raw MP3
// so iOS Safari treats it as proper "media" — plays in silent mode, plays
// reliably from a tap. Raw MP3-in-<video> is iffy on iOS.
const AUDIO_SRC = "/audio/track.mp4";

// Bass detection tuning — covers ~0–185Hz with default 2048 FFT @ 48kHz.
const BASS_BIN_COUNT = 8;
const BASS_THRESHOLD = 0.72;
const BASS_COOLDOWN_MS = 360;

export function App() {
  const [media] = React.useState<MediaItem[]>(manifest as MediaItem[]);
  const [loading, setLoading] = React.useState(true);
  const [scareOpen, setScareOpen] = React.useState(false);
  // Using <video playsinline> instead of <audio> so audio plays even when
  // iOS Safari users have their physical silent switch on. iOS treats audio
  // inside a video element as "media" (allowed on silent), while raw <audio>
  // elements are categorized as "audio" (muted on silent).
  const audioRef = React.useRef<HTMLVideoElement>(null);

  const triggerScare = React.useCallback(() => setScareOpen(true), []);
  useScareTriggers(triggerScare);

  React.useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    let ctx: AudioContext | null = null;
    let raf = 0;
    let lastThump = 0;
    let analyserWired = false;
    let unmuted = false;

    const wireAnalyser = () => {
      if (analyserWired) return;
      try {
        const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        ctx = new Ctor();
        const src = ctx.createMediaElementSource(el);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 2048;
        analyser.smoothingTimeConstant = 0.55;
        src.connect(analyser);
        analyser.connect(ctx.destination);
        analyserWired = true;

        const bins = new Uint8Array(analyser.frequencyBinCount);
        const tick = () => {
          analyser.getByteFrequencyData(bins);
          let sum = 0;
          for (let i = 0; i < BASS_BIN_COUNT; i++) sum += bins[i];
          const energy = sum / (BASS_BIN_COUNT * 255);
          const now = performance.now();
          if (energy > BASS_THRESHOLD && now - lastThump > BASS_COOLDOWN_MS) {
            lastThump = now;

            // Page wobble (body shake).
            document.body.classList.add("thump");
            setTimeout(() => document.body.classList.remove("thump"), 360);

            // Throw the name HARD — almost edge-to-edge, big rotation, scale punch.
            // Stays where last tossed until next bass hit moves it again.
            const x = (Math.random() - 0.5) * 90; // -45 to +45 vw
            const y = (Math.random() - 0.5) * 80; // -40 to +40 vh
            const rot = (Math.random() - 0.5) * 80; // -40 to +40 deg
            const scale = 0.7 + Math.random() * 0.9; // 0.7 to 1.6
            document.body.style.setProperty("--name-x", `${x.toFixed(1)}vw`);
            document.body.style.setProperty("--name-y", `${y.toFixed(1)}vh`);
            document.body.style.setProperty("--name-rot", `${rot.toFixed(1)}deg`);
            document.body.style.setProperty("--name-scale", scale.toFixed(2));
          }
          raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      } catch {
        analyserWired = false;
      }
    };

    // Set initial state but DON'T call play() yet — eager play attempts on
    // iOS Safari can "poison" the element's permission state and block the
    // subsequent gesture-driven play. Just prep the element and wait.
    el.volume = 0.6;
    el.muted = false;

    // On the first real user gesture, play. iOS counts the gesture as user
    // activation, so a single play() inside the handler is allowed.
    const unmute = () => {
      if (unmuted) return;
      unmuted = true;
      void el
        .play()
        .then(() => {
          el.currentTime = 0;
          if (ctx && ctx.state === "suspended") void ctx.resume();
          wireAnalyser();
        })
        .catch(() => {
          unmuted = false; // try again on the next gesture
        });
    };

    // Events that COUNT as user activation (per browser autoplay policy).
    const events: (keyof DocumentEventMap)[] = ["click", "pointerdown", "pointerup", "keydown", "touchstart", "touchend"];
    for (const ev of events) document.addEventListener(ev, unmute, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      for (const ev of events) document.removeEventListener(ev, unmute);
      void ctx?.close();
    };
  }, []);

  // Fire a custom event when the loader finishes — InfiniteCanvas's scene listens
  // for it to start the dolly-in animation in sync with the loader fade.
  const onLoaderDone = React.useCallback(() => {
    setLoading(false);
    window.dispatchEvent(new CustomEvent("ee-entrance"));
  }, []);

  if (!media.length) {
    return null;
  }

  return (
    <>
      <Frame />
      <InfiniteCanvas media={media} />
      {loading && <MatrixLoader onDone={onLoaderDone} />}
      <ScareModal open={scareOpen} onClose={() => setScareOpen(false)} />
      <AiNotice />
      {/* biome-ignore lint/a11y/useMediaCaption: instrumental background track, no spoken content to caption */}
      <video
        ref={audioRef}
        src={AUDIO_SRC}
        loop
        playsInline
        preload="auto"
        muted={false}
        width={1}
        height={1}
        // Visually hidden but in the DOM. opacity:0 + 1×1 fixed; NOT display:none
        // (display:none would prevent iOS from allowing playback).
        style={{ position: "fixed", top: 0, left: 0, opacity: 0, pointerEvents: "none" }}
      />
    </>
  );
}
