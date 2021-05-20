import { TabsComponent } from '../../tabs/tabs/tabs.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FundsListPage } from './funds-list.page';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { of } from 'rxjs';
import { IonicModule } from '@ionic/angular';
import { LogsService } from 'src/app/shared/services/logs/logs.service';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { ApiUsuariosService } from '../../usuarios/shared-usuarios/services/api-usuarios/api-usuarios.service';
import { ApiWebflowService } from 'src/app/shared/services/api-webflow/api-webflow.service';
import { NotificationsService } from '../../notifications/shared-notifications/services/notifications/notifications.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';

describe('FundsListPage', () => {
  let component: FundsListPage;
  let fixture: ComponentFixture<FundsListPage>;
  let apiFundsServiceMock: any;
  let apiUsuariosServiceMock: any;
  let apiFundsService: ApiFundsService;
  let apiUsuariosService: ApiUsuariosService;
  let apiWebflowService: ApiWebflowService;
  let logsServiceMock: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<FundsListPage>;
  let tabsComponentMock: any;
  let tabsComponent: TabsComponent;
  let apiWebflowServiceMock: any;
  let notificationsServiceMock: any;
  let localStorageService: LocalStorageService;
  let localStorageServiceMock: any;

  beforeEach(
    waitForAsync(() => {
      logsServiceMock = {
        log: () => of({})
      };
      tabsComponentMock = {
        newFundUrl: ''
      };

      apiFundsServiceMock = {
        getFundBalances: () => of([]),
        status: () => of({})
      };

      apiWebflowServiceMock = {
        getNews: () => of([]),
        status: () => of({})
      };

      localStorageServiceMock = {
        toggleHideFunds: () => undefined,
        getHideFunds: () => Promise.resolve(true),
      };

      apiUsuariosServiceMock = {
        status: () =>
          of({
            profile_valid: true,
            empty_linked_keys: false,
            has_own_funds: true,
            has_subscribed_funds: true,
            status_name: 'COMPLETE'
          })
      };

      notificationsServiceMock = {
        getNotifications: () => of({}),
        getCountNotifications: () => of({})
      };

      TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          TranslateModule.forRoot(),
          IonicModule,
          RouterTestingModule.withRoutes([
            {
              path: 'tutorials/interactive-tutorial',
              component: DummyComponent
            }
          ])
        ],
        declarations: [FundsListPage, TrackClickDirective, DummyComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          TrackClickDirective,
          { provide: TabsComponent, useValue: tabsComponentMock },
          {
            provide: LogsService,
            useValue: logsServiceMock
          },
          {
            provide: ApiFundsService,
            useValue: apiFundsServiceMock
          },
          {
            provide: ApiUsuariosService,
            useValue: apiUsuariosServiceMock
          },
          {
            provide: ApiWebflowService,
            useValue: apiWebflowServiceMock
          },
          {
            provide: NotificationsService,
            useValue: notificationsServiceMock,
          },
          {
            provide: LocalStorageService,
            useValue: localStorageServiceMock,
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
    apiWebflowService = TestBed.inject(ApiWebflowService);
    localStorageService = TestBed.inject(LocalStorageService);
    tabsComponent = TestBed.inject(TabsComponent);
    apiUsuariosService = TestBed.inject(ApiUsuariosService);
    logsServiceMock = TestBed.inject(LogsService);
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should call SubscribeOnHideFunds on ionViewWillEnter', async () => {
    const spyStatus = spyOn(apiUsuariosService, 'status');
    const spyNews = spyOn(apiWebflowService, 'getNews');
    spyNews.and.returnValue(of([]))
    const spyCreateNotificationTimer = spyOn(component, 'createNotificationTimer');
    const spyInitQtyNotification = spyOn(component, 'initQtyNotifications');
    spyStatus.and.returnValue(of({}));
    const spySubscribeHideFunds = spyOn(component, 'subscribeOnHideFunds');
    await component.ionViewWillEnter();
    expect(spyStatus).toHaveBeenCalledTimes(1);
    expect(spySubscribeHideFunds).toHaveBeenCalledTimes(1);
    expect(spyCreateNotificationTimer).toHaveBeenCalledTimes(1);
    expect(spyInitQtyNotification).toHaveBeenCalledTimes(1);
    expect(spyNews).toHaveBeenCalledTimes(1);
  });

  it('should call getFundBalances and getNews on doRefresh', async () => {
    const spyFund = spyOn(apiFundsService, 'getFundBalances');
    const spyNews = spyOn(apiWebflowService, 'getNews');
    spyFund.and.returnValue(of([]));
    spyNews.and.returnValue(of([]));
    await component.doRefresh({ target: { complete: () => null } });
    expect(spyFund).toHaveBeenCalledTimes(2);
    expect(spyNews).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Go To Profile button clicked', () => {
    spyOn(component, 'goToProfile');
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'Go To Profile'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call toggleHideFunds in HideText', () => {
    const spyToggle = spyOn(localStorageService, 'toggleHideFunds');
    spyToggle.and.returnValue(undefined);
    component.hideText();
    expect(localStorageService.toggleHideFunds).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Show Notifications button clicked', () => {
    spyOn(component, 'showNotifications');
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'Show Notifications'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
