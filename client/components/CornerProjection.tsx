import { useEffect, useRef } from "react";

const IMAGE_URL = "https://cdn.builder.io/api/v1/image/assets%2Ffc901443fab84aa8b693d18e3aae9f4e%2F1208e3e3f1eb4c309e162d8a2e78961b?format=webp&width=800";

export default function CornerProjection() {
  const elRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef({ tx: 0, ty: 0 });

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const supportsReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (supportsReduced) return;

    function onMove(e: MouseEvent) {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      if (rafRef.current == null) rafRef.current = requestAnimationFrame(tick);
    }

    function tick() {
      rafRef.current = null;
      const { innerWidth, innerHeight } = window;
      const mx = (mouse.current.x / innerWidth) * 2 - 1; // -1..1
      const my = (mouse.current.y / innerHeight) * 2 - 1;

      // compute subtle offset (sliding) toward corners depending on cursor
      const tx = Math.round(mx * 18); // px
      const ty = Math.round(my * 12); // px

      // compute rotation based on direction
      const rx = Math.round(-my * 6);
      const ry = Math.round(mx * 6);

      // smooth interpolate
      pos.current.tx += (tx - pos.current.tx) * 0.18;
      pos.current.ty += (ty - pos.current.ty) * 0.18;

      el.style.setProperty("--tx", `${pos.current.tx.toFixed(2)}px`);
      el.style.setProperty("--ty", `${pos.current.ty.toFixed(2)}px`);
      el.style.setProperty("--rx", `${rx}deg`);
      el.style.setProperty("--ry", `${ry}deg`);
    }

    window.addEventListener("mousemove", onMove);

    // idle animation
    let idleT = 0;
    let idleRaf: number | null = null;
    function idle() {
      idleT += 0.01;
      const bx = Math.sin(idleT) * 6;
      const by = Math.cos(idleT * 0.7) * 4;
      el.style.setProperty("--bx", `${bx.toFixed(2)}px`);
      el.style.setProperty("--by", `${by.toFixed(2)}px`);
      idleRaf = requestAnimationFrame(idle);
    }
    idleRaf = requestAnimationFrame(idle);

    return () => {
      window.removeEventListener("mousemove", onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (idleRaf) cancelAnimationFrame(idleRaf);
    };
  }, []);

  return (
    <div
      ref={elRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        // expose CSS vars for transforms
        ['--tx' as any]: '0px',
        ['--ty' as any]: '0px',
        ['--rx' as any]: '0deg',
        ['--ry' as any]: '0deg',
        ['--bx' as any]: '0px',
        ['--by' as any]: '0px',
      }}
    >
      {/* Four corner projections - they will subtly slide/rotate on cursor move */}
      <div className="absolute left-0 top-0 m-6 transform-gpu transition-transform duration-200" style={{ transform: 'translate3d(calc(var(--tx) * -0.4 + var(--bx)), calc(var(--ty) * -0.6 + var(--by)), 0) rotateX(var(--rx)) rotateY(var(--ry))' }}>
        <img src={IMAGE_URL} alt="decor" className="h-28 w-28 object-cover rounded-lg opacity-70 mix-blend-screen drop-shadow-2xl" />
      </div>

      <div className="absolute right-0 top-0 m-6 transform-gpu transition-transform duration-200" style={{ transform: 'translate3d(calc(var(--tx) * 0.6 + var(--bx)), calc(var(--ty) * -0.5 + var(--by)), 0) rotateX(var(--rx)) rotateY(var(--ry))' }}>
        <img src={IMAGE_URL} alt="decor" className="h-36 w-36 object-cover rounded-xl opacity-60 mix-blend-screen drop-shadow-2xl" />
      </div>

      <div className="absolute left-0 bottom-0 m-6 transform-gpu transition-transform duration-200" style={{ transform: 'translate3d(calc(var(--tx) * -0.5 + var(--bx)), calc(var(--ty) * 0.6 + var(--by)), 0) rotateX(var(--rx)) rotateY(var(--ry))' }}>
        <img src={IMAGE_URL} alt="decor" className="h-32 w-32 object-cover rounded-lg opacity-60 mix-blend-multiply drop-shadow-2xl" />
      </div>

      <div className="absolute right-0 bottom-0 m-6 transform-gpu transition-transform duration-200" style={{ transform: 'translate3d(calc(var(--tx) * 0.4 + var(--bx)), calc(var(--ty) * 0.5 + var(--by)), 0) rotateX(var(--rx)) rotateY(var(--ry))' }}>
        <img src={IMAGE_URL} alt="decor" className="h-24 w-24 object-cover rounded-md opacity-50 mix-blend-screen drop-shadow-2xl" />
      </div>

      <style>{`
        /* Small mask/slit effect */
        @media (prefers-reduced-motion: no-preference) {
          .corner-slit::after { content: ''; position: absolute; inset: 0; pointer-events: none; background: linear-gradient(90deg, rgba(255,255,255,0.02), rgba(255,255,255,0)); mix-blend-mode: overlay; }
        }
      `}</style>
    </div>
  );
}
