import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { PreviousRouteService } from './previous-route.service';
import { NavigationEnd, Router } from '@angular/router';
import { of } from 'rxjs';

describe('PreviousRouteService', () => {
  let service: PreviousRouteService;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj(
      'Router',
      {},
      { url: '/previous-url', events: of(new NavigationEnd(1, 'current-url', 'current-after-redirect')) }
    );
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: Router, useValue: routerSpy }],
    });
    service = TestBed.inject(PreviousRouteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return previous url', () => {
    expect(service.getPreviousUrl()).toEqual('/previous-url');
  });
});
