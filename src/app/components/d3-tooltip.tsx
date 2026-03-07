import { MouseEvent, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface D3TooltipProps {
  children: React.ReactNode;
}

export function D3Tooltip({ children }: D3TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLSpanElement>(null);

  const handleMouseEnter = (e: MouseEvent<HTMLSpanElement>) => {
    setIsVisible(true);
    updatePosition(e);
  };

  const handleMouseMove = (e: MouseEvent<HTMLSpanElement>) => {
    updatePosition(e);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  const updatePosition = (e: MouseEvent<HTMLSpanElement>) => {
    setPosition({
      x: e.clientX,
      y: e.clientY - 60,
    });
  };

  return (
    <>
      <span
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative cursor-help border-b border-dashed border-[var(--accent)] text-[var(--accent)]"
      >
        D3
      </span>

      {isVisible &&
        createPortal(
          <span
            ref={tooltipRef}
            className="fixed z-50 px-3 py-2 text-sm bg-[var(--popover)] text-[var(--popover-foreground)] border border-[var(--border)] max-w-xs pointer-events-none block"
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`,
              transform: 'translateX(-50%)',
            }}
          >
            {children}
          </span>,
          document.body,
        )}
    </>
  );
}
