import { useState, useEffect, useCallback } from 'react';

const SESSION_KEY = 'rr-demo-tour-done';
const TOOLTIP_W = 264;
const GAP = 12; // px gap between target edge and tooltip

// ─── querySelector that understands :contains("text") ────────────────────────
function findElement(selector) {
  const parts = selector.split(',').map((s) => s.trim());
  for (const part of parts) {
    const containsMatch = part.match(/:contains\("([^"]+)"\)/);
    if (containsMatch) {
      const base = part.slice(0, part.search(/:contains\(/)).trim() || '*';
      const text = containsMatch[1];
      try {
        const els = document.querySelectorAll(base);
        for (const el of els) {
          if (el.textContent.trim().includes(text)) return el;
        }
      } catch {
        // skip invalid base selector
      }
    } else {
      try {
        const el = document.querySelector(part);
        if (el) return el;
      } catch {
        // skip invalid selector
      }
    }
  }
  return null;
}

// ─── Compute fixed tooltip coordinates ───────────────────────────────────────
function computeTooltipStyle(rect, position) {
  if (!rect) return { position: 'fixed', width: TOOLTIP_W, top: '50%', left: '50%', transform: 'translate(-50%,-50%)' };

  const cx = rect.left + rect.width / 2;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let top, left, bottom, right;

  switch (position) {
    case 'top':
      bottom = vh - rect.top + GAP;
      left = Math.min(Math.max(cx - TOOLTIP_W / 2, 8), vw - TOOLTIP_W - 8);
      return { position: 'fixed', width: TOOLTIP_W, bottom, left };
    case 'left':
      top = Math.min(Math.max(rect.top + rect.height / 2 - 56, 8), vh - 140);
      right = vw - rect.left + GAP;
      return { position: 'fixed', width: TOOLTIP_W, top, right };
    case 'right':
      top = Math.min(Math.max(rect.top + rect.height / 2 - 56, 8), vh - 140);
      left = rect.right + GAP;
      return { position: 'fixed', width: TOOLTIP_W, top, left };
    case 'bottom':
    default:
      top = rect.bottom + GAP;
      left = Math.min(Math.max(cx - TOOLTIP_W / 2, 8), vw - TOOLTIP_W - 8);
      return { position: 'fixed', width: TOOLTIP_W, top, left };
  }
}

// arrow side relative to the tooltip box (opposite of tooltip position)
const ARROW_SIDE = { bottom: 'top', top: 'bottom', left: 'right', right: 'left' };

function arrowStyle(position, tooltipStyle) {
  // The arrow is a rotated square peeking out of the tooltip edge
  const base = {
    position: 'absolute',
    width: 10,
    height: 10,
    background: '#1e293b',
    transform: 'rotate(45deg)',
  };
  switch (ARROW_SIDE[position] || 'top') {
    case 'top':    return { ...base, top: -5,    left: '50%', marginLeft: -5 };
    case 'bottom': return { ...base, bottom: -5, left: '50%', marginLeft: -5 };
    case 'left':   return { ...base, left: -5,   top: 36 };
    case 'right':  return { ...base, right: -5,  top: 36 };
    default:       return { ...base, top: -5,    left: '50%', marginLeft: -5 };
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
export function DemoTooltips({ steps }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [done, setDone] = useState(() => sessionStorage.getItem(SESSION_KEY) === '1');
  const [rect, setRect] = useState(null);

  const step = steps?.[stepIdx];

  const measure = useCallback(() => {
    if (!step) return;
    const el = findElement(step.targetSelector);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      // Wait briefly for scroll to settle then snapshot the rect
      setTimeout(() => setRect(el.getBoundingClientRect()), 300);
    } else {
      setRect(null);
    }
  }, [step]);

  useEffect(() => {
    if (done) return;
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [done, measure]);

  const handleNext = () => {
    if (stepIdx + 1 >= steps.length) {
      handleDone();
    } else {
      setStepIdx((i) => i + 1);
    }
  };

  const handleDone = () => {
    sessionStorage.setItem(SESSION_KEY, '1');
    setDone(true);
  };

  if (done || !step) return null;

  const position = step.position || 'bottom';
  const tooltipPos = computeTooltipStyle(rect, position);

  return (
    <>
      {/* ── Spotlight backdrop ── */}
      {rect ? (
        <div aria-hidden="true" style={{ pointerEvents: 'none' }}>
          {/* top strip */}
          <div style={{ position: 'fixed', inset: 0, top: 0, height: rect.top, background: 'rgba(0,0,0,0.5)', zIndex: 50 }} />
          {/* bottom strip */}
          <div style={{ position: 'fixed', top: rect.bottom, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50 }} />
          {/* left strip (between top and bottom) */}
          <div style={{ position: 'fixed', top: rect.top, left: 0, width: rect.left, height: rect.height, background: 'rgba(0,0,0,0.5)', zIndex: 50 }} />
          {/* right strip */}
          <div style={{ position: 'fixed', top: rect.top, left: rect.right, right: 0, height: rect.height, background: 'rgba(0,0,0,0.5)', zIndex: 50 }} />
          {/* highlight ring */}
          <div style={{
            position: 'fixed',
            top: rect.top - 3,
            left: rect.left - 3,
            width: rect.width + 6,
            height: rect.height + 6,
            borderRadius: 8,
            outline: '2px solid rgba(251,191,36,0.85)',
            boxShadow: '0 0 0 4px rgba(251,191,36,0.15)',
            zIndex: 50,
          }} />
        </div>
      ) : (
        <div aria-hidden="true" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, pointerEvents: 'none' }} />
      )}

      {/* ── Tooltip card ── */}
      <div style={{ ...tooltipPos, zIndex: 60 }}>
        {rect && <div style={arrowStyle(position, tooltipPos)} />}
        <div style={{
          background: '#1e293b',
          borderRadius: 10,
          padding: '14px 16px',
          boxShadow: '0 10px 32px rgba(0,0,0,0.35)',
          position: 'relative',
        }}>
          <p style={{ fontSize: 11, color: '#64748b', fontWeight: 600, marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            Step {stepIdx + 1} of {steps.length}
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.55, color: '#e2e8f0', margin: '0 0 14px' }}>
            {step.message}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button
              onClick={handleDone}
              style={{ fontSize: 12, color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline', textUnderlineOffset: 2 }}
            >
              Skip tour
            </button>
            <button
              onClick={handleNext}
              style={{ fontSize: 13, fontWeight: 700, background: '#f59e0b', color: '#1e293b', border: 'none', borderRadius: 6, padding: '7px 16px', cursor: 'pointer', transition: 'background 0.15s' }}
            >
              {stepIdx + 1 >= steps.length ? 'Done ✓' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
