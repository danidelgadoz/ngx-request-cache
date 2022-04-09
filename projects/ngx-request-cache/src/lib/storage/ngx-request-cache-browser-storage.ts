import { NgxRequestCacheStorageInterface } from './ngx-request-cache-storage.interface';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

const KEY_PREFIX = 'NgxRequestCache::';

function serializeResponse(res: HttpResponse<any>): string {
  const response = res.clone();
  return JSON.stringify({
    headers: Object.fromEntries(
      response.headers
        .keys()
        .map((key: string) => [key, response.headers.getAll(key)])
    ),
    status: response.status,
    statusText: response.statusText,
    url: response.url,
    body: response.body,
  });
}

function deserializeResponse<T = any>(res: string): HttpResponse<T> {
  const response = JSON.parse(res);
  return new HttpResponse<T>({
    url: response.url,
    headers: new HttpHeaders(response.headers),
    body: response.body,
    status: response.status,
    statusText: response.statusText,
  });
}

export class NgxRequestCacheBrowserStorage implements NgxRequestCacheStorageInterface {
  // eslint-disable-next-line no-unused-vars
  constructor(private storage: Storage) {}

  clear(): void {
    Object.entries(sessionStorage)
      .map((i) => i[0])
      .filter((k) => k.startsWith(KEY_PREFIX))
      .forEach((k) => sessionStorage.removeItem(k));
  }

  get(key: string): HttpResponse<any> | undefined {
    const item = this.storage.getItem(`${KEY_PREFIX}${key}`);
    if (item) {
      return deserializeResponse(item);
    }
    return undefined;
  }

  set(key: string, value: HttpResponse<any>): void {
    this.storage.setItem(`${KEY_PREFIX}${key}`, serializeResponse(value));
  }
}
