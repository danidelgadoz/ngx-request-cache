import { HttpResponse } from '@angular/common/http';
import { NgxRequestCacheStorageInterface } from './ngx-request-cache-storage.interface';

function getHttpResponseDeepClone(res: HttpResponse<any>): HttpResponse<any> {
  return res.clone({
    body: JSON.parse(JSON.stringify(res.body))
  });
}
export class NgxRequestCacheMemoryStorage implements NgxRequestCacheStorageInterface {

  private store = new Map<string, HttpResponse<any>>();

  clear(): void {
    this.store.clear();
  }

  get(key: string): HttpResponse<any> | undefined {
    const value = this.store.get(key);
    if (value) {
      return getHttpResponseDeepClone(value);
    }
    return undefined;
  }

  set(key: string, res: HttpResponse<any>): void {
    this.store.set(key, getHttpResponseDeepClone(res));
  }

}
