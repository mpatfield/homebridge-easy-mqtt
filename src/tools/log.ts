import { Logger } from 'homebridge';

type Param = string | boolean | number;

export enum LogType {
  ALWAYS,
  WARNING,
  ERROR,
}

export class Log {

  constructor(
    private readonly logger: Logger,
    private readonly verbose: boolean,
  ) {}

  public always(message: string, ...parameters: Param[]) {
    this.logger.info(message, ...parameters);
  }

  public warning(message: string, ...parameters: Param[]) {
    this.logger.warn(message, ...parameters);
  }

  public error(message: string, ...parameters: Param[]) {
    this.logger.error(message, ...parameters);
  }

  public ifVerbose(message: string, ...parameters: Param[]): void;
  public ifVerbose(level: LogType, message: string, ...parameters: Param[]): void;
  public ifVerbose(levelOrMessage: LogType | string, ...rest: Param[]) {
    if (!this.verbose) {
      return;
    }

    if (typeof levelOrMessage === 'string') {
      this.always(levelOrMessage, ...rest);
      return;
    }

    const [message, ...parameters] = rest;
    switch(levelOrMessage) {
    case LogType.ALWAYS:
      this.always(message as string, ...parameters);
      break;
    case LogType.WARNING:
      this.warning(message as string, ...parameters);
      break;
    case LogType.ERROR:
      this.error(message as string, ...parameters);
      break;
    }
  }
}