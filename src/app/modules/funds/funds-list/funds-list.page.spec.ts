import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FundsListPage } from './funds-list.page';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { of, Subscription } from 'rxjs';
import { IonicModule, NavController } from '@ionic/angular';
import { LogsService } from 'src/app/shared/services/logs/logs.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { ApiUsuariosService } from '../../usuarios/shared-usuarios/services/api-usuarios/api-usuarios.service';
import { NotificationsService } from '../../notifications/shared-notifications/services/notifications/notifications.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';
import { navControllerMock } from 'src/testing/spies/nav-controller-mock.spec';
import { By } from '@angular/platform-browser';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';

const testStatus = {
  has_own_funds: false,
  empty_linked_keys: true,
  has_subscribed_funds: false,
  status_name: 'CREATOR',
};
describe('FundsListPage', () => {
  let component: FundsListPage;
  let fixture: ComponentFixture<FundsListPage>;
  let apiFundsServiceMock: any;
  let apiUsuariosServiceMock: any;
  let apiFundsService: ApiFundsService;
  let apiUsuariosService: ApiUsuariosService;
  let logsServiceMock: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<FundsListPage>;
  let notificationsServiceMock: any;
  let localStorageService: LocalStorageService;
  let localStorageServiceMock: any;
  let navControllerSpy: any;

  beforeEach(
    waitForAsync(() => {
      logsServiceMock = {
        log: () => of({}),
      };

      apiFundsServiceMock = {
        getFundBalances: () => of([]),
        status: () => of({}),
      };

      localStorageServiceMock = {
        toggleHideFunds: () => undefined,
        hideFunds: of(true),
      };

      apiUsuariosServiceMock = {
        status: () => of(testStatus),
      };

      notificationsServiceMock = {
        getCountNotifications: () => of({ count: 5 }),
      };
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
      TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          TranslateModule.forRoot(),
          IonicModule,
          RouterTestingModule.withRoutes([
            {
              path: 'tutorials/interactive-tutorial',
              component: DummyComponent,
            },
          ]),
        ],
        declarations: [FundsListPage, FakeTrackClickDirective, DummyComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          {
            provide: LogsService,
            useValue: logsServiceMock,
          },
          {
            provide: ApiFundsService,
            useValue: apiFundsServiceMock,
          },
          {
            provide: ApiUsuariosService,
            useValue: apiUsuariosServiceMock,
          },
          {
            provide: NotificationsService,
            useValue: notificationsServiceMock,
          },
          {
            provide: LocalStorageService,
            useValue: localStorageServiceMock,
          },
          {
            provide: NavController,
            useValue: navControllerSpy,
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FundsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    apiFundsService = TestBed.inject(ApiFundsService);
    localStorageService = TestBed.inject(LocalStorageService);
    apiUsuariosService = TestBed.inject(ApiUsuariosService);
    logsServiceMock = TestBed.inject(LogsService);
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call SubscribeOnHideFunds, createNotificationTimer and initQtyNotifications on ionViewWillEnter', () => {
    component.ionViewWillEnter();
    expect(component.status).toEqual(testStatus);
    expect(component.hideFundText).toBeTrue();
    expect(component.unreadNotifications).toEqual(5);
  });

  it('should unsubscribe timerSubscription, notificationQtySubscription on ionViewDidLeave', () => {
    component.ionViewWillEnter();
    const spy = spyOn(Subscription.prototype, 'unsubscribe');
    component.ionViewDidLeave();
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should call getFundBalances and getNews on doRefresh', async () => {
    const spyFund = spyOn(apiFundsService, 'getFundBalances');
    spyFund.and.returnValue(of([]));
    await component.doRefresh({ target: { complete: () => null } });
    expect(spyFund).toHaveBeenCalledTimes(2);
  });

  it('should call toggleHideFunds in HideText', () => {
    const spyToggle = spyOn(localStorageService, 'toggleHideFunds');
    spyToggle.and.returnValue(undefined);
    component.hideText();
    expect(localStorageService.toggleHideFunds).toHaveBeenCalledTimes(1);
  });

  it('should deleteFund when unsubscribe ', () => {
    component.notOwnerFundBalances = [{ fund_name: 'test' }];
    fixture.detectChanges();
    component.deleteFund('test');
    expect(component.notOwnerFundBalances.length).toBe(0);
  });
});
