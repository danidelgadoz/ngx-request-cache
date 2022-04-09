import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, of, throwError } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import { RequestCacheStoreType, requestCacheStoreType } from './ngx-request-cache.enums';
import { NgxRequestCacheMemoryStorage } from './storage/ngx-request-cache-memory-storage';
import { NgxRequestCacheLocalStorage } from './storage/ngx-request-cache-local-storage';
import { NgxRequestCacheStorageInterface } from './storage/ngx-request-cache-storage.interface';
import { NgxRequestCacheSessionStorage } from './storage/ngx-request-cache-session-storage';

export interface NgxRequestCacheConfig {
  store: RequestCacheStoreType
};

export const NGX_REQUEST_CACHE_CONFIG = new InjectionToken<NgxRequestCacheConfig>(
  'ngx-request-config.config'
);

// TODO: decouple private methods in other store.service
@Injectable()
export class RequestCacheService  {
  private pending = new Map<string, Subject<HttpResponse<any>>>();
  private _store: NgxRequestCacheStorageInterface;

  constructor(
    @Inject(NGX_REQUEST_CACHE_CONFIG) @Optional() config: NgxRequestCacheConfig
  ) {
    this._store = this.getStoreFromConfig(config);
  }

  private getStoreFromConfig(config: NgxRequestCacheConfig): NgxRequestCacheStorageInterface {
    if (config.store === requestCacheStoreType.LocalStorage) {
      return new NgxRequestCacheLocalStorage();
    }

    if (config.store === requestCacheStoreType.SessionStorage) {
      return new NgxRequestCacheSessionStorage();
    }

    return new NgxRequestCacheMemoryStorage();
  }

  private get(req: HttpRequest<any>): Observable<HttpResponse<any>> | undefined {
    const cached = this._store.get(this.getKeyXHR(req));
    if (cached) {
      return of(cached);
    }

    const pending = this.pending.get(this.getKeyXHR(req));
    if (pending) {
      return pending.pipe(
        delay(1), // for paralell xhr response order, otherwise cached will cast before xhr... Is for style, it doesn't kill flow
        catchError(error => throwError(error))
      );
    }

    this.pending.set(this.getKeyXHR(req), new Subject<HttpResponse<any>>());

    return undefined;
  }

  private set(req: HttpRequest<any>, res: HttpResponse<any>): void {
    this._store.set(this.getKeyXHR(req), res);
  }

  private cast(req: HttpRequest<any>, res: HttpResponse<any> | null, error?: HttpErrorResponse): void {
      if (res) {
        this.pending.get(this.getKeyXHR(req))?.next(res);
      }

      if (error) {
        this.pending.get(this.getKeyXHR(req))?.error(error);
      }
  }

  private complete(req: HttpRequest<any>): void {
      this.pending.get(this.getKeyXHR(req))?.complete();
      this.pending.delete(this.getKeyXHR(req));
  }

  /**
   * Use clear method to remove all data stored in memory
   */
  clear(): void {
    this._store.clear();
  }

  private getKeyXHR(req: HttpRequest<any>): string {
    return `${req.urlWithParams}***${JSON.stringify(req.body)}`;
  }

}
