'use client';

import * as React from 'react';
import { useRef, useEffect } from 'react';
import { useFrequencyAnalysis, useFrequencyCollisions } from '@/hooks/use-audio-analysis';
import { frequencyAnalyzer } from '@/lib/audio/frequency-analyzer';

interface SpectrumAnalyzerProps {
  deckAElement: HTMLAudioElement | null;
  deckBElement: HTMLAudioElement | null;
  height?: number;
  showCollisions?: boolean;
  showEQSuggestions?: boolean;
  className?: string;
}

export function SpectrumAnalyzer({
  deckAElement,
  deckBElement,
  height = 300,
  showCollisions = true,
  showEQSuggestions = false,
  className = '',
}: SpectrumAnalyzerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { frequencyData: freqDataA, frequencyBands: bandsA } = useFrequencyAnalysis(deckAElement);
  const { frequencyData: freqDataB, frequencyBands: bandsB } = useFrequencyAnalysis(deckBElement);
  const collisions = useFrequencyCollisions(deckAElement, deckBElement);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const halfHeight = height / 2;

    // Clear canvas
    ctx.fillStyle = '#0a1f1f';
    ctx.fillRect(0, 0, width, height);

    // Draw center line
    ctx.strokeStyle = '#254A4D';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, halfHeight);
    ctx.lineTo(width, halfHeight);
    ctx.stroke();

    // Function to draw spectrum
    const drawSpectrum = (
      frequencyData: Uint8Array,
      yOffset: number,
      direction: 1 | -1, // 1 for down, -1 for up
      color: string,
      label: string
    ) => {
      if (frequencyData.length === 0) return;

      const barWidth = width / frequencyData.length;

      for (let i = 0; i < frequencyData.length; i++) {
        const barHeight = (frequencyData[i] / 255) * halfHeight;
        const x = i * barWidth;
        const y = direction === 1 ? yOffset : yOffset - barHeight;

        // Create gradient
        const gradient = ctx.createLinearGradient(x, yOffset, x, y);
        if (direction === 1) {
          gradient.addColorStop(0, color + '00');
          gradient.addColorStop(1, color);
        } else {
          gradient.addColorStop(0, color);
          gradient.addColorStop(1, color + '00');
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth - 1, barHeight);
      }

      // Draw label
      ctx.fillStyle = color;
      ctx.font = '12px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(label, 10, direction === 1 ? yOffset + 20 : yOffset - 10);
    };

    // Draw Deck A spectrum (top, pointing down)
    drawSpectrum(freqDataA, 0, 1, '#02D3E9', 'DECK A');

    // Draw Deck B spectrum (bottom, pointing up)
    drawSpectrum(freqDataB, height, -1, '#06FF00', 'DECK B');

    // Draw collision warnings
    if (showCollisions && collisions.length > 0) {
      ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
      ctx.font = '10px monospace';

      collisions.forEach((collision, index) => {
        // Draw collision indicators at center
        const x = (collision.frequency / 22050) * width; // Assuming Nyquist ~22kHz
        const markerSize = 4 + collision.severity * 6;

        ctx.fillRect(x - markerSize / 2, halfHeight - markerSize / 2, markerSize, markerSize);

        // Show warning for most severe collision
        if (index === 0 && collision.severity > 0.7) {
          ctx.fillStyle = '#FF0000';
          ctx.fillText(
            `⚠️ Collision: ${Math.round(collision.frequency)}Hz`,
            width - 180,
            halfHeight + 20
          );
          ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
        }
      });
    }

    // Draw frequency band labels
    const labels = [
      { text: 'SUB', x: 0.05 },
      { text: 'BASS', x: 0.15 },
      { text: 'MIDS', x: 0.35 },
      { text: 'HIGHS', x: 0.7 },
      { text: 'AIR', x: 0.9 },
    ];

    ctx.fillStyle = '#254A4D';
    ctx.font = '9px monospace';
    ctx.textAlign = 'center';

    labels.forEach((label) => {
      const x = label.x * width;
      ctx.fillText(label.text, x, halfHeight);
    });

    // Draw EQ suggestions if enabled
    if (showEQSuggestions && freqDataA.length > 0) {
      const suggestions = frequencyAnalyzer.suggestEQAdjustments(freqDataA);

      ctx.fillStyle = '#06FF00';
      ctx.font = '11px monospace';
      ctx.textAlign = 'left';

      let yPos = 40;
      ctx.fillText(`EQ: Low ${suggestions.low > 0 ? '+' : ''}${suggestions.low.toFixed(1)}dB`, 10, yPos);
      yPos += 15;
      ctx.fillText(`    Mid ${suggestions.mid > 0 ? '+' : ''}${suggestions.mid.toFixed(1)}dB`, 10, yPos);
      yPos += 15;
      ctx.fillText(`    Hi  ${suggestions.high > 0 ? '+' : ''}${suggestions.high.toFixed(1)}dB`, 10, yPos);
    }
  }, [freqDataA, freqDataB, collisions, height, showCollisions, showEQSuggestions]);

  // Display frequency band values
  const renderBandMeters = () => {
    if (!deckAElement && !deckBElement) return null;

    return (
      <div className="absolute top-2 right-2 space-y-1 text-xs font-mono bg-black/50 p-2 rounded">
        <div className="text-primary">Deck A:</div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
          <span>Bass:</span>
          <span className="text-right">{(bandsA.bass * 100).toFixed(0)}%</span>
          <span>Mids:</span>
          <span className="text-right">{(bandsA.mids * 100).toFixed(0)}%</span>
          <span>High:</span>
          <span className="text-right">{(bandsA.brilliance * 100).toFixed(0)}%</span>
        </div>

        <div className="text-accent mt-2">Deck B:</div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
          <span>Bass:</span>
          <span className="text-right">{(bandsB.bass * 100).toFixed(0)}%</span>
          <span>Mids:</span>
          <span className="text-right">{(bandsB.mids * 100).toFixed(0)}%</span>
          <span>High:</span>
          <span className="text-right">{(bandsB.brilliance * 100).toFixed(0)}%</span>
        </div>

        {collisions.length > 0 && (
          <div className="mt-2 text-red-500">
            ⚠️ {collisions.length} collision{collisions.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        width={800}
        height={height}
        className="w-full h-full rounded-lg border border-primary/20"
        style={{ imageRendering: 'auto' }}
      />
      {renderBandMeters()}
      <div className="absolute bottom-2 left-2 text-xs text-muted-foreground bg-black/50 px-2 py-1 rounded">
        Real-time Frequency Analysis
      </div>
    </div>
  );
}
