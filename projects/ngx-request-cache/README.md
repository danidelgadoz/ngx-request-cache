# NgxRequestCache

Angular library for storing HttpResponse on navigator memory to avoid hitting multiple times to the same API.

This implementation relies on:
1. Use of angular `HttpClient` service when requesting an API.
1. Developer ensures the requests go through `HttpInterceptor` (HttpClient default behavior).

## Demo
Check [live demo](https://ngx-request-cache.web.app) on your navigator **monitoring devtool's network** and take a look to the source on [StackBlitz](https://stackblitz.com/edit/ngx-request-cache-demo).

## Installation

```bash
npm i ngx-request-cache
```
## Usage

* **Setup root module:**

```javascript
import { NgxRequestCacheModule } from 'ngx-request-cache';

@NgModule({
  imports: [ NgxRequestCacheModule ]
})
```

* **Cache an API:**

```javascript
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestCacheHeader } from 'ngx-request-cache';

@Injectable()
export class DataService {
  constructor(private http: HttpClient) { }

  getData(): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append(RequestCacheHeader.Cachable, '');

    return this.http.get(`URL`, { headers });
  }
}
```
Library's headers are removed internally on `RequestCacheInterceptor`.

* **Clear cache:**

```javascript
import { RequestCacheService } from 'ngx-request-cache';

export class DataService {
  constructor(private requestCacheService: RequestCacheService) {
    this.requestCacheService.clear(); // All data stored in memory.
  }
}
```

## Considerations:

* HttpResponse's are stored associating to them a unique identifier generated with request URL with params and request body.
* <ins>Too Many Requests</ins> prevented, if you do 10 identical request at the same time the first hits the API and the other 9 keep waiting for it's response to emit the answer wherever they were invoked.
