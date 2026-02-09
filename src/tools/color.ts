export type RGB = { red: number, green: number; blue: number }
export type HSB = { hue: number, saturation: number; brightness: number }

export function parseCSVRGB(input: string): RGB {
  return (([red, green, blue]) => ({ red, green, blue }))(input?.split(',').map(Number));
}

export function calculateWhiteFactor(rgb: RGB, white: RGB) {
  let redFactor = 1, greenFactor = 1, blueFactor = 1;

  if (white.red > 0) {
    redFactor = rgb.red / white.red;
  }

  if (white.green > 0) {
    greenFactor = rgb.green / white.green;
  }

  if (white.blue > 0) {
    blueFactor = rgb.blue / white.blue;
  }

  let whiteFactor2 = 0;

  const compmax = Math.max(rgb.red, rgb.green, rgb.blue);
  if (compmax >= 1) {

    const rgbScale = 255 / compmax;
    const rgbScaled = { red: rgb.red * rgbScale, green: rgb.green * rgbScale, blue: rgb.blue * rgbScale };

    const wmin = Math.min( white.red, white.green, white.blue );
    const cmin = Math.min( rgbScaled.red, rgbScaled.green, rgbScaled.blue );
    let redFactor2 = 1, greenFactor2 = 1, blueFactor2 = 1;

    if (white.red > wmin) {
      redFactor2 = (rgbScaled.red - cmin) / (white.red - wmin) / rgbScale;
    }

    if (white.green > wmin) {
      greenFactor2 = (rgbScaled.green - cmin) / (white.green - wmin) / rgbScale;
    }

    if (white.blue > wmin) {
      blueFactor2 = (rgbScaled.blue - cmin) / (white.blue - wmin) / rgbScale;
    }

    whiteFactor2 = Math.min( Math.max(0, Math.min( redFactor2, greenFactor2, blueFactor2 )), 1 );
  }

  return Math.min(Math.max(0, Math.min(redFactor, greenFactor, blueFactor, whiteFactor2)), 1);
}

export function HSBtoRGB(hue: number, saturation: number, brightness: number): RGB {
  hue = hue / 360;
  saturation = saturation / 100;
  brightness = brightness / 100;

  const i = Math.floor(hue * 6);
  const f = hue * 6 - i;
  const p = brightness * (1 - saturation);
  const q = brightness * (1 - f * saturation);
  const t = brightness * (1 - (1 - f) * saturation);

  let red = 0;
  let green = 0;
  let blue = 0;

  switch (i % 6) {
  case 0: { red = brightness; green = t; blue = p; break; }
  case 1: { red = q; green = brightness; blue = p; break; }
  case 2: { red = p; green = brightness; blue = t; break; }
  case 3: { red = p; green = q; blue = brightness; break; }
  case 4: { red = t; green = p; blue = brightness; break; }
  case 5: { red = brightness; green = p; blue = q; break; }
  }

  return {
    red: Math.round( red * 255 ),
    green: Math.round( green * 255 ),
    blue: Math.round( blue * 255 ),
  };
}

export function RGBtoHSB(red: number, green: number, blue: number): HSB {
  const max = Math.max( red, green, blue );
  const min = Math.min( red, green, blue );
  const d = max - min;
  const saturation = ( max === 0 ? 0 : d / max );
  const brightness = max / 255;

  let hue: number = 0;

  switch( max ) {
  case min: hue = 0; break;
  case red: hue = ( green - blue ) + d * ( green < blue ? 6 : 0 ); hue /= 6 * d; break;
  case green: hue = ( blue - red ) + d * 2; hue /= 6 * d; break;
  case blue: hue = ( red - green ) + d * 4; hue /= 6 * d; break;
  }

  return {
    hue: hue * 360,
    saturation: saturation * 100,
    brightness: brightness * 100,
  };
}