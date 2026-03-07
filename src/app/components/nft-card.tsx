import { MouseEvent, useRef, useState } from 'react';

interface NFTCardProps {
  imageUrl: string;
  title: string;
  link: string;
  className?: string;
}

export function NFTCard({ imageUrl, title, link, className = '' }: NFTCardProps) {
  const [, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!cardRef.current || window.innerWidth < 768) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    cardRef.current.style.transform = `
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale(1.05)
    `;
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!cardRef.current) return;

    cardRef.current.style.transform = `
      perspective(1000px)
      rotateX(0deg)
      rotateY(0deg)
      scale(1)
    `;
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <div className={`max-w-[300px] ${className}`}>
      <a
        ref={cardRef}
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="block transition-transform duration-200 ease-out"
        style={{ transformStyle: 'preserve-3d' }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={imageUrl}
          alt={title}
          className="w-full rounded-2xl shadow-lg"
          style={{
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'hidden',
          }}
        />
      </a>
      <p className="text-center text-sm text-[var(--muted)] mt-3">{title}</p>
    </div>
  );
}
