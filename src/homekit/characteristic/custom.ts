import { Characteristic, CharacteristicValue, Formats, Nullable, Perms, PrimitiveTypes, Service } from 'homebridge';

import { CharacteristicType } from '../../model/homekit.js';
import { CustomCharacteristicConfig } from '../../model/types.js';

import { Log } from '../../tools/log.js';
import { strings } from '../../i18n/i18n.js';
import { assert } from '../../tools/validation.js';

export class CustomCharacteristic {

  private characteristic: Characteristic;

  private value: Nullable<CharacteristicValue> = null;

  public static create(
    Service: Service,
    Characteristic: CharacteristicType,
    config: CustomCharacteristicConfig,
    caller: string,
    log: Log,
    disableLogging: boolean,
  ): CustomCharacteristic | undefined {

    if (!assert(log, config.name ?? CustomCharacteristic.name, config, 'name', 'uuid', 'getTopic')) {
      return;
    }

    return new CustomCharacteristic(Service, Characteristic, config, caller, log, disableLogging);
  }

  private constructor(
    Service: Service,
    Characteristic: CharacteristicType,
    private readonly config: CustomCharacteristicConfig,
    private readonly caller: string,
    private readonly log: Log,
    private readonly disableLogging: boolean,
  ) {

    if (Service.testCharacteristic(config.name)) {
      this.characteristic = Service.getCharacteristic(config.name)!;
    } else {
      const customCharacteristic = class CustomCharacteristic extends Characteristic {
        constructor() {
          super(config.name, config.uuid, {
            format: Formats.UINT32,
            perms: [ Perms.PAIRED_READ, Perms.NOTIFY ],
            unit: config.units,
          });
          this.value = this.getDefaultValue();
        }
      };
      this.characteristic = Service.addCharacteristic(customCharacteristic);
      this.characteristic.UUID = config.uuid;
    }

    this.characteristic.onGet(this.getValue.bind(this));
  }

  public get UUID(): string {
    return this.config.uuid;
  }

  public get topic(): string {
    return this.config.getTopic;
  }

  public get onUpdateHandler(): (topic: string, value: PrimitiveTypes) => Promise<void> {
    return this.onValueUpdate.bind(this);
  }

  private async getValue(): Promise<Nullable<CharacteristicValue>> {
    return this.value;
  }

  private async onValueUpdate(topic: string, value: PrimitiveTypes): Promise<void> {

    if (typeof value !== 'number') {
      this.log.error(strings.characteristic.badValue, this.caller, this.characteristic.displayName, `'${value}'`);
      return;
    }

    if (value === this.value) {
      return;
    }

    this.value = value;

    this.characteristic.updateValue(this.value);

    if (this.disableLogging) {
      return;
    }

    this.log.always(strings.characteristic.updated, this.caller, this.characteristic.displayName, `'${value}'`);
  }
}