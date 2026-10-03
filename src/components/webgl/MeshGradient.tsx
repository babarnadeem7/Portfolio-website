"use client";

import { Color, Mesh, Program, Renderer, Triangle, Vec2 } from "ogl";
import { useEffect, useRef } from "react";
import { useTheme } from "@/lib/theme";
import { fragment, vertex } from "./shaders";

function cssColor(name: string): Color {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return new Color(v || "#000000");
}

type Props = { onReady: () => void };

/**
 * Full-screen shader plane (one triangle). Lazy-loaded; never rendered for
 * reduced motion. Pauses offscreen and in background tabs. DPR capped.
 */
export default function MeshGradient({ onReady }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const programRef = useRef<Program | null>(null);
  const theme = useTheme();

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    let renderer: Renderer;
    try {
      renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio, 1.5), alpha: false, antialias: false });
    } catch {
      return; // no WebGL: the CSS fallback stays visible
    }
    const gl = renderer.gl;
    gl.canvas.style.width = "100%";
    gl.canvas.style.height = "100%";
    gl.canvas.style.display = "block";
    el.appendChild(gl.canvas);

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new Vec2(0.72, 0.62) },
        uRes: { value: new Vec2(1, 1) },
        uBase: { value: cssColor("--canvas") },
        uAccent: { value: cssColor("--accent") },
      },
    });
    programRef.current = program;
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    const resize = () => {
      const { width, height } = el.getBoundingClientRect();
      renderer.setSize(width, height);
      program.uniforms.uRes.value.set(width * renderer.dpr, height * renderer.dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const target = new Vec2(0.72, 0.62);
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      target.set((e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(el);

    let raf = 0;
    let first = true;
    const start = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden) return;
      const mouse = program.uniforms.uMouse.value as Vec2;
      mouse.x += (target.x - mouse.x) * 0.045;
      mouse.y += (target.y - mouse.y) * 0.045;
      program.uniforms.uTime.value = (now - start) / 1000;
      renderer.render({ scene: mesh });
      if (first) {
        first = false;
        onReady();
      }
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      programRef.current = null;
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      gl.canvas.remove();
    };
  }, [onReady]);

  // Re-read theme colours after a light/dark switch.
  useEffect(() => {
    const p = programRef.current;
    if (!p) return;
    p.uniforms.uBase.value = cssColor("--canvas");
    p.uniforms.uAccent.value = cssColor("--accent");
  }, [theme]);

  return <div ref={host} className="absolute inset-0" />;
}
