'use client';

import * as React from 'react';
import { useRef, useEffect } from 'react';
import type { AudioAnalysisResult } from '@/lib/audio/types';

interface WaveformVisualizerProps {
  analysis: AudioAnalysisResult | null;
  currentTime?: number;
  duration?: number;
  height?: number;
  className?: string;
  showBeats?: boolean;
  showHotCues?: boolean;
  hotCues?: Array<{ position: number; color: string; name: string }>;
}

export function WaveformVisualizer({
  analysis,
  currentTime = 0,
  duration = 0,
  height = 120,
  className = '',
  showBeats = true,
  showHotCues = true,
  hotCues = [],
}: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !analysis) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const waveformData = analysis.waveform;
    const beats = analysis.beats;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Split waveform into frequency bands (simplified)
    const bassData = new Float32Array(waveformData.length);
    const midsData = new Float32Array(waveformData.length);
    const highsData = new Float32Array(waveformData.length);

    // Simple frequency splitting (in production, use proper filtering)
    for (let i = 0; i < waveformData.length; i++) {
      const sample = waveformData[i];
      // Simplified: alternate assignment
      if (i % 3 === 0) bassData[i] = sample;
      else if (i % 3 === 1) midsData[i] = sample;
      else highsData[i] = sample;
    }

    // Draw frequency bands
    const drawWaveformBand = (
      data: Float32Array,
      color: string,
      alpha: number
    ) => {
      ctx.strokeStyle = color;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = 1;
      ctx.beginPath();

      const step = Math.ceil(data.length / width);
      const amp = height / 4;

      for (let i = 0; i < width; i++) {
        const dataIndex = i * step;
        let min = 1.0;
        let max = -1.0;

        // Find min and max in this segment
        for (let j = 0; j < step && dataIndex + j < data.length; j++) {
          const datum = data[dataIndex + j];
          if (datum < min) min = datum;
          if (datum > max) max = datum;
        }

        const x = i;
        const yMin = height / 2 + min * amp;
        const yMax = height / 2 + max * amp;

        if (i === 0) {
          ctx.moveTo(x, yMin);
        } else {
          ctx.lineTo(x, yMin);
        }
      }

      ctx.stroke();
      ctx.globalAlpha = 1;
    };

    // Draw bass (red)
    drawWaveformBand(bassData, '#FF4444', 0.6);

    // Draw mids (yellow)
    drawWaveformBand(midsData, '#FFFF44', 0.5);

    // Draw highs (blue)
    drawWaveformBand(highsData, '#4444FF', 0.4);

    // Draw main waveform (cyan - cyberpunk theme)
    ctx.strokeStyle = '#02D3E9';
    ctx.lineWidth = 1.5;
    ctx.beginPath();

    const step = Math.ceil(waveformData.length / width);
    const amp = height / 3;

    for (let i = 0; i < width; i++) {
      const dataIndex = i * step;
      let sum = 0;
      let count = 0;

      for (let j = 0; j < step && dataIndex + j < waveformData.length; j++) {
        sum += Math.abs(waveformData[dataIndex + j]);
        count++;
      }

      const average = count > 0 ? sum / count : 0;
      const x = i;
      const y = height / 2 + (i % 2 === 0 ? average : -average) * amp;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }

    ctx.stroke();

    // Draw beat markers
    if (showBeats && beats.length > 0) {
      ctx.strokeStyle = '#06FF00';
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.4;

      beats.forEach((beat) => {
        const x = (beat.position / duration) * width;

        // Different heights for different beat types
        const lineHeight = beat.isBeatOne
          ? height
          : beat.isPhraseStart
          ? height * 0.8
          : height * 0.4;

        ctx.beginPath();
        ctx.moveTo(x, height - lineHeight);
        ctx.lineTo(x, height);
        ctx.stroke();
      });

      ctx.globalAlpha = 1;
    }

    // Draw hot cue markers
    if (showHotCues && hotCues.length > 0) {
      hotCues.forEach((cue) => {
        const x = (cue.position / duration) * width;

        // Draw cue marker
        ctx.fillStyle = cue.color;
        ctx.beginPath();
        ctx.arc(x, height / 2, 6, 0, Math.PI * 2);
        ctx.fill();

        // Draw label
        ctx.fillStyle = cue.color;
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(cue.name.substring(0, 3).toUpperCase(), x, 10);
      });
    }

    // Draw playhead
    if (duration > 0) {
      const playheadX = (currentTime / duration) * width;

      ctx.strokeStyle = '#06FF00';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(playheadX, 0);
      ctx.lineTo(playheadX, height);
      ctx.stroke();

      // Draw playhead triangle
      ctx.fillStyle = '#06FF00';
      ctx.beginPath();
      ctx.moveTo(playheadX, 0);
      ctx.lineTo(playheadX - 5, 10);
      ctx.lineTo(playheadX + 5, 10);
      ctx.closePath();
      ctx.fill();
    }
  }, [analysis, currentTime, duration, height, showBeats, showHotCues, hotCues]);

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        width={800}
        height={height}
        className="w-full h-full bg-[#0a1f1f] rounded-lg border border-primary/20"
        style={{ imageRendering: 'pixelated' }}
      />
      {analysis && (
        <div className="absolute bottom-2 right-2 flex gap-4 text-xs text-muted-foreground bg-black/50 px-2 py-1 rounded">
          <span className="flex items-center gap-1">
            <span className="w-3 h-1 bg-[#FF4444]"></span>
            Bass
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-1 bg-[#FFFF44]"></span>
            Mids
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-1 bg-[#4444FF]"></span>
            Highs
          </span>
          {showBeats && (
            <span className="flex items-center gap-1">
              <span className="w-1 h-3 bg-[#06FF00]"></span>
              Beats
            </span>
          )}
        </div>
      )}
    </div>
  );
}
