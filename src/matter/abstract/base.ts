import { EndpointType, MatterAccessory, MatterAPI } from 'homebridge';

import { PLATFORM_NAME, PLUGIN_NAME } from '../../homebridge/settings.js';

import { BaseAccessoryConfig } from '../../model/types.js';

import { Log } from '../../tools/log.js';
import getVersion from '../../tools/version.js';
import { MATTER_SERIAL_MAX_LEN, MatterClusterKey, MatterType, MatterValue, MatterValueKey } from '../../model/matter.js';

export type MatterAccessoryDependency<C extends BaseAccessoryConfig> = {
  matter: MatterAPI,
  config: C;
  log: Log;
};

export abstract class BaseMatterAccessory<C extends BaseAccessoryConfig> implements MatterAccessory {

  private _UUID?: string;

  public readonly displayName: string;

  public readonly manufacturer: string;
  public readonly model: string;
  public readonly serialNumber: string;
  public readonly softwareVersion: string;

  constructor(private readonly dependency: MatterAccessoryDependency<C>) {

    const info = dependency.config.info;

    this.displayName = info.name;

    this.manufacturer = info.manufacturer ?? PLATFORM_NAME;
    this.model = info.model ?? info.type;

    this.serialNumber = info.serialNumber ?? info.id ?? `${PLUGIN_NAME}:${this.deviceType}:${this.displayName}`;
    if (this.serialNumber.length > MATTER_SERIAL_MAX_LEN) {
      this.serialNumber = this.serialNumber.substring(0, MATTER_SERIAL_MAX_LEN - 1) + '…';
    }

    this.softwareVersion = info.version ?? getVersion();
  }

  protected abstract getMatterType(): MatterType;

  abstract get clusters(): MatterAccessory['clusters'] | undefined;
  abstract get handlers(): MatterAccessory['handlers'] | undefined;

  protected get matter(): MatterAPI {
    return this.dependency.matter;
  }

  public get UUID(): string {
    if (!this._UUID) {
      this._UUID = this.matter.uuid.generate(this.serialNumber);
    }
    return this._UUID;
  }

  public get deviceType(): EndpointType {

    const type = this.getMatterType();
    if (type !== undefined) {
      return this.matter.deviceTypes[type];
    }

    throw new Error(`${this.getMatterType.name} has invalid matter type '${type}'`);
  }

  public get context(): Record<string, unknown> {
    return {
      UUID: this.UUID,
      deviceType: this.deviceType,
      displayName: this.displayName,
      serialNumber: this.serialNumber,
      manufacturer: this.manufacturer,
      model: this.model,
      softwareVersion: this.softwareVersion,
      clusters: this.clusters,
      handlers: this.handlers,
    };
  }

  public toMatterAccessory(): MatterAccessory {
    return {
      UUID: this.UUID,
      displayName: this.displayName,
      deviceType: this.deviceType,
      serialNumber: this.serialNumber,
      manufacturer: this.manufacturer,
      model: this.model,
      context: this.context,
      clusters: this.clusters,
      handlers: this.handlers,
    };
  }

  protected updateMatter(clusterKey: MatterClusterKey, valueKey: MatterValueKey, value: MatterValue) {
    this.matter.updateAccessoryState(this.UUID, clusterKey, { [valueKey]: value });
  }
}
