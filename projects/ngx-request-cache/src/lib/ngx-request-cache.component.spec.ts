import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxRequestCacheComponent } from './ngx-request-cache.component';

describe('NgxRequestCacheComponent', () => {
  let component: NgxRequestCacheComponent;
  let fixture: ComponentFixture<NgxRequestCacheComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxRequestCacheComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxRequestCacheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
