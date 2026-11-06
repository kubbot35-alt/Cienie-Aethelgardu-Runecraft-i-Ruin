import { IAudioService, SoundFx } from '../../domain/interfaces/IAudioService';

export class WebAudioSynthService implements IAudioService {
  private ctx: AudioContext | null = null;
  private ambientOsc: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;
  private muted = false;

  private ensureContext(): AudioContext | null {
    if (this.muted) return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => { /* user gesture required */ });
    }
    return this.ctx;
  }

  public playSfx(effect: SoundFx): void {
    const ctx = this.ensureContext();
    if (!ctx || this.muted) return;
    const now = ctx.currentTime;
    if (effect === 'step') this.playTone(ctx, 120, 'sine', 0.04, 0.05);
    else if (effect === 'rune_click') this.playTone(ctx, 580, 'triangle', 0.15, 0.1);
    else if (effect === 'puzzle_solve') this.playChord(ctx, [330, 440, 660], 0.4);
    else if (effect === 'combat_hit') this.playTone(ctx, 80, 'sawtooth', 0.25, 0.2);
    else if (effect === 'combat_shield') this.playTone(ctx, 420, 'sine', 0.2, 0.15);
    else if (effect === 'combat_victory') this.playChord(ctx, [440, 554, 659, 880], 0.6);
    else if (effect === 'craft_success') this.playChord(ctx, [523, 659, 783], 0.35);
    else if (effect === 'dialogue_beep') this.playTone(ctx, 380, 'sine', 0.06, 0.05);
    else if (effect === 'weather_whoosh') this.playTone(ctx, 160, 'triangle', 0.5, 0.1);
  }

  private playTone(ctx: AudioContext, freq: number, type: OscillatorType, duration: number, vol: number): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  private playChord(ctx: AudioContext, freqs: number[], duration: number): void {
    freqs.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.muted && this.ctx) this.playTone(this.ctx, freq, 'triangle', duration, 0.12);
      }, idx * 70);
    });
  }

  public playAmbientDrone(): void {
    const ctx = this.ensureContext();
    if (!ctx || this.ambientOsc || this.muted) return;
    this.ambientOsc = ctx.createOscillator();
    this.ambientGain = ctx.createGain();
    this.ambientOsc.type = 'sawtooth';
    this.ambientOsc.frequency.setValueAtTime(55, ctx.currentTime);
    this.ambientGain.gain.setValueAtTime(0.02, ctx.currentTime);
    this.ambientOsc.connect(this.ambientGain);
    this.ambientGain.connect(ctx.destination);
    this.ambientOsc.start();
  }

  public stopAmbient(): void {
    if (this.ambientOsc) {
      try { this.ambientOsc.stop(); } catch { /* ignore */ }
      this.ambientOsc.disconnect();
      this.ambientOsc = null;
    }
  }

  public setMuted(muted: boolean): void {
    this.muted = muted;
    if (muted) this.stopAmbient();
  }

  public isMuted(): boolean {
    return this.muted;
  }
}
