export enum RequestCacheHeader {
  Cachable = 'Ngx-Request-Cache-Enable',
  Refresh = 'Ngx-Request-Cache-Refresh', // incoming feature
  Expires = 'Ngx-Request-Cache-Expires', // incoming feature
}

const LocalStorage = 'localStorage';
const SessionStorage = 'sessionStorage';
const Memory = 'memory';

export const requestCacheStoreType = { LocalStorage, SessionStorage, Memory };

export type RequestCacheStoreType =
  | typeof LocalStorage
  | typeof SessionStorage
  | typeof Memory;
