/* eslint-disable no-unused-vars */

import { HttpResponse } from '@angular/common/http';

export interface NgxRequestCacheStorageInterface {

  clear(): void;

  get(key: string): HttpResponse<any> | undefined;

  set(key: string, value: HttpResponse<any>): void;
}
