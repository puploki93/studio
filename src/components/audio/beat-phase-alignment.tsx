'use client';

import * as React from 'react';
import { useRef, useEffect } from 'react';
import { useBeatPhaseAlignment } from '@/hooks/use-audio-analysis';

interface BeatPhaseAlignmentProps {
  deckAElement: HTMLAudioElement | null;
  deckBElement: HTMLAudioElement | null;
  deckABpm: number;
  deckBBpm: number;
  height?: number;
  className?: string;
}

export function BeatPhaseAlignment({
  deckAElement,
  deckBElement,
  deckABpm,
  deckBBpm,
  height = 200,
  className = '',
}: BeatPhaseAlignmentProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phaseInfo = useBeatPhaseAlignment(deckAElement, deckBElement, deckABpm, deckBBpm);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const deckHeight = height / 3;
    const centerY = height / 2;

    // Clear canvas
    ctx.fillStyle = '#0a1f1f';
    ctx.fillRect(0, 0, width, height);

    // Draw deck labels
    ctx.fillStyle = '#02D3E9';
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`DECK A (${deckABpm} BPM)`, 10, 20);

    ctx.fillStyle = '#06FF00';
    ctx.fillText(`DECK B (${deckBBpm} BPM)`, 10, height - 10);

    // Calculate beat positions within the visible window (show 4 beats)
    const beatsToShow = 4;
    const beatLengthA = 60 / deckABpm; // seconds per beat
    const beatLengthB = 60 / deckBBpm;

    const beatWidthA = width / (beatsToShow + 1);
    const beatWidthB = width / (beatsToShow + 1);

    // Get current beat position (0-1 within a beat)
    const beatPositionA = (phaseInfo.deckAPosition % beatLengthA) / beatLengthA;
    const beatPositionB = (phaseInfo.deckBPosition % beatLengthB) / beatLengthB;

    // Draw Deck A beats
    ctx.strokeStyle = '#02D3E9';
    ctx.lineWidth = 3;

    for (let i = 0; i < beatsToShow; i++) {
      const x = beatWidthA * (i + 1 - beatPositionA);

      if (x > 0 && x < width) {
        // Beat one is taller
        const beatOne = Math.floor(phaseInfo.deckAPosition / beatLengthA) % 4 === i % 4;
        const lineHeight = beatOne ? deckHeight * 0.9 : deckHeight * 0.6;

        ctx.beginPath();
        ctx.moveTo(x, centerY - deckHeight / 2);
        ctx.lineTo(x, centerY - deckHeight / 2 + lineHeight);
        ctx.stroke();

        // Beat number
        if (beatOne) {
          ctx.fillStyle = '#02D3E9';
          ctx.font = 'bold 12px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('1', x, centerY - deckHeight / 2 + lineHeight + 15);
        }
      }
    }

    // Draw Deck B beats
    ctx.strokeStyle = '#06FF00';
    ctx.lineWidth = 3;

    for (let i = 0; i < beatsToShow; i++) {
      const x = beatWidthB * (i + 1 - beatPositionB);

      if (x > 0 && x < width) {
        const beatOne = Math.floor(phaseInfo.deckBPosition / beatLengthB) % 4 === i % 4;
        const lineHeight = beatOne ? deckHeight * 0.9 : deckHeight * 0.6;

        ctx.beginPath();
        ctx.moveTo(x, centerY + deckHeight / 2 - lineHeight);
        ctx.lineTo(x, centerY + deckHeight / 2);
        ctx.stroke();

        if (beatOne) {
          ctx.fillStyle = '#06FF00';
          ctx.font = 'bold 12px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('1', x, centerY + deckHeight / 2 - lineHeight - 5);
        }
      }
    }

    // Draw center line and phase indicator
    ctx.strokeStyle = '#254A4D';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Phase status indicator
    const phasePercentage = phaseInfo.phase * 100;
    let statusColor: string;
    let statusText: string;

    if (phaseInfo.synced) {
      statusColor = '#06FF00';
      statusText = '🟢 IN SYNC';
    } else if (phasePercentage < 20) {
      statusColor = '#FFFF00';
      statusText = '🟡 CLOSE';
    } else {
      statusColor = '#FF0000';
      statusText = '🔴 OUT OF SYNC';
    }

    // Status box
    const statusBoxX = width / 2 - 100;
    const statusBoxY = centerY - 35;
    const statusBoxWidth = 200;
    const statusBoxHeight = 70;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(statusBoxX, statusBoxY, statusBoxWidth, statusBoxHeight);

    ctx.strokeStyle = statusColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(statusBoxX, statusBoxY, statusBoxWidth, statusBoxHeight);

    // Status text
    ctx.fillStyle = statusColor;
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(statusText, width / 2, statusBoxY + 25);

    ctx.font = '14px monospace';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(`Phase: ${phasePercentage.toFixed(1)}%`, width / 2, statusBoxY + 45);

    ctx.font = '12px monospace';
    ctx.fillStyle = '#AAAAAA';
    ctx.fillText(`BPM Δ: ${phaseInfo.bpmDifference.toFixed(1)}`, width / 2, statusBoxY + 60);

    // Draw playhead (current position)
    const playheadX = width / 2;
    ctx.strokeStyle = '#FFFF00';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(playheadX, 0);
    ctx.lineTo(playheadX, centerY - deckHeight);
    ctx.moveTo(playheadX, centerY + deckHeight);
    ctx.lineTo(playheadX, height);
    ctx.stroke();

    // Draw next beat indicators
    if (phaseInfo.deckANextBeat > 0) {
      const timeToNextBeatA = phaseInfo.deckANextBeat - phaseInfo.deckAPosition;
      const offsetA = (timeToNextBeatA / beatLengthA) * beatWidthA;

      ctx.fillStyle = 'rgba(2, 211, 233, 0.3)';
      ctx.fillRect(playheadX, centerY - deckHeight / 2, offsetA, 5);

      ctx.fillStyle = '#02D3E9';
      ctx.font = '10px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`Next: ${timeToNextBeatA.toFixed(2)}s`, playheadX + 5, centerY - deckHeight / 2 - 5);
    }

    if (phaseInfo.deckBNextBeat > 0) {
      const timeToNextBeatB = phaseInfo.deckBNextBeat - phaseInfo.deckBPosition;
      const offsetB = (timeToNextBeatB / beatLengthB) * beatWidthB;

      ctx.fillStyle = 'rgba(6, 255, 0, 0.3)';
      ctx.fillRect(playheadX, centerY + deckHeight / 2 - 5, offsetB, 5);

      ctx.fillStyle = '#06FF00';
      ctx.font = '10px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`Next: ${timeToNextBeatB.toFixed(2)}s`, playheadX + 5, centerY + deckHeight / 2 + 15);
    }
  }, [phaseInfo, deckABpm, deckBBpm, height]);

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        width={800}
        height={height}
        className="w-full h-full rounded-lg border border-primary/20"
        style={{ imageRendering: 'auto' }}
      />
      <div className="absolute bottom-2 left-2 text-xs text-muted-foreground bg-black/50 px-2 py-1 rounded">
        Beat Phase Alignment • Yellow line = Now • Bars flow right to left
      </div>
      <div className="absolute bottom-2 right-2 flex gap-2 text-xs font-mono bg-black/50 px-2 py-1 rounded">
        <span className="text-primary">A: {phaseInfo.deckAPosition.toFixed(1)}s</span>
        <span className="text-muted-foreground">|</span>
        <span className="text-accent">B: {phaseInfo.deckBPosition.toFixed(1)}s</span>
      </div>
    </div>
  );
}
