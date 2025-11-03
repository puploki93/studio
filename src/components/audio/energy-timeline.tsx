'use client';

import * as React from 'react';
import { useRef, useEffect } from 'react';
import type { AudioAnalysisResult } from '@/lib/audio/types';

interface EnergyTimelineProps {
  analysis: AudioAnalysisResult | null;
  currentTime?: number;
  predictedEnergy?: number[]; // AI-predicted energy path
  targetEnergy?: number[]; // AI-suggested energy path
  height?: number;
  className?: string;
}

export function EnergyTimeline({
  analysis,
  currentTime = 0,
  predictedEnergy,
  targetEnergy,
  height = 150,
  className = '',
}: EnergyTimelineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !analysis) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const energyCurve = analysis.energyCurve;

    // Clear canvas
    ctx.fillStyle = '#0a1f1f';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#254A4D';
    ctx.lineWidth = 0.5;

    // Horizontal grid lines (energy levels)
    for (let i = 0; i <= 10; i += 2) {
      const y = height - (i / 10) * height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();

      // Label
      ctx.fillStyle = '#254A4D';
      ctx.font = '10px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(i.toString(), 20, y + 3);
    }

    // Vertical grid lines (time)
    const duration = analysis.features.duration;
    const timeSteps = 6; // Every 10% of duration
    for (let i = 0; i <= timeSteps; i++) {
      const x = (i / timeSteps) * width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();

      // Time label
      const time = (duration * i) / timeSteps;
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      ctx.fillStyle = '#254A4D';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${minutes}:${seconds.toString().padStart(2, '0')}`, x, height - 5);
    }

    // Draw AI target energy path (dotted line)
    if (targetEnergy && targetEnergy.length > 0) {
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = '#06FF00';
      ctx.lineWidth = 2;
      ctx.beginPath();

      targetEnergy.forEach((energy, i) => {
        const x = (i / targetEnergy.length) * width;
        const y = height - (energy / 10) * height;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw actual energy curve (solid line)
    ctx.strokeStyle = '#02D3E9';
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    energyCurve.forEach((energy, i) => {
      const x = (i / energyCurve.length) * width;
      const y = height - (energy / 10) * height;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Fill area under curve
    ctx.fillStyle = 'rgba(2, 211, 233, 0.15)';
    ctx.beginPath();
    ctx.moveTo(0, height);

    energyCurve.forEach((energy, i) => {
      const x = (i / energyCurve.length) * width;
      const y = height - (energy / 10) * height;
      ctx.lineTo(x, y);
    });

    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();

    // Mark peaks and valleys
    ctx.fillStyle = '#06FF00';
    let lastPeak = -1;

    energyCurve.forEach((energy, i) => {
      const isPeak =
        i > 0 &&
        i < energyCurve.length - 1 &&
        energy > energyCurve[i - 1] &&
        energy > energyCurve[i + 1] &&
        energy > 7; // Only mark high energy peaks

      if (isPeak && i - lastPeak > 10) {
        // Ensure peaks aren't too close
        const x = (i / energyCurve.length) * width;
        const y = height - (energy / 10) * height;

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();

        // Peak label
        ctx.fillStyle = '#06FF00';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('▲', x, y - 8);

        lastPeak = i;
      }
    });

    // Draw current position indicator
    if (duration > 0) {
      const x = (currentTime / duration) * width;

      // Vertical line
      ctx.strokeStyle = '#FF0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();

      // Circle at current energy
      const currentIndex = Math.floor((currentTime / duration) * energyCurve.length);
      if (currentIndex < energyCurve.length) {
        const currentEnergy = energyCurve[currentIndex];
        const y = height - (currentEnergy / 10) * height;

        ctx.fillStyle = '#FFFF00';
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();

        // Energy value label
        ctx.fillStyle = '#FFFF00';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(currentEnergy.toFixed(1), x, y - 12);
      }
    }

    // Analyze and display insights
    const maxEnergy = Math.max(...energyCurve);
    const minEnergy = Math.min(...energyCurve);
    const avgEnergy = energyCurve.reduce((sum, e) => sum + e, 0) / energyCurve.length;

    ctx.fillStyle = '#02D3E9';
    ctx.font = '11px monospace';
    ctx.textAlign = 'left';

    let textY = 15;
    ctx.fillText(`Max Energy: ${maxEnergy.toFixed(1)}`, 30, textY);
    textY += 15;
    ctx.fillText(`Avg Energy: ${avgEnergy.toFixed(1)}`, 30, textY);
    textY += 15;
    ctx.fillText(`Min Energy: ${minEnergy.toFixed(1)}`, 30, textY);

    // If we have target energy, show comparison
    if (targetEnergy && targetEnergy.length > 0) {
      const targetAvg = targetEnergy.reduce((sum, e) => sum + e, 0) / targetEnergy.length;
      const diff = avgEnergy - targetAvg;

      ctx.fillStyle = diff > 0 ? '#06FF00' : '#FF4444';
      textY += 20;
      ctx.fillText(
        diff > 0 ? `✓ ${diff.toFixed(1)} above target` : `⚠ ${Math.abs(diff).toFixed(1)} below target`,
        30,
        textY
      );
    }
  }, [analysis, currentTime, predictedEnergy, targetEnergy, height]);

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        width={800}
        height={height}
        className="w-full h-full rounded-lg border border-primary/20"
        style={{ imageRendering: 'auto' }}
      />
      <div className="absolute bottom-2 right-2 flex gap-4 text-xs text-muted-foreground bg-black/50 px-2 py-1 rounded">
        <span className="flex items-center gap-1">
          <span className="w-4 h-2 bg-[#02D3E9]"></span>
          Actual
        </span>
        {targetEnergy && (
          <span className="flex items-center gap-1">
            <span className="w-4 h-px border-t-2 border-dashed border-[#06FF00]"></span>
            AI Target
          </span>
        )}
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#06FF00]"></span>
          Peak
        </span>
      </div>
    </div>
  );
}
