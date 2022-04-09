import { ModuleWithProviders, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { RequestCacheInterceptor } from './ngx-request-cache.interceptor';
import { NgxRequestCacheConfig, NGX_REQUEST_CACHE_CONFIG, RequestCacheService } from './ngx-request-cache.service';

@NgModule({
  providers: [
    RequestCacheService,
    { provide: HTTP_INTERCEPTORS, useClass: RequestCacheInterceptor, multi: true },
  ],
})
export class NgxRequestCacheModule {
  static forRoot(
    ngxRequestCacheConfig?: NgxRequestCacheConfig
  ): ModuleWithProviders<NgxRequestCacheModule> {
    return {
      ngModule: NgxRequestCacheModule,
      providers: [
        {
          provide: NGX_REQUEST_CACHE_CONFIG,
          useValue: ngxRequestCacheConfig,
        },
      ],
    };
  }
}
