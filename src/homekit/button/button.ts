import { PrimitiveTypes, Service } from 'homebridge';

import { BaseAccessory } from '../abstract/base.js';

import { strings } from '../../i18n/i18n.js';

import { AccessoryType, LabelType } from '../../model/enums.js';
import { ButtonConfig, MQTTAccessoryDependency } from '../../model/types.js';

import { toPrimitive } from '../../tools/primitive.js';

class Button {

  constructor(
    readonly service: Service,
    readonly single: PrimitiveTypes | undefined,
    readonly double: PrimitiveTypes | undefined,
    readonly long: PrimitiveTypes | undefined,
  ) { }
}

export abstract class ButtonAccessory<C extends ButtonConfig = ButtonConfig> extends BaseAccessory<C> {

  private _singlePressValues?: PrimitiveTypes[];
  private _doublePressValues?: PrimitiveTypes[];
  private _longPressValues?: PrimitiveTypes[];

  private readonly buttons: Button[] = [];

  constructor(dependency: MQTTAccessoryDependency<C>) {
    super(dependency);

    if (!this.assert('topicEventButtonPress')) {
      return;
    }

    if (this.singlePressValues.length === 0 && this.doublePressValues.length === 0 && this.longPressValues.length === 0) {
      this.log.error(strings.button.noValues, this.name);
      return;
    }

    const allValues = new Set([...this.singlePressValues, ...this.doublePressValues, ...this.longPressValues]);
    if (allValues.size < this.singlePressValues.length + this.doublePressValues.length + this.longPressValues.length) {
      this.log.error(strings.button.duplicateValues, this.name);
      return;
    }

    this.topicHandlers.push({ topic: dependency.config.topicEventButtonPress, handler: this.onPress.bind(this) });

    if (!this.isMultiButton) {

      const button = new Button(
        this.service,
        this.singlePressValues.length > 0 ? this.singlePressValues[0] : undefined,
        this.doublePressValues.length > 0 ? this.doublePressValues[0] : undefined,
        this.longPressValues.length > 0 ? this.longPressValues[0] : undefined,
      );

      this.setValidValues(button);
      this.buttons.push(button);

      for (const service of [...dependency.platformAccessory.services]) {
        if (this.service.UUID === dependency.Service[this.getButtonAccessoryType()].UUID && service.subtype !== undefined) {
          dependency.platformAccessory.removeService(service);
        }
      }

      return;
    }

    const labelNamespace = dependency.Characteristic.ServiceLabelNamespace[dependency.config.labelType === LabelType.DOTS ? 'DOTS' : 'ARABIC_NUMERALS'];
    this.service.setCharacteristic(dependency.Characteristic.ServiceLabelNamespace, labelNamespace);

    const keepSubtypes = new Set<string>();

    const maxLength = Math.max(this.singlePressValues.length, this.doublePressValues.length, this.longPressValues.length);
    for (let i = 0; i < maxLength; i++) {

      const buttonServiceInstance = dependency.Service[this.getButtonAccessoryType()];

      const buttonName = `${this.name} ${i + 1}`;
      const buttonIdentifier = `${this.identifier}_${i + 1}`;

      let buttonService = dependency.platformAccessory.getServiceById(buttonServiceInstance, buttonIdentifier);
      if (buttonService === undefined) {
        buttonService = dependency.platformAccessory.addService(buttonServiceInstance, buttonName, buttonIdentifier);
        buttonService.setCharacteristic(this.Characteristic.ServiceLabelIndex, i + 1);
      }

      const button = new Button(
        buttonService,
        i < this.singlePressValues.length ? this.singlePressValues[i] : undefined,
        i < this.doublePressValues.length ? this.doublePressValues[i] : undefined,
        i < this.longPressValues.length ? this.longPressValues[i] : undefined,
      );

      this.setValidValues(button);
      this.buttons.push(button);

      keepSubtypes.add(buttonService.subtype!);
    }

    for (const service of [...dependency.platformAccessory.services]) {

      if (service.UUID !== dependency.Service[this.getButtonAccessoryType()].UUID) {
        continue;
      }

      if (service.subtype === undefined || !keepSubtypes.has(service.subtype)) {
        dependency.platformAccessory.removeService(service);
      }
    }
  }

  protected abstract getButtonAccessoryType(): AccessoryType;

  private get isMultiButton(): boolean {
    return this.singlePressValues.length > 1 || this.doublePressValues.length > 1 || this.longPressValues.length > 1;
  }

  private get singlePressValues(): PrimitiveTypes[] {

    if (this._singlePressValues === undefined) {
      this._singlePressValues = this.config.valueSinglePress?.split(',').map(v => toPrimitive(v.trim())) ?? [];
    }

    return this._singlePressValues;
  }

  private get doublePressValues(): PrimitiveTypes[] {

    if (this._doublePressValues === undefined) {
      this._doublePressValues = this.config.valueDoublePress?.split(',').map(v => toPrimitive(v.trim())) ?? [];
    }

    return this._doublePressValues;
  }

  private get longPressValues(): PrimitiveTypes[] {

    if (this._longPressValues === undefined) {
      this._longPressValues = this.config.valueLongPress?.split(',').map(v => toPrimitive(v.trim())) ?? [];
    }

    return this._longPressValues;
  }

  protected getAccessoryType(): AccessoryType {
    return this.isMultiButton ? AccessoryType.ServiceLabel : this.getButtonAccessoryType();
  }

  private async onPress(_topic: string, value: PrimitiveTypes) {

    let service: Service | undefined;
    let charValue: number | undefined;
    let logString: string | undefined;

    for (const button of this.buttons) {

      if (button.single === value) {
        charValue = this.Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS;
        logString = !this.isMultiButton ? strings.button.singlePress : strings.button.singlePressValue;
      } else if (button.double === value) {
        charValue = this.Characteristic.ProgrammableSwitchEvent.DOUBLE_PRESS;
        logString = !this.isMultiButton ? strings.button.doublePress : strings.button.doublePressValue;
      } else if (button.long === value) {
        charValue = this.Characteristic.ProgrammableSwitchEvent.LONG_PRESS;
        logString = !this.isMultiButton ? strings.button.longPress : strings.button.longPressValue;
      } else {
        continue;
      }

      service = button.service;
      break;
    }

    if (service === undefined || charValue === undefined || logString === undefined) {
      this.log.ifVerbose(strings.button.unknownValue, `'${value}'`);
      return;
    }

    if (this.isMultiButton) {
      const lastIndex = logString.lastIndexOf('%s');
      if (lastIndex !== -1) {
        logString = logString.substring(0, lastIndex) + value + logString.substring(lastIndex + 2);
      }
    }

    service.updateCharacteristic(this.Characteristic.ProgrammableSwitchEvent, charValue);
    this.logIfDesired(logString);
  }

  private setValidValues(button: Button) {

    const validValues = [
      button.single !== undefined ? this.Characteristic.ProgrammableSwitchEvent.SINGLE_PRESS : undefined,
      button.double !== undefined ? this.Characteristic.ProgrammableSwitchEvent.DOUBLE_PRESS : undefined,
      button.long !== undefined ? this.Characteristic.ProgrammableSwitchEvent.LONG_PRESS : undefined,
    ].filter( value => value !== undefined);

    button.service.getCharacteristic(this.Characteristic.ProgrammableSwitchEvent)?.setProps( { validValues });
  }
}