/* eslint-disable @typescript-eslint/no-explicit-any */
// https://github.com/ebaauw/homebridge-lib/blob/main/lib/EveHomeKitTypes.js
declare module 'homebridge-lib/EveHomeKitTypes' {

  import { API } from 'homebridge';

  export class EveHomeKitTypes {
    constructor(api: API);
    Characteristics: Record<string, any>;
    Services: Record<string, any>;
  }
}

declare module 'homebridge-lib' {
}
