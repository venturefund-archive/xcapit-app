import { TestBed, async, inject } from '@angular/core/testing';

import { SubscribeGuard } from './subscribe.guard';
import { AuthService } from 'src/app/modules/usuarios/shared-usuarios/services/auth/auth.service';
import { SubscriptionsService } from '../../services/subscriptions/subscriptions.service';

describe('SubscribeGuard', () => {
  let authServiceSpy: any;
  let subscriptionsService: any;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['checkToken']);
    subscriptionsService = jasmine.createSpyObj('SubscriptionsService', [
      'saveLinkData'
    ]);
    TestBed.configureTestingModule({
      providers: [
        SubscribeGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: SubscriptionsService, useValue: subscriptionsService }
      ]
    });
  });

  it('should ...', inject([SubscribeGuard], (guard: SubscribeGuard) => {
    expect(guard).toBeTruthy();
  }));
});
