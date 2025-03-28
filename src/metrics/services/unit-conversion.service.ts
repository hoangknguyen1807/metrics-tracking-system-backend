import { Injectable } from '@nestjs/common';
import { DistanceUnit, TemperatureUnit } from '../../common/enums';

@Injectable()
export class UnitConversionService {
  // Distance conversion factors to meters (base unit)
  private distanceToMeterFactor = {
    [DistanceUnit.METER]: 1,
    [DistanceUnit.CENTIMETER]: 0.01,
    [DistanceUnit.INCH]: 0.0254,
    [DistanceUnit.FEET]: 0.3048,
    [DistanceUnit.YARD]: 0.9144,
  };

  convertDistance(
    value: number,
    fromUnit: DistanceUnit,
    toUnit: DistanceUnit,
  ): number {
    if (fromUnit === toUnit) {
      return value;
    }

    value = Number(value);

    // Convert to base unit (meters)
    const valueInMeters = value * this.distanceToMeterFactor[fromUnit];

    // Convert from base unit to target unit
    return valueInMeters / this.distanceToMeterFactor[toUnit];
  }

  convertTemperature(
    value: number,
    fromUnit: TemperatureUnit,
    toUnit: TemperatureUnit,
  ): number {
    if (fromUnit === toUnit) {
      return value;
    }

    value = Number(value);

    // First convert to Kelvin (base unit)
    let kelvin: number;

    switch (fromUnit) {
      case TemperatureUnit.CELSIUS:
        kelvin = value + 273.15;
        break;
      case TemperatureUnit.FAHRENHEIT:
        kelvin = (value + 459.67) * (5 / 9);
        break;
      case TemperatureUnit.KELVIN:
        kelvin = value;
        break;
    }

    // Convert from Kelvin to target unit
    switch (toUnit) {
      case TemperatureUnit.CELSIUS:
        return kelvin - 273.15;
      case TemperatureUnit.FAHRENHEIT:
        return kelvin * (9 / 5) - 459.67;
      case TemperatureUnit.KELVIN:
        return kelvin;
      default:
        return value;
    }
  }
}
