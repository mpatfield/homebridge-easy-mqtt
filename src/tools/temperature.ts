import { TemperatureUnits } from '../model/enums.js';

const fahrenheitToCelsius = (fahrenheit: number): number => {
  return Number(((fahrenheit - 32) * 5 / 9).toFixed(1));
};
const celsiusToFahrenheit = (celsius: number): number => {
  return Math.round((celsius * 9 / 5) + 32);
};

export const toCelsius = (temp: number, units: TemperatureUnits): number => {
  return units === TemperatureUnits.FAHRENHEIT ? fahrenheitToCelsius(temp) : temp;
};

export const fromCelsius = (temp: number, units: TemperatureUnits): number => {
  return units === TemperatureUnits.FAHRENHEIT ? celsiusToFahrenheit(temp) : temp;
};
