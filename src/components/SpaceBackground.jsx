import React, { useEffect, useRef } from 'react';

/**
 * Next-Level SpaceBackground:
 * Features a depth-scaled canvas starfield with interactive mouse drift,
 * periodic shooting stars, and pulsing dual-tone cyan/rose nebulae.
 */
export default function SpaceBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // Multi-layer stars (foreground, midground, background)
    const starCount = 180;
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.8 + 0.3,
      alpha: Math.random() * 0.8 + 0.2,
      deltaAlpha: (Math.random() * 0.015 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
      speedY: Math.random() * 0.25 + 0.05,
      isNeonRose: Math.random() < 0.15,
      isCerulean: Math.random() < 0.25
    }));

    // Shooting stars
    let shootingStar = null;
    const spawnShootingStar = () => {
      shootingStar = {
        x: Math.random() * width * 0.8,
        y: Math.random() * height * 0.4,
        length: Math.random() * 80 + 40,
        speedX: Math.random() * 6 + 5,
        speedY: Math.random() * 4 + 3,
        opacity: 1
      };
    };

    let shootingTimer = setInterval(spawnShootingStar, 6000);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Subtle parallax offset based on cursor
      const offsetX = (mouseX - width / 2) * 0.02;
      const offsetY = (mouseY - height / 2) * 0.02;

      // Draw normal stars
      for (let star of stars) {
        star.alpha += star.deltaAlpha;
        if (star.alpha > 0.95 || star.alpha < 0.15) {
          star.deltaAlpha = -star.deltaAlpha;
        }

        star.y -= star.speedY;
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(star.x + offsetX * star.size, star.y + offsetY * star.size, star.size, 0, Math.PI * 2);

        if (star.isCerulean) {
          ctx.fillStyle = `rgba(0, 229, 255, ${Math.max(0.2, star.alpha)})`;
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#00e5ff';
        } else if (star.isNeonRose) {
          ctx.fillStyle = `rgba(255, 45, 149, ${Math.max(0.2, star.alpha)})`;
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#ff2d95';
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, star.alpha)})`;
          ctx.shadowBlur = star.size > 1.2 ? 5 : 0;
          ctx.shadowColor = '#ffffff';
        }

        ctx.fill();
      }

      // Draw shooting star
      if (shootingStar) {
        ctx.beginPath();
        ctx.moveTo(shootingStar.x, shootingStar.y);
        ctx.lineTo(
          shootingStar.x - shootingStar.length,
          shootingStar.y - (shootingStar.length * 0.6)
        );
        const grad = ctx.createLinearGradient(
          shootingStar.x,
          shootingStar.y,
          shootingStar.x - shootingStar.length,
          shootingStar.y - (shootingStar.length * 0.6)
        );
        grad.addColorStop(0, `rgba(0, 229, 255, ${shootingStar.opacity})`);
        grad.addColorStop(0.5, `rgba(255, 45, 149, ${shootingStar.opacity * 0.6})`);
        grad.addColorStop(1, 'transparent');

        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.stroke();

        shootingStar.x += shootingStar.speedX;
        shootingStar.y += shootingStar.speedY;
        shootingStar.opacity -= 0.02;

        if (shootingStar.opacity <= 0) {
          shootingStar = null;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(shootingTimer);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {/* 60fps Starfield Canvas */}
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />

      {/* Cyber Grid Floor */}
      <div className="cyber-grid-floor" />

      {/* Ambient Cerulean Blue Nebula */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '-10%',
          width: '650px',
          height: '650px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 123, 167, 0.3) 0%, rgba(0, 229, 255, 0.08) 50%, transparent 70%)',
          filter: 'blur(70px)',
          animation: 'cosmicDriftLeft 16s ease-in-out infinite alternate'
        }}
      />

      {/* Ambient Neon Rose Nebula */}
      <div
        style={{
          position: 'absolute',
          bottom: '-15%',
          right: '-10%',
          width: '700px',
          height: '700px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 45, 149, 0.28) 0%, rgba(255, 0, 127, 0.07) 50%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'cosmicDriftRight 18s ease-in-out infinite alternate'
        }}
      />

      <style>{`
        @keyframes cosmicDriftLeft {
          0% { transform: scale(0.9) translate(0, 0); opacity: 0.6; }
          100% { transform: scale(1.2) translate(50px, 30px); opacity: 0.95; }
        }
        @keyframes cosmicDriftRight {
          0% { transform: scale(1.15) translate(0, 0); opacity: 0.9; }
          100% { transform: scale(0.85) translate(-40px, -30px); opacity: 0.55; }
        }
      `}</style>
    </div>
  );
}
