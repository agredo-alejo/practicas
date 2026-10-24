"use client";
import { useEffect, useRef, useState } from "react";

export function Playground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = { x: -1000, y: -1000 };
    let frame = 0, width = 0, height = 0, visible = true;
    const points = Array.from({ length: 16 }, (_, i) => ({ x: ((i * 73 + 13) % 300) / 300, y: ((i * 47 + 31) % 170) / 170 }));
    function paint(time = 0) {
      if (!context || !canvas) return;
      context.clearRect(0, 0, width, height);
      const positions = points.map((point, index) => ({ x: point.x * width + Math.sin(time * .00018 + index) * 12, y: point.y * height + Math.cos(time * .00015 + index * 1.8) * 12 }));
      positions.forEach((point, index) => {
        positions.slice(index + 1).forEach(other => {
          const distance = Math.hypot(point.x - other.x, point.y - other.y);
          if (distance < 104) { context.beginPath(); context.moveTo(point.x, point.y); context.lineTo(other.x, other.y); context.strokeStyle = `rgba(91,157,226,${.24 * (1 - distance / 104)})`; context.stroke(); }
        });
        const near = Math.hypot(point.x - pointer.x, point.y - pointer.y) < 90;
        context.save(); context.translate(point.x, point.y); context.rotate(index * .8 + time * .00005);
        context.beginPath(); context.moveTo(0, -7); context.lineTo(6, 5); context.lineTo(-6, 5); context.closePath();
        context.fillStyle = near ? "rgba(86,187,245,.65)" : index % 4 === 0 ? "rgba(71,137,218,.4)" : "rgba(146,155,170,.12)"; context.fill();
        context.strokeStyle = near ? "#70c9ff" : "rgba(101,153,218,.3)"; context.stroke(); context.restore();
      });
    }
    function animate(time: number) { if (visible) paint(time); frame = requestAnimationFrame(animate); }
    const observer = new ResizeObserver(() => { const bounds = canvas.getBoundingClientRect(); width = bounds.width; height = bounds.height; const ratio = Math.min(window.devicePixelRatio || 1, 2); canvas.width = width * ratio; canvas.height = height * ratio; context.setTransform(ratio, 0, 0, ratio, 0, 0); paint(); if (width && height) setReady(true); });
    observer.observe(canvas);
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }); intersection.observe(canvas);
    const move = (event: PointerEvent) => { const bounds = canvas.getBoundingClientRect(); pointer.x = event.clientX - bounds.left; pointer.y = event.clientY - bounds.top; if (paused || reducedMotion.matches) paint(); };
    const leave = () => { pointer.x = -1000; pointer.y = -1000; if (paused || reducedMotion.matches) paint(); };
    const motion = () => { cancelAnimationFrame(frame); if (!paused && !reducedMotion.matches) frame = requestAnimationFrame(animate); else paint(); };
    canvas.addEventListener("pointermove", move); canvas.addEventListener("pointerleave", leave); reducedMotion.addEventListener("change", motion); motion();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); intersection.disconnect(); canvas.removeEventListener("pointermove", move); canvas.removeEventListener("pointerleave", leave); reducedMotion.removeEventListener("change", motion); };
  }, [paused]);
  return <aside className="small-playground"><div className="playground-caption"><span>A little room to play</span><button type="button" onClick={() => setPaused(!paused)} aria-pressed={paused} aria-label={paused ? "Resume sketch animation" : "Pause sketch animation"}>{paused ? "play ▷" : "pause Ⅱ"}</button></div><div className="playground-stage">{!ready && <svg viewBox="0 0 400 165" aria-hidden="true" className="playground-fallback"><path d="m25 109 62-46 61 33 56-52 58 54 51-38 54 54M87 63l61 33 56-52 58 54-49-38M148 96l57 39 57-37" fill="none" stroke="#536d8b" strokeOpacity=".3" />{[[25,109],[87,63],[148,96],[204,44],[262,98],[313,60],[367,114],[205,135]].map(([x,y], index) => <path key={index} d={`M${x} ${y-7}l7 13-14-2Z`} fill={index % 3 === 0 ? "#357db2" : "#465c77"} fillOpacity=".45" stroke="#7397bd" strokeOpacity=".35" />)}</svg>}<canvas ref={canvasRef} aria-label="A small animated sketch of connected geometric shapes. Move your pointer across it to highlight nearby shapes." role="img" /></div><p className="font-mono text-xs text-muted">points → connections → something new</p></aside>;
}
