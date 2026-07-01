import { OnOffAccessory } from './onoff.js';

import { strings } from '../../i18n/i18n.js';

import { AccessoryType, ColorType } from '../../model/enums.js';
import { HKCharacteristicKey, MQTTAccessoryDependency } from '../../model/homekit.js';
import { LightbulbConfig } from '../../model/types.js';

import { parseCSVRGB, RGB, RGBtoHSB, HSBtoRGB, calculateWhiteFactor } from '../../tools/color.js';
import { debounce } from '../../tools/debounce.js';
import { isValid, printableValues } from '../../tools/validation.js';

const DEFAULT_WARM_WHITE: RGB = { red: 255, green: 158, blue: 61 };
const DEFAULT_COLD_WHITE: RGB = { red: 204, green: 219, blue: 255 };

export class LightbulbAccessory extends OnOffAccessory<LightbulbConfig> {

  protected getAccessoryType(): AccessoryType {
    return AccessoryType.Lightbulb;
  }

  private cachedRGBW: { red?: number, green?: number, blue?: number, white?: number } = {};

  constructor(dependency: MQTTAccessoryDependency<LightbulbConfig>) {
    super(dependency);

    if (!dependency.config.maximumBrightness || !this.assertType('number', 'maximumBrightness')) {
      dependency.config.maximumBrightness = 100;
    }

    if (dependency.config.colorType !== undefined && dependency.config.colorType !== ColorType.HSB) {

      if (isValid(ColorType, dependency.config.colorType)) {
        this.setupRGB();
        return;
      }

      this.log.error(strings.lightbulb.badColorType, this.name, `'${dependency.config.colorType}'`, printableValues(ColorType));
    }

    const getLogString = dependency.config.maximumBrightness < 100 ? strings.lightbulb.brightnessValue : strings.lightbulb.brightnessPercent;
    const setLogString = dependency.config.maximumBrightness < 100 ? strings.lightbulb.brightnessValueFuture : strings.lightbulb.brightnessPercentFuture;

    this.setup(HKCharacteristicKey.Brightness, dependency.config.maximumBrightness,
      'topicGetBrightness', this.bindOnUpdateNumeric(HKCharacteristicKey.Brightness, getLogString), false,
      'topicSetBrightness', this.bindOnSetNumeric(HKCharacteristicKey.Brightness, 'topicSetBrightness', setLogString, true),
    )?.setProps({ maxValue: dependency.config.maximumBrightness });

    this.setup(HKCharacteristicKey.ColorTemperature, 500,
      'topicGetColorTemperature',
      this.bindOnUpdateNumeric(HKCharacteristicKey.ColorTemperature, strings.lightbulb.colorTemperature),
      false,
      'topicSetColorTemperature',
      this.bindOnSetNumeric(HKCharacteristicKey.ColorTemperature, 'topicSetColorTemperature', strings.lightbulb.colorTemperatureFuture, true),
    );

    this.setup(HKCharacteristicKey.Hue, 0,
      'topicGetHue', this.bindOnUpdateNumeric(HKCharacteristicKey.Hue, strings.lightbulb.hue), false,
      'topicSetHue', this.bindOnSetNumeric(HKCharacteristicKey.Hue, 'topicSetHue', strings.lightbulb.hueFuture, true),
    );

    this.setup(HKCharacteristicKey.Saturation, 100,
      'topicGetSaturation', this.bindOnUpdateNumeric(HKCharacteristicKey.Saturation, strings.lightbulb.saturation), false,
      'topicSetSaturation', this.bindOnSetNumeric(HKCharacteristicKey.Saturation, 'topicSetSaturation', strings.lightbulb.saturationFuture, true),
    );
  }

  private _warmWhiteRGB?: RGB;
  private get warmWhiteRGB() {
    if (this._warmWhiteRGB === undefined) {
      this._warmWhiteRGB = this.config.warmWhite ? parseCSVRGB(this.config.warmWhite) : DEFAULT_WARM_WHITE;
    }
    return this._warmWhiteRGB;
  }

