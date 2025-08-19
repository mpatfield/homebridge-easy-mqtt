
export type Primitive = string | number | boolean;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toPrimitive(value: any): Primitive {

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

export function toNumber(primitive: Primitive): number {
  if (typeof primitive === 'number') {
    return primitive;
  }

  return Number(primitive);
}