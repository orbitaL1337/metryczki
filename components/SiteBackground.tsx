"use client";

import { type CSSProperties, useEffect, useMemo, useRef } from "react";

type DotLayer = {
  id: string;
  duration: string;
  delay: string;
  shadow: string;
};

type FloatKind = "balloon" | "star" | "heart";

type FloatItem = {
  id: string;
  kind: FloatKind;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  drift: number;
  push: number;
  tone: string;
  toneSoft?: string;
  heartX?: number;
  heartRot?: number;
};

function seededRandom(seed: number): () => number {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function buildDotShadows(count: number, seed: number): string {
  const random = seededRandom(seed);
  const shadows: string[] = [];
  const palette: Array<[number, number, number]> = [
    [351, 72, 30],
    [346, 66, 34],
    [342, 58, 38],
    [226, 58, 26],
    [220, 52, 30],
    [214, 46, 34],
  ];

  for (let i = 0; i <= count; i += 1) {
    const x = (-0.5 + random() * 3).toFixed(3);
    const y = (-0.5 + random() * 3).toFixed(3);
    const [h, s, l] = palette[Math.floor(random() * palette.length)];
    const alpha = (0.56 + random() * 0.22).toFixed(2);
    shadows.push(`${x}em ${y}em 7px hsla(${h}, ${s}%, ${l}%, ${alpha})`);
  }

  return shadows.join(", ");
}

function buildFloatItems(kind: FloatKind, count: number, seed: number, tones: string[], tonesSoft?: string[]): FloatItem[] {
  const random = seededRandom(seed);
  const items: FloatItem[] = [];

  for (let i = 0; i < count; i += 1) {
    const sizeBase = kind === "balloon" ? 30 : kind === "heart" ? 16 : 12;
    const sizeSpread = kind === "balloon" ? 22 : kind === "heart" ? 14 : 10;

    const sideLane = kind === "star" || kind === "heart";
    const sideX = sideLane
      ? random() < 0.5
        ? 1 + random() * 13
        : 86 + random() * 13
      : 6 + random() * 88;

    items.push({
      id: `${kind}-${i + 1}`,
      kind,
      x: sideX,
      y: 8 + random() * 84,
      size: sizeBase + Math.round(random() * sizeSpread),
      opacity: 0.22 + random() * 0.36,
      duration: (kind === "star" ? 16 : 20) + random() * 14,
      delay: -1 * (i * (1.1 + random())),
      drift: 6 + random() * 20,
      push: kind === "star" ? 0.95 + random() * 0.4 : 0.72 + random() * 0.32,
      tone: tones[i % tones.length],
      toneSoft: tonesSoft ? tonesSoft[i % tonesSoft.length] : undefined,
      heartX: kind === "heart" ? -18 + random() * 36 : undefined,
      heartRot: kind === "heart" ? -14 + random() * 28 : undefined,
    });
  }

  return items;
}

const balloonTones = ["#ff6b6b", "#ff9f43", "#feca57", "#1dd1a1", "#48dbfb", "#5f27cd", "#ff4fa3"];
const balloonSoft = ["#ffd0d0", "#ffe0c2", "#fff4c2", "#cef5e8", "#d7f4ff", "#e0d6ff", "#ffd6ec"];
const starTones = ["#ffbe0b", "#fb5607", "#ff006e", "#8338ec", "#3a86ff", "#00c2ff", "#00d1a0"];
const heartTones = ["#ff2d55", "#ff3b30", "#ff6b6b", "#ff006e", "#d7263d", "#b5179e"];

export default function SiteBackground() {
  const bgRef = useRef<HTMLDivElement | null>(null);

  const dotLayers = useMemo<DotLayer[]>(() => {
    return [
      { id: "dots-1", duration: "44s", delay: "-27s", shadow: buildDotShadows(40, 91) },
      { id: "dots-2", duration: "43s", delay: "-32s", shadow: buildDotShadows(40, 137) },
      { id: "dots-3", duration: "42s", delay: "-23s", shadow: buildDotShadows(40, 211) },
      { id: "dots-4", duration: "41s", delay: "-19s", shadow: buildDotShadows(40, 307) },
    ];
  }, []);

  const balloons = useMemo(() => buildFloatItems("balloon", 12, 501, balloonTones, balloonSoft), []);
  const stars = useMemo(() => buildFloatItems("star", 16, 777, starTones), []);
  const hearts = useMemo(() => buildFloatItems("heart", 14, 923, heartTones), []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let targetX = window.innerWidth * 0.5;
    let targetY = window.innerHeight * 0.5;
    let currentX = targetX;
    let currentY = targetY;
    let frame = 0;

    const update = () => {
      currentX += (targetX - currentX) * 0.14;
      currentY += (targetY - currentY) * 0.14;

      const viewportW = window.innerWidth;
      const viewportH = window.innerHeight;
      const elements = bgRef.current?.querySelectorAll<HTMLElement>(".float-react");

      elements?.forEach((node) => {
        const xPercent = Number(node.dataset.x ?? "50");
        const yPercent = Number(node.dataset.y ?? "50");
        const pushFactor = Number(node.dataset.push ?? "1");

        const px = (xPercent / 100) * viewportW;
        const py = (yPercent / 100) * viewportH;

        const dx = px - currentX;
        const dy = py - currentY;
        const distance = Math.hypot(dx, dy) || 1;
        const radius = 280;
        const influence = Math.max(0, 1 - distance / radius);
        const force = influence * 16 * pushFactor;

        const rx = (dx / distance) * force;
        const ry = (dy / distance) * force;

        node.style.setProperty("--react-x", `${rx.toFixed(2)}px`);
        node.style.setProperty("--react-y", `${ry.toFixed(2)}px`);
      });

      if (Math.abs(targetX - currentX) > 0.2 || Math.abs(targetY - currentY) > 0.2) {
        frame = window.requestAnimationFrame(update);
      } else {
        frame = 0;
      }
    };

    const queueUpdate = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(update);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      queueUpdate();
    };

    const onPointerLeave = () => {
      targetX = window.innerWidth * 0.5;
      targetY = window.innerHeight * 0.5;
      queueUpdate();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  return (
    <div ref={bgRef} aria-hidden className="site-background delight-background">
      {dotLayers.map((layer) => (
        <span
          key={layer.id}
          className="delight-orb"
          style={{
            ["--duration" as string]: layer.duration,
            ["--delay" as string]: layer.delay,
            textShadow: layer.shadow,
          }}
        >
          .
        </span>
      ))}

      <div className="float-layer float-layer--balloons">
        {balloons.map((item) => (
          <span
            key={item.id}
            className="float-react float-balloon"
            data-x={item.x.toFixed(2)}
            data-y={item.y.toFixed(2)}
            data-push={item.push.toFixed(2)}
            style={{
              ["--x" as string]: `${item.x.toFixed(2)}%`,
              ["--y" as string]: `${item.y.toFixed(2)}%`,
              ["--size" as string]: `${item.size}px`,
              ["--opacity" as string]: item.opacity,
              ["--duration" as string]: `${item.duration.toFixed(2)}s`,
              ["--delay" as string]: `${item.delay.toFixed(2)}s`,
              ["--drift" as string]: `${item.drift.toFixed(2)}px`,
              ["--tone" as string]: item.tone,
              ["--tone-soft" as string]: item.toneSoft,
            } as CSSProperties}
          >
            <span className="float-inner" />
          </span>
        ))}
      </div>

      <div className="float-layer float-layer--stars">
        {stars.map((item) => (
          <span
            key={item.id}
            className="float-react float-star"
            data-x={item.x.toFixed(2)}
            data-y={item.y.toFixed(2)}
            data-push={item.push.toFixed(2)}
            style={{
              ["--x" as string]: `${item.x.toFixed(2)}%`,
              ["--y" as string]: `${item.y.toFixed(2)}%`,
              ["--size" as string]: `${item.size}px`,
              ["--opacity" as string]: item.opacity,
              ["--duration" as string]: `${item.duration.toFixed(2)}s`,
              ["--delay" as string]: `${item.delay.toFixed(2)}s`,
              ["--drift" as string]: `${item.drift.toFixed(2)}px`,
              ["--tone" as string]: item.tone,
            } as CSSProperties}
          >
            <span className="float-inner" />
          </span>
        ))}
      </div>

      <div className="float-layer float-layer--hearts">
        {hearts.map((item) => (
          <span
            key={item.id}
            className="float-react float-heart"
            data-x={item.x.toFixed(2)}
            data-y={item.y.toFixed(2)}
            data-push={item.push.toFixed(2)}
            style={{
              ["--x" as string]: `${item.x.toFixed(2)}%`,
              ["--y" as string]: `${item.y.toFixed(2)}%`,
              ["--size" as string]: `${item.size}px`,
              ["--opacity" as string]: item.opacity,
              ["--duration" as string]: `${item.duration.toFixed(2)}s`,
              ["--delay" as string]: `${item.delay.toFixed(2)}s`,
              ["--drift" as string]: `${item.drift.toFixed(2)}px`,
              ["--tone" as string]: item.tone,
              ["--heart-x" as string]: `${(item.heartX ?? 0).toFixed(2)}px`,
              ["--heart-rot" as string]: `${(item.heartRot ?? 0).toFixed(2)}deg`,
            } as CSSProperties}
          >
            <span className="float-inner" />
          </span>
        ))}
      </div>
    </div>
  );
}