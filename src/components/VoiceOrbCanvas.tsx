import React, { useEffect, useRef } from 'react';
import { AssistantState } from '../types';

interface VoiceOrbCanvasProps {
  state: AssistantState;
  audioLevel?: number; // 0 to 1
  size?: number;
}

export const VoiceOrbCanvas: React.FC<VoiceOrbCanvasProps> = ({
  state,
  audioLevel = 0,
  size = 220,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    // Particle system for glowing sound aura
    const particles: { angle: number; distance: number; speed: number; size: number; alpha: number }[] = [];
    const particleCount = 28;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        angle: (i / particleCount) * Math.PI * 2,
        distance: size * 0.35 + Math.random() * (size * 0.15),
        speed: 0.008 + Math.random() * 0.012,
        size: 1.5 + Math.random() * 2.5,
        alpha: 0.2 + Math.random() * 0.6,
      });
    }

    const render = () => {
      time += 0.035;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Determine state dynamic parameters
      let baseScale = 1.0;
      let primaryColor = 'rgba(124, 77, 255, '; // Purple
      let secondaryColor = 'rgba(0, 229, 255, '; // Cyan
      let coreColor = 'rgba(168, 85, 247, ';

      switch (state) {
        case 'listening':
          baseScale = 1.05 + audioLevel * 0.35;
          primaryColor = 'rgba(0, 229, 255, '; // Electric Cyan
          secondaryColor = 'rgba(124, 77, 255, ';
          coreColor = 'rgba(56, 189, 248, ';
          break;
        case 'thinking':
          baseScale = 1.0 + Math.sin(time * 3) * 0.08;
          primaryColor = 'rgba(217, 70, 239, '; // Neon Fuchsia
          secondaryColor = 'rgba(99, 102, 241, '; // Indigo
          coreColor = 'rgba(236, 72, 153, ';
          break;
        case 'speaking':
          baseScale = 1.04 + Math.abs(Math.sin(time * 4)) * 0.18;
          primaryColor = 'rgba(52, 211, 153, '; // Emerald
          secondaryColor = 'rgba(56, 189, 248, '; // Cyan
          coreColor = 'rgba(16, 185, 129, ';
          break;
        case 'error':
          baseScale = 1.0;
          primaryColor = 'rgba(244, 63, 94, '; // Rose / Red
          secondaryColor = 'rgba(251, 146, 60, ';
          coreColor = 'rgba(239, 68, 68, ';
          break;
        case 'idle':
        default:
          baseScale = 0.98 + Math.sin(time * 1.5) * 0.04;
          primaryColor = 'rgba(99, 102, 241, '; // Soft Indigo
          secondaryColor = 'rgba(168, 85, 247, '; // Purple
          coreColor = 'rgba(129, 140, 248, ';
          break;
      }

      const orbRadius = (size * 0.28) * baseScale;

      // 1. Outer Glow Aura (Radial Gradient)
      const outerGlow = ctx.createRadialGradient(
        centerX,
        centerY,
        orbRadius * 0.3,
        centerX,
        centerY,
        orbRadius * 2.2
      );
      outerGlow.addColorStop(0, primaryColor + '0.45)');
      outerGlow.addColorStop(0.4, secondaryColor + '0.22)');
      outerGlow.addColorStop(1, 'rgba(7, 11, 25, 0)');

      ctx.fillStyle = outerGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, orbRadius * 2.2, 0, Math.PI * 2);
      ctx.fill();

      // 2. Swirling Sound Particles
      for (const p of particles) {
        p.angle += p.speed * (state === 'thinking' ? 2.5 : 1);
        const currentDist = p.distance * baseScale;
        const px = centerX + Math.cos(p.angle) * currentDist;
        const py = centerY + Math.sin(p.angle) * currentDist;

        ctx.fillStyle = primaryColor + (p.alpha * (state === 'listening' ? 1.0 : 0.6)) + ')';
        ctx.beginPath();
        ctx.arc(px, py, p.size * (state === 'listening' ? 1.4 : 1), 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Middle Halo Ring
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(time * (state === 'thinking' ? 1.8 : 0.4));

      ctx.strokeStyle = primaryColor + '0.4)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([8, 12]);
      ctx.beginPath();
      ctx.arc(0, 0, orbRadius * 1.25, 0, Math.PI * 2);
      ctx.stroke();

      if (state === 'thinking') {
        ctx.strokeStyle = secondaryColor + '0.6)';
        ctx.lineWidth = 2;
        ctx.setLineDash([16, 20]);
        ctx.beginPath();
        ctx.arc(0, 0, orbRadius * 1.4, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      // 4. Orb Core with 3D spherical shading
      const coreGradient = ctx.createRadialGradient(
        centerX - orbRadius * 0.3,
        centerY - orbRadius * 0.35,
        orbRadius * 0.1,
        centerX,
        centerY,
        orbRadius
      );
      coreGradient.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      coreGradient.addColorStop(0.25, coreColor + '0.9)');
      coreGradient.addColorStop(0.65, primaryColor + '0.75)');
      coreGradient.addColorStop(0.95, secondaryColor + '0.5)');
      coreGradient.addColorStop(1, 'rgba(10, 16, 38, 0.3)');

      ctx.fillStyle = coreGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, orbRadius, 0, Math.PI * 2);
      ctx.fill();

      // 5. Specular highlight for glass orb depth
      const highlight = ctx.createRadialGradient(
        centerX - orbRadius * 0.35,
        centerY - orbRadius * 0.4,
        1,
        centerX - orbRadius * 0.35,
        centerY - orbRadius * 0.4,
        orbRadius * 0.45
      );
      highlight.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
      highlight.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = highlight;
      ctx.beginPath();
      ctx.arc(centerX - orbRadius * 0.35, centerY - orbRadius * 0.4, orbRadius * 0.45, 0, Math.PI * 2);
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [state, audioLevel, size]);

  return (
    <div className="relative flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="transition-transform duration-300"
      />
    </div>
  );
};
