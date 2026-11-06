import React, { useEffect, useRef } from 'react';
import { MapTile, Position, WeatherType } from '../../domain/types/game.types';

interface PixelCanvasViewportProps {
  grid: readonly (readonly MapTile[])[];
  playerPosition: Position;
  weatherType: WeatherType;
  onTileClick?: (x: number, y: number) => void;
}

export const PixelCanvasViewport: React.FC<PixelCanvasViewportProps> = ({
  grid,
  playerPosition,
  weatherType,
  onTileClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const TILE_SIZE = 36;

  useEffect(() => {
    let animId: number;
    let tick = 0;
    const render = () => {
      tick++;
      drawScene(tick);
      animId = requestAnimationFrame(render);
    };
    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [grid, playerPosition, weatherType]);

  const drawScene = (tick: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#06070a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawTiles(ctx);
    drawPlayer(ctx, tick);
    drawLighting(ctx, tick);
    drawWeatherParticles(ctx, tick);
  };

  const drawTiles = (ctx: CanvasRenderingContext2D) => {
    grid.forEach((row, y) => {
      row.forEach((tile, x) => {
        const px = x * TILE_SIZE;
        const py = y * TILE_SIZE;
        drawSingleTile(ctx, tile, px, py);
      });
    });
  };

  const drawSingleTile = (ctx: CanvasRenderingContext2D, tile: MapTile, px: number, py: number) => {
    if (tile.type === 'wall') {
      ctx.fillStyle = '#181b24';
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = '#262c3a';
      ctx.fillRect(px + 2, py + 2, TILE_SIZE - 4, TILE_SIZE - 4);
    } else if (tile.type === 'water') {
      ctx.fillStyle = '#0f293d';
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
    } else {
      ctx.fillStyle = (tile.x + tile.y) % 2 === 0 ? '#11141c' : '#141822';
      ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
    }
    drawTileFeature(ctx, tile, px, py);
  };

  const drawTileFeature = (ctx: CanvasRenderingContext2D, tile: MapTile, px: number, py: number) => {
    if (tile.type === 'plate') {
      ctx.fillStyle = '#78350f';
      ctx.fillRect(px + 6, py + 6, TILE_SIZE - 12, TILE_SIZE - 12);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(px + 10, py + 10, TILE_SIZE - 20, TILE_SIZE - 20);
    } else if (tile.type === 'pillar_inactive' || tile.type === 'pillar_active') {
      const active = tile.type === 'pillar_active';
      ctx.fillStyle = active ? '#38bdf8' : '#334155';
      ctx.beginPath();
      ctx.arc(px + TILE_SIZE / 2, py + TILE_SIZE / 2, 10, 0, Math.PI * 2);
      ctx.fill();
    } else if (tile.type === 'gate_closed' || tile.type === 'gate_open') {
      ctx.fillStyle = tile.type === 'gate_closed' ? '#ef4444' : '#10b981';
      ctx.fillRect(px + 4, py + 14, TILE_SIZE - 8, 8);
    } else if (tile.type === 'chest') {
      ctx.fillStyle = '#d97706';
      ctx.fillRect(px + 8, py + 10, TILE_SIZE - 16, TILE_SIZE - 16);
    } else if (tile.type === 'stairs') {
      ctx.fillStyle = '#475569';
      ctx.fillRect(px + 4, py + 4, TILE_SIZE - 8, TILE_SIZE - 8);
    }
  };

  const drawPlayer = (ctx: CanvasRenderingContext2D, tick: number) => {
    const px = playerPosition.x * TILE_SIZE + TILE_SIZE / 2;
    const py = playerPosition.y * TILE_SIZE + TILE_SIZE / 2 + Math.sin(tick * 0.08) * 1.5;
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(px, py - 4, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(px - 6, py + 2, 12, 10);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(px + 7, py - 8, 3, 14);
  };

  const drawLighting = (ctx: CanvasRenderingContext2D, tick: number) => {
    const flicker = Math.sin(tick * 0.1) * 6;
    const radius = 120 + flicker;
    const px = playerPosition.x * TILE_SIZE + TILE_SIZE / 2;
    const py = playerPosition.y * TILE_SIZE + TILE_SIZE / 2;
    const gradient = ctx.createRadialGradient(px, py, 15, px, py, radius);
    gradient.addColorStop(0, 'rgba(245, 158, 11, 0.25)');
    gradient.addColorStop(0.5, 'rgba(15, 23, 42, 0.45)');
    gradient.addColorStop(1, 'rgba(6, 7, 10, 0.94)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  };

  const drawWeatherParticles = (ctx: CanvasRenderingContext2D, tick: number) => {
    if (weatherType === 'acid_rain') {
      ctx.strokeStyle = 'rgba(74, 222, 128, 0.4)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 35; i++) {
        const x = (i * 29 + tick * 3) % ctx.canvas.width;
        const y = (i * 37 + tick * 9) % ctx.canvas.height;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - 2, y + 8);
        ctx.stroke();
      }
    } else if (weatherType === 'ash_storm') {
      ctx.fillStyle = 'rgba(203, 213, 225, 0.35)';
      for (let i = 0; i < 25; i++) {
        const x = (i * 31 + Math.sin(tick * 0.05 + i) * 20) % ctx.canvas.width;
        const y = (i * 41 + tick * 1.5) % ctx.canvas.height;
        ctx.fillRect(x, y, 2, 2);
      }
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / TILE_SIZE);
    const y = Math.floor((e.clientY - rect.top) / TILE_SIZE);
    onTileClick?.(x, y);
  };

  return (
    <div className="relative flex justify-center items-center bg-black/90 p-2 rounded-xl border border-slate-800 shadow-2xl overflow-hidden">
      <canvas
        ref={canvasRef}
        width={18 * TILE_SIZE}
        height={14 * TILE_SIZE}
        onClick={handleCanvasClick}
        className="w-full max-w-[648px] h-auto aspect-[18/14] cursor-pointer touch-none"
      />
    </div>
  );
};
