'use client';

import { useEffect, useState } from 'react';
import i18n from 'i18next';

export default function DevelopmentMenu() {
  const [hidden, setHidden] = useState(false);
  const [frameRate, setFrameRate] = useState(0);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [now, setNow] = useState('');

  useEffect(() => {
    setNow(new Date().toUTCString());
  }, []);

  // Frame Rate
  useEffect(() => {
    let frameCount = 0;
    let lastUpdateTime = Date.now();
    const loop = () => {
      frameCount++;
      const now = Date.now();
      const timeDiff = now - lastUpdateTime;

      if (timeDiff > 1000) {
        setFrameRate(Math.round((frameCount * 1000) / timeDiff));
        frameCount = 0;
        lastUpdateTime = now;
      }

      requestAnimationFrame(loop);
    };

    loop();
  }, []);

  // Viewport
  useEffect(() => {
    const handleResize = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  function handleHide() {
    setHidden(!hidden);
  }

  return (
    <div className="absolute bottom-7 right-0 z-[999] w-96 max-w-full px-1 print:hidden">
      <div className="rounded bg-black/70 p-2 px-3 font-sans text-sm font-light text-white">
        <div className="relative h-full min-h-4 w-full text-xs">
          {hidden ? (
            <p>Show Debug Menu</p>
          ) : (
            <>
              <p>It is currently running in development mode.</p>
              <p>Date: {now}</p>
              <p>Viewport: {`${viewport.width}x${viewport.height}`}</p>
              <p>Frame Rate: {frameRate}fps</p>
              <p>Language: {i18n.language}</p>
            </>
          )}
          <button className={`absolute right-0 top-0 ${hidden && '-top-0.5'}`} onClick={handleHide}>
            {hidden ? '[+]' : '[-]'}
          </button>
        </div>
      </div>
    </div>
  );
}
