import { WeatherCondition, WeatherType } from '../types/game.types';

export interface IWeatherSystem {
  getCurrentWeather(): WeatherCondition;
  tick(): WeatherCondition;
  setWeather(type: WeatherType): void;
  getWeatherList(): readonly WeatherCondition[];
}