  private _coldWhiteRGB?: RGB;
  private get coldWhiteRGB() {
    if (this._coldWhiteRGB === undefined) {
      this._coldWhiteRGB = this.config.coldWhite ? parseCSVRGB(this.config.coldWhite) : DEFAULT_COLD_WHITE;
    }
    return this._coldWhiteRGB;
  }

  private setupRGB() {

    if (this.config.topicGetRGB === undefined && this.config.topicSetRGB === undefined) {
      return;
    }

    if (!this.assert('topicGetRGB', 'topicSetRGB')) {
      return;
    }

    this.setupTopicless(HKCharacteristicKey.Brightness, 100, this.onSetRGB.bind(this));
    this.setupTopicless(HKCharacteristicKey.Hue, 0, this.onSetRGB.bind(this));
    this.setupTopicless(HKCharacteristicKey.Saturation, 100, this.onSetRGB.bind(this));

    this.topicHandlers.push({ topic: this.config.topicGetRGB!, handler: this.onUpdateRGB.bind(this) });

    if (this.config.topicGetWhite === undefined && this.config.topicSetWhite === undefined) {
      return;
    }

    if (!this.assert('topicGetWhite', 'topicSetWhite')) {
      return;
    }

    this.topicHandlers.push({ topic: this.config.topicGetWhite!, handler: this.onUpdateWhite.bind(this) });
  }

  private async onUpdateRGB(_topic: string, value: unknown) {

    if (typeof value !== 'string') {
      this.log.error(strings.lightbulb.badRGBType, this.name, '\'string\'', `'${typeof value}'`);
      return;
    }

    let white1: number | undefined;
    let white2: number | undefined;

    if (this.config.rgbHexPrefix !== undefined) {

      const hexValue = value.substring(this.config.rgbHexPrefix.length);
      if (hexValue.length < 6 || hexValue.length % 2 !== 0) {
        this.log.error(strings.lightbulb.badRGBValue, this.name, `'${this.config.rgbHexPrefix}123456'`, `'${value}'`);
        return;
      }

      this.cachedRGBW.red = parseInt(hexValue.substring(0, 2), 16);
      this.cachedRGBW.green = parseInt(hexValue.substring(2, 4), 16);
      this.cachedRGBW.blue = parseInt(hexValue.substring(4, 6), 16);

      switch (this.config.colorType) {
      case ColorType.RGBW:
        if (hexValue.length === 8) {
          this.cachedRGBW.white = parseInt(hexValue.substring(6, 8), 16);
        } else {
          this.log.error(strings.lightbulb.badRGBValue, this.name, `'${this.config.rgbHexPrefix}12345678'`, `'${value}'`);
        }
        break;
      case ColorType.RGBWW:
        if (hexValue.length === 10) {
          white1 = parseInt(hexValue.substring(6, 8), 16);
          white2 = parseInt(hexValue.substring(8, 10), 16);
        } else {
          this.log.error(strings.lightbulb.badRGBValue, this.name, `'${this.config.rgbHexPrefix}0123456789'`, `'${value}'`);
        }
        break;
      }

      if (Number.isNaN(this.cachedRGBW.red) || Number.isNaN(this.cachedRGBW.green) || Number.isNaN(this.cachedRGBW.blue)
          || Number.isNaN(this.cachedRGBW.white) || Number.isNaN(white1) || Number.isNaN(white2)) {
        this.log.error(strings.lightbulb.badHexValue, this.name, '\'00-FF\'', `'${value}'`);
        this.cachedRGBW = {};
        return;
      }

    } else {

      const pieces = value.split(',').map( (piece) => parseInt(piece)).filter( (value) => !Number.isNaN(value));
      if (pieces.length < 3) {
        this.log.error(strings.lightbulb.badRGBValue, this.name, '\'12,34,56\'', `'${value}'`);
        return;
      }

      this.cachedRGBW.red = pieces[0];
      this.cachedRGBW.green = pieces[1];
      this.cachedRGBW.blue = pieces[2];

      switch (this.config.colorType) {
      case ColorType.RGBW:
        if (pieces.length === 4) {
          this.cachedRGBW.white = pieces[3];
        } else {
          this.log.error(strings.lightbulb.badRGBValue, this.name, '\'12,34,56,78\'', `'${value}'`);
        }
        break;
      case ColorType.RGBWW:
        if (pieces.length === 5) {
          white1 = pieces[3];
          white2 = pieces[4];
        } else {
          this.log.error(strings.lightbulb.badRGBValue, this.name, '\'12,34,56,78,90\'', `'${value}'`);
        }
        break;
      }
    }

    const warmWhite = this.config.switchWhites === true ? white2 : white1;
    const coldWhite = this.config.switchWhites === true ? white1 : white2;

    if (warmWhite !== undefined && coldWhite !== undefined) {
      this.cachedRGBW.red += Math.floor( this.warmWhiteRGB.red * warmWhite / 255 ) + Math.floor( this.coldWhiteRGB.red * coldWhite / 255 );
      this.cachedRGBW.green += Math.floor( this.warmWhiteRGB.green * warmWhite / 255 ) + Math.floor( this.coldWhiteRGB.green * coldWhite / 255 );
      this.cachedRGBW.blue += Math.floor( this.warmWhiteRGB.blue * warmWhite / 255 ) + Math.floor( this.coldWhiteRGB.blue * coldWhite / 255 );
    }

    this.updateHSB();
  }

