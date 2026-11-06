import { WeatherCondition, WeatherType } from '../types/game.types';
import { IWeatherSystem } from '../interfaces/IWeatherSystem';

export class WeatherSystem implements IWeatherSystem {
  private currentIndex = 0;
  private readonly conditions: readonly WeatherCondition[] = [
    { type: 'clear', name: 'Czysty Mrok', visibilityModifier: 1.0, combatEffectDescription: 'Brak anomalii atmosferycznych.', staminaDrainPerStep: 0 },
    { type: 'acid_rain', name: 'Kwasny Deszcz', visibilityModifier: 0.75, combatEffectDescription: 'Kwas rozpuszcza tarcze (-25% oslony w walce).', staminaDrainPerStep: 1 },
    { type: 'shadow_fog', name: 'Mgla Cieni', visibilityModifier: 0.45, combatEffectDescription: 'Ograniczone pole widzenia, wieksza szansa na zasadzke.', staminaDrainPerStep: 0 },
    { type: 'ash_storm', name: 'Burza Popiolu', visibilityModifier: 0.6, combatEffectDescription: 'Duszacy pyl z ruin zvolszcza regeneracje Eteru.', staminaDrainPerStep: 2 },
  ];

  public getCurrentWeather(): WeatherCondition {
    return this.conditions[this.currentIndex];
  }

  public tick(): WeatherCondition {
    this.currentIndex = (this.currentIndex + 1) % this.conditions.length;
    return this.getCurrentWeather();
  }

  public setWeather(type: WeatherType): void {
    const found = this.conditions.findIndex((w) => w.type === type);
    if (found !== -1) this.currentIndex = found;
  }

  public getWeatherList(): readonly WeatherCondition[] {
    return this.conditions;
  }
}
