export enum TemperatureUnits {
  CELSIUS = 'C',
  FAHRENHEIT = 'F'
}

export function temperatureUnits(units?: TemperatureUnits): TemperatureUnits {
  return units === TemperatureUnits.FAHRENHEIT ? TemperatureUnits.FAHRENHEIT : TemperatureUnits.CELSIUS;
}

function fahrenheitToCelsius(fahrenheit: number): number {
  return Number(((fahrenheit - 32) * 5 / 9).toFixed(1));
};
function celsiusToFahrenheit(celsius: number): number {
  return Math.round((celsius * 9 / 5) + 32);
};

export function toCelsius(temp: number, units: TemperatureUnits): number {
  return units === TemperatureUnits.FAHRENHEIT ? fahrenheitToCelsius(temp) : temp;
};

export function fromCelsius(temp: number, units: TemperatureUnits): number {
  return units === TemperatureUnits.FAHRENHEIT ? celsiusToFahrenheit(temp) : temp;
};
