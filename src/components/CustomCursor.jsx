import { useEffect, useRef } from 'react';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  const isHoveringRef = useRef(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const onMouseMove = (e) => {
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;
    };

    const onMouseOver = (e) => {
      if (e.target.closest('a') || e.target.closest('button') || e.target.closest('[data-cursor-hover]')) {
        isHoveringRef.current = true;
      }
    };

    const onMouseOut = (e) => {
      if (e.target.closest('a') || e.target.closest('button') || e.target.closest('[data-cursor-hover]')) {
        isHoveringRef.current = false;
      }
    };

    let rafId;
    const animate = () => {
      positionRef.current.x += (targetRef.current.x - positionRef.current.x) * 0.15;
      positionRef.current.y += (targetRef.current.y - positionRef.current.y) * 0.15;

      const size = isHoveringRef.current ? 40 : 6;
      const borderWidth = isHoveringRef.current ? 1 : 0;
      const bgOpacity = isHoveringRef.current ? 0 : 1;

      cursor.style.transform = `translate(${positionRef.current.x - size / 2}px, ${positionRef.current.y - size / 2}px)`;
      cursor.style.width = `${size}px`;
      cursor.style.height = `${size}px`;
      cursor.style.borderWidth = `${borderWidth}px`;
      cursor.style.backgroundColor = `rgba(46, 92, 255, ${bgOpacity})`;

      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="custom-cursor"
      style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        backgroundColor: 'rgba(46, 92, 255, 1)',
        border: '0px solid rgba(46, 92, 255, 0.6)',
        transition: 'width 0.3s ease, height 0.3s ease, background-color 0.3s ease, border-width 0.3s ease',
        pointerEvents: 'none',
      }}
    />
  );
};

export default CustomCursor;