  private async onUpdateWhite(_topic: string, value: unknown) {

    if (typeof value === 'number') {
      this.cachedRGBW.white = value;
    } else if (this.config.rgbHexPrefix && typeof value === 'string') {

      const hexValue = value.substring(this.config.rgbHexPrefix.length);
      if (hexValue.length !== 2) {
        this.log.error(strings.lightbulb.badWhiteValue, this.name, `'${this.config.rgbHexPrefix}1F'`, `'${value}'`);
        return;
      }

      this.cachedRGBW.white = parseInt(hexValue.substring(0, 2), 16);
      if (Number.isNaN(this.cachedRGBW.white)) {
        this.log.error(strings.lightbulb.badHexValue, this.name, '\'00-FF\'', `'${value}'`);
        this.cachedRGBW.white = undefined;
        return;
      }

    } else {
      this.log.error(strings.lightbulb.badWhiteType, this.name, `'${value}'`);
      return;
    }

    this.updateHSB();
  }

  private updateHSB() {

    let red = this.cachedRGBW.red ?? 255;
    let green = this.cachedRGBW.green ?? 255;
    let blue = this.cachedRGBW.blue ?? 255;

    if (this.cachedRGBW.white !== undefined) {
      red = Math.min(red + this.cachedRGBW.white, 255);
      green = Math.min(green + this.cachedRGBW.white, 255);
      blue = Math.min(blue + this.cachedRGBW.white, 255);
    }

    const hsb = RGBtoHSB(red, green, blue);

    const brightness = Math.floor(hsb.brightness);
    this.onUpdate(HKCharacteristicKey.Brightness, brightness, strings.lightbulb.brightnessPercent.replace('%d', brightness.toString()));

    const hue = Math.floor(hsb.hue);
    this.onUpdate(HKCharacteristicKey.Hue, hue, strings.lightbulb.hue.replace('%d', hue.toString()));

    const saturation = Math.floor(hsb.saturation);
    this.onUpdate(HKCharacteristicKey.Saturation, saturation, strings.lightbulb.saturation.replace('%d', saturation.toString()));
  }

