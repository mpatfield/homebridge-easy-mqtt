import { IHomebridgePluginUi } from '@homebridge/plugin-ui-utils/ui.interface';

import { Translation } from '../i18n/i18n.js';

import { AccessoryType } from '../model/enums.js';
import { LockConfig, PlatformConfig } from '../model/types.js';

declare const homebridge: IHomebridgePluginUi;

const i18n_replacements = {
  arrow: '&rarr;',
  easy_mqtt: 'Easy MQTT',
  github: '<a target="_blank" href="https://github.com/mpatfield/homebridge-easy-mqtt/">GitHub</a>',
};

function translateHtml(strings: Translation) {
  document.querySelectorAll('[i18n]').forEach(element => {

    const key = element.getAttribute('i18n') as keyof typeof strings.config;
    let string = strings.config[key] as string;

    const token = element.getAttribute('i18n_replace') as keyof typeof i18n_replacements;
    if (token) {
      string = string.replace('%s', i18n_replacements[token]);
    }
    element.innerHTML = string;
  });
};

function updateAccessoryNames(strings: Translation) {

  const legends = Array.from(window.parent.document.querySelectorAll('fieldset legend'));

  for(const legend of legends) {
    const fieldset = legend.closest('fieldset');
    const input = fieldset?.querySelector('input[type="text"][name="name"]') as HTMLInputElement | null;
    if (input && legend.textContent !== (input.value || strings.config.title.accessory)) {
      legend.textContent = input.value !== '' ? input.value : strings.config.title.accessory;
    }

    if (input && !input.dataset.accessoryNameListener) {
      input.addEventListener('input', () => updateAccessoryNames(strings));
      input.dataset.accessoryNameListener = 'true';
    }
  }
};

function generateUUID() {

  if (typeof crypto !== 'undefined') {

    if (crypto.randomUUID) {
      return crypto.randomUUID();
    }

    if (crypto.getRandomValues) {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = crypto.getRandomValues(new Uint8Array(1))[0] & 0xf;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }

  }

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function updateConfigWithUUIDs(config: PlatformConfig) {

  let changed = false;

  config.accessories?.forEach( (accessoryConfig) => {
    if (accessoryConfig.info.id === undefined) {
      const id = generateUUID();
      accessoryConfig.info.id = id;
      changed = true;
    }
  });

  if (changed) {
    homebridge.updatePluginConfig([config]);
  }
};

async function migrateDeprecatedConfigFields(configs: PlatformConfig[]) {

  let changed = false;

  for (const platformConfig of configs) {
    for (const accessoryConfig of platformConfig.accessories ?? []) {

      if (accessoryConfig.info.type !== AccessoryType.LockMechanism) {
        continue;
      }

      const lockConfig = accessoryConfig as LockConfig;

      if (lockConfig.topicGetLockCurrentState !== undefined) {
        lockConfig.topicGetCurrentLockState = lockConfig.topicGetLockCurrentState;
        lockConfig.topicGetLockCurrentState = undefined;
        changed = true;
      }

      if (lockConfig.topicGetLockTargetState !== undefined) {
        lockConfig.topicGetTargetLockState = lockConfig.topicGetLockTargetState;
        lockConfig.topicGetLockTargetState = undefined;
        changed = true;
      }

      if (lockConfig.topicSetTargetState !== undefined) {
        lockConfig.topicSetTargetLockState = lockConfig.topicSetTargetState;
        lockConfig.topicSetTargetState = undefined;
        changed = true;
      }
    }
  }

  if (changed) {
    await homebridge.updatePluginConfig(configs);
  }
}

function showSettings(strings: Translation) {
  document.getElementById('pageIntro')!.style.display = 'none';
  document.getElementById('support')!.style.display = 'block';
  document.getElementById('footer')!.style.display = 'block';

  const observer = new MutationObserver(() => {
    updateAccessoryNames(strings);
  });

  observer.observe(
    window.parent.document.body,
    { childList: true, subtree: true },
  );

  homebridge.addEventListener('configChanged', (evt: Event) => {
    const configs = (evt as MessageEvent).data as PlatformConfig[];
    if (configs.length) {
      updateConfigWithUUIDs(configs[0]);
    }
  });

  homebridge.showSchemaForm();
  homebridge.hideSpinner();
  homebridge.enableSaveButton();
}

function showIntro(strings: Translation) {
  const introContinue = document.getElementById('introContinue') as HTMLButtonElement;
  introContinue.addEventListener('click', async () => {
    showSettings(strings);
  });
  document.getElementById('pageIntro')!.style.display = 'block';
  homebridge.hideSpinner();
};

(() => {
  homebridge.disableSaveButton();
  homebridge.showSpinner();
})();

(async () => {

  const language = await homebridge.i18nCurrentLang();
  const strings = await homebridge.request('i18n', language);
  translateHtml(strings);

  const config = await homebridge.getPluginConfig() as PlatformConfig[];
  if (config.length) {
    await migrateDeprecatedConfigFields(config);
    showSettings(strings);
  } else {
    await homebridge.updatePluginConfig([{ name: i18n_replacements.easy_mqtt }]);
    showIntro(strings);
  }
})();