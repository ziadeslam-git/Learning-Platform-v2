import { readJson, writeJson } from './storage/localStorageClient';

const key = 'learning-platform:settings:v1';

export interface SettingsState {
  reducedMotion: boolean;
}

const defaults: SettingsState = {
  reducedMotion: false,
};

export const settingsStorage = {
  load() {
    return readJson<SettingsState>(key, defaults);
  },
  save(state: SettingsState) {
    writeJson(key, state);
  },
};
