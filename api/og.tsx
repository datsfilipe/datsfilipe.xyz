import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

const WIDTH = 1200;
const HEIGHT = 630;
const BG = '#181818';
const WHITE = '#e8e8e8';
const BLUE = '#3e6cef';
const MUTED = '#525252';

export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') || 'Filipe Lima';
  const subtitle = searchParams.get('subtitle') || '';

  return new ImageResponse(
    <div
      style={{
        width: WIDTH,
        height: HEIGHT,
        background: BG,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'monospace',
        position: 'relative',
      }}
    >
      {/* Fading text layers */}
      {[-2, -1, 0, 1, 2].map((offset, i) => {
        const opacities = [0.04, 0.08, 1, 0.08, 0.04];
        const xShifts = [20, 10, 0, -10, -20];
        const fontSize = title.length > 30 ? 48 : title === 'Filipe Lima' ? 72 : 56;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: HEIGHT / 2 - 40 + offset * fontSize * 0.6,
              left: WIDTH / 2 + xShifts[i],
              transform: 'translateX(-50%)',
              display: 'flex',
              opacity: opacities[i],
              fontSize,
              fontWeight: 600,
            }}
          >
            <span style={{ color: WHITE }}>
              {title === 'Filipe Lima' ? 'Filipe ' : title.slice(0, Math.ceil(title.length / 2))}
            </span>
            <span style={{ color: BLUE }}>
              {title === 'Filipe Lima' ? 'Lima' : title.slice(Math.ceil(title.length / 2))}
            </span>
          </div>
        );
      })}

      {/* Subtitle */}
      {subtitle && (
        <div
          style={{
            position: 'absolute',
            top: HEIGHT / 2 + 60,
            fontSize: 24,
            color: MUTED,
          }}
        >
          {subtitle}
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          display: 'flex',
          fontSize: 18,
        }}
      >
        <span style={{ color: WHITE }}>datsfilipe</span>
        <span style={{ color: BLUE }}>.xyz</span>
      </div>
    </div>,
    {
      width: WIDTH,
      height: HEIGHT,
    },
  );
}
