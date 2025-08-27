import { PrimitiveTypes } from 'homebridge';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toPrimitive(value: any): PrimitiveTypes {

  if (typeof value === 'boolean' || typeof value === 'number') {
    return value;
  }

  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  const num = Number(value);
  if (!isNaN(num) && value.trim() !== '') {
    return num;
  }

  return value;
}

export function toNumber(primitive: PrimitiveTypes): number {
  if (typeof primitive === 'number') {
    return primitive;
  }

  return Number(primitive);
}