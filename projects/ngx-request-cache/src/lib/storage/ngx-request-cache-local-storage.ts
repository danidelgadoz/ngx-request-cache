import { NgxRequestCacheBrowserStorage } from './ngx-request-cache-browser-storage';

export class NgxRequestCacheLocalStorage extends NgxRequestCacheBrowserStorage {
  constructor() {
    super(localStorage);
  }
}
