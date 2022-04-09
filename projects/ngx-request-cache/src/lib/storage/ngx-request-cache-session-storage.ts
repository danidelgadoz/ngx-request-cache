import { NgxRequestCacheBrowserStorage } from './ngx-request-cache-browser-storage';

export class NgxRequestCacheSessionStorage extends NgxRequestCacheBrowserStorage {
  constructor() {
    super(sessionStorage);
  }
}