  private async onSetRGB(_value: unknown, changed: boolean) {

    if (!changed) {
      return;
    }

    const brightness = this.getProperty(HKCharacteristicKey.Brightness) as number ?? 100;
    const hue = this.getProperty(HKCharacteristicKey.Hue) as number ?? 0;
    const saturation = this.getProperty(HKCharacteristicKey.Saturation) as number ?? 100;

    const rgb = HSBtoRGB(hue, saturation, brightness);

    let red: number = rgb.red;
    let green: number = rgb.green;
    let blue: number = rgb.blue;

    let white: number | undefined;
    let warmWhite: number | undefined;
    let coldWhite: number | undefined;

    if (this.config.colorType === ColorType.RGBWW) {

      let warmFactor = calculateWhiteFactor(rgb, this.warmWhiteRGB);
      let coldFactor = calculateWhiteFactor(rgb, this.coldWhiteRGB);

      const whiteFactor = warmFactor + coldFactor;
      if( whiteFactor > 1 ) {
        warmFactor = warmFactor / whiteFactor;
        coldFactor = coldFactor / whiteFactor;
      }

      warmWhite = Math.floor( warmFactor * 255 );
      coldWhite = Math.floor( coldFactor * 255 );

      red = Math.max( 0, Math.floor( red - warmFactor * this.warmWhiteRGB.red - coldFactor * this.coldWhiteRGB.red ) );
      green = Math.max( 0, Math.floor( green - warmFactor * this.warmWhiteRGB.green - coldFactor * this.coldWhiteRGB.green ) );
      blue = Math.max( 0, Math.floor( blue - warmFactor * this.warmWhiteRGB.blue - coldFactor * this.coldWhiteRGB.blue ) );

      const min = Math.min( red, green, blue, 255 - warmWhite, 255 - coldWhite );
      warmWhite += Math.floor( min / 2 );
      coldWhite += Math.floor( min / 2 );
      red -= min;
      green -= min;
      blue -= min;

      if (this.config.noWhiteMix === true ) {
        if ( ( warmWhite > 0 || coldWhite > 0 ) && ( red > 0 || green > 0 || blue > 0 ) ) {
          const thresholds = this.config.rgbThresholds !== undefined ? parseCSVRGB(this.config.rgbThresholds) : { red: 15, green: 15, blue: 15 };
          if( red > thresholds.red || green > thresholds.green || blue > thresholds.blue ) {
            red = rgb.red;
            green = rgb.green;
            blue = rgb.blue;
          } else {
            red = 0;
            green = 0;
            blue = 0;
          }
        }
      }

    } else if (this.config.colorType === ColorType.RGBW || this.config.topicSetWhite !== undefined) {
      const min = Math.min(red, green, blue );
      white = min;
      red -= min;
      green -= min;
      blue -= min;
    }

    const white1 = this.config.switchWhites === true ? coldWhite : warmWhite;
    const white2 = this.config.switchWhites === true ? warmWhite : coldWhite;

    const colors = [red, green, blue, white, white1, white2].filter( (value) => value !== undefined);

    let rgbMessage: string;
    if (this.config.rgbHexPrefix !== undefined) {
      rgbMessage = this.config.rgbHexPrefix + colors.map( (value) => value.toString(16).padStart(2,'0')).join();
    } else {
      rgbMessage = colors.join(',');
    }

    this.cachedRGBW = { red, green, blue, white };

    const task = () => {

      this.logIfDesired(strings.lightbulb.rgbFuture, rgbMessage);
      this.publish(this.config.topicSetRGB!, rgbMessage);

      if (white !== undefined && this.config.topicSetWhite !== undefined) {
        const whiteMessage = (this.config.rgbHexPrefix ?? '') + white.toString();
        this.logIfDesired(strings.lightbulb.whiteFuture, whiteMessage);
        this.publish(this.config.topicSetWhite, whiteMessage);
      }
    };

    debounce(`${this.identifier}_${this.onSetRGB.name}`, task, 1000);
  }
}