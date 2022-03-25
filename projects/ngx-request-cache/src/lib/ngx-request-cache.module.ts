import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { RequestCacheInterceptor } from './ngx-request-cache.interceptor';
import { RequestCacheService } from './ngx-request-cache.service';

@NgModule({
  declarations: [],
  imports: [
  ],
  providers: [
    RequestCacheService,
    { provide: HTTP_INTERCEPTORS, useClass: RequestCacheInterceptor, multi: true },
  ],
  exports: []
})
export class NgxRequestCacheModule { }
