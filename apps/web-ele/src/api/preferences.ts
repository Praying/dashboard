import { requestClient } from '#/api/request';

export interface Preferences {
  pbv6_path: string;
  pbv6_interpreter_path: string;
  pbv7_path: string;
  pbv7_interpreter_path: string;
}

export function getPreferencesApi() {
  return requestClient.get<Preferences>('/system/preferences/');
}

export function updatePreferencesApi(data: Preferences) {
  return requestClient.post<Preferences>('/system/preferences/', data);
}
