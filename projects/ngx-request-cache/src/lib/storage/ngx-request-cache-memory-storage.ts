import { HttpResponse } from '@angular/common/http';
import { NgxRequestCacheStorageInterface } from './ngx-request-cache-storage.interface';

export class NgxRequestCacheMemoryStorage implements NgxRequestCacheStorageInterface {

  private store = new Map<string, HttpResponse<any>>();

  clear(): void {
    this.store.clear();
  }

  get(key: string): HttpResponse<any> | undefined {
    return this.store.get(key);
  }

  set(key: string, value: HttpResponse<any>): void {
    this.store.set(key, value);
  }
}
