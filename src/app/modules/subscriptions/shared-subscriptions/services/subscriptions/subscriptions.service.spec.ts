import { TestBed } from '@angular/core/testing';

import { SubscriptionsService } from './subscriptions.service';
import { of } from 'rxjs';
import { ApiSubscriptionsService } from '../api-subscriptions/api-subscriptions.service';
import { TranslateModule } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { RouterTestingModule } from '@angular/router/testing';
import { LogsService } from 'src/app/shared/services/logs/logs.service';
import { ShareService } from '../../../../../shared/services/share/share.service';
import { NavController } from '@ionic/angular';
import { navControllerMock } from '../../../../../../testing/spies/nav-controller-mock.spec';

describe('SubscriptionsService', () => {
  let apiSubscriptionsSpy: any;
  let storageSpy: any;
  let subscriptionsService: SubscriptionsService;
  let logsServiceMock: any;
  let shareServiceSpy: any;
  let navControllerSpy: any;
  beforeEach(() => {
    shareServiceSpy = jasmine.createSpyObj('ShareService', ['share']);
    apiSubscriptionsSpy = jasmine.createSpyObj('ApiSubscriptionsService', [
      'getSubscriptionLink'
    ]);
    navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
    logsServiceMock = {
      log: () => of({})
    };
    apiSubscriptionsSpy.getSubscriptionLink.and.returnValue(of({}));
    storageSpy = jasmine.createSpyObj('Storage', ['get', 'set', 'remove']);
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([])],
      providers: [
        { provide: LogsService, useValue: logsServiceMock },
        { provide: ApiSubscriptionsService, useValue: apiSubscriptionsSpy },
        { provide: Storage, useValue: storageSpy },
        { provide: ShareService, useValue: shareServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
      ]
    });
    subscriptionsService = TestBed.inject(SubscriptionsService);
  });

  it('should be created', () => {
    expect(subscriptionsService).toBeTruthy();
  });

  it('should call getSubscriptionLink when shareSubscriptionLink is callled', () => {
    subscriptionsService.shareSubscriptionLink('fundName');
    expect(apiSubscriptionsSpy.getSubscriptionLink).toHaveBeenCalledTimes(1);
  });

  it('should call get when getStoredLink is callled', () => {
    subscriptionsService.getStoredLink();
    expect(storageSpy.get).toHaveBeenCalledTimes(1);
  });

  it('should call set when saveLinkData is callled', () => {
    subscriptionsService.saveLinkData({});
    expect(storageSpy.set).toHaveBeenCalledTimes(1);
  });

  it('should call remove when removeStoredLink is callled', () => {
    subscriptionsService.removeStoredLink();
    expect(storageSpy.remove).toHaveBeenCalledTimes(1);
  });

  it('should call getStoredLink when checkStoredLink is callled', () => {
    const getStoredLinkSpy = spyOn(subscriptionsService, 'getStoredLink');
    subscriptionsService.checkStoredLink();
    expect(getStoredLinkSpy).toHaveBeenCalledTimes(1);
  });
});