import { CharacteristicValue, PlatformAccessory, PrimitiveTypes } from 'homebridge';

import { StatusActiveAccessory } from '../abstract/statusActive.js';

import { strings } from '../../i18n/i18n.js';

import { CharacteristicKey } from '../../model/enums.js';
import { CharacteristicType, OnOffConfig, ServiceType } from '../../model/types.js';

import { Log } from '../../tools/log.js';

export abstract class OnOffAccessory<C extends OnOffConfig = OnOffConfig> extends StatusActiveAccessory<C> {

  constructor(Service: ServiceType, Characteristic: CharacteristicType, accessory: PlatformAccessory, config: C, log: Log, className: string) {
    super(Service, Characteristic, accessory, config, log, className);

    this.set(CharacteristicKey.On, false);

    this.accessoryService.getCharacteristic(Characteristic.On)
      .onGet(this.getOn.bind(this))
      .onSet(this.onSetOn.bind(this));
  }

  override addTopicHandlers(): void {
    super.addTopicHandlers();
    this.addTopicHandler('topicGetOn', this.onOnUpdate.bind(this));
  }

  private async getOn(): Promise<CharacteristicValue> {
    return this.get(CharacteristicKey.On);
  }

  private async onOnUpdate(topic: string, value: PrimitiveTypes): Promise<void> {
    const on = value === this.getPrimitiveValue('valueOn');
    this.onUpdate(CharacteristicKey.On, on, this.stringForState(on));
  }

  private async onSetOn(value: CharacteristicValue) {
    const on = value ? this.getRawValue('valueOn') : this.getRawValue('valueOff');
    if (on !== undefined) {
      this.onSet(CharacteristicKey.On, on, 'topicSetOn', this.stringForState(on, true));
    }
  }

  private stringForState(on: CharacteristicValue, future: boolean = false): string {
    if (on) {
      return future ? strings.onOff.stateFutureOn : strings.onOff.stateOn;
    } else {
      return future ? strings.onOff.stateFutureOff : strings.onOff.stateOff;
    }
  }
}
