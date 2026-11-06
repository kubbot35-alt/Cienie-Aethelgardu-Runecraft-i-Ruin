export type SoundFx =
  | 'step'
  | 'rune_click'
  | 'puzzle_solve'
  | 'combat_hit'
  | 'combat_shield'
  | 'combat_victory'
  | 'craft_success'
  | 'dialogue_beep'
  | 'weather_whoosh';

export interface IAudioService {
  playSfx(effect: SoundFx): void;
  playAmbientDrone(): void;
  stopAmbient(): void;
  setMuted(muted: boolean): void;
  isMuted(): boolean;
}
