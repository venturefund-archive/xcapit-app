import { TabsComponent } from './../../tabs/tabs/tabs.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundsListPage } from './funds-list.page';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { of } from 'rxjs';
import { IonicModule, NavController } from '@ionic/angular';
import { LogsService } from 'src/app/shared/services/logs/logs.service';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { ApiUsuariosService } from '../../usuarios/shared-usuarios/services/api-usuarios/api-usuarios.service';
import { navControllerMock } from '../../../../testing/spies/nav-controller-mock.spec';
import { ApiWebflowService } from 'src/app/shared/services/api-webflow/api-webflow.service';
import { NotificationsService } from '../../notifications/shared-notifications/services/notifications/notifications.service';

describe('FundsListPage', () => {
  let component: FundsListPage;
  let fixture: ComponentFixture<FundsListPage>;
  let apiFundsServiceMock: any;
  let apiUsuariosServiceMock: any;
  let apiFundsService: ApiFundsService;
  let apiUsuariosService: ApiUsuariosService;
  let apiWebflowService : ApiWebflowService;
  let logsServiceMock: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<FundsListPage>;
  let tabsComponentMock: any;
  let tabsComponent: TabsComponent;
  let navControllerSpy: any;
  let apiWebflowServiceMock: any;
  let notificationsService: NotificationsService;
  let notificationsServiceMock: any;

  beforeEach(async(() => {
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
    navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);

    notificationsServiceMock = {
      getNotifications: () => of({})
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
          },
          {
            path: 'profiles/personal-data',
            component: DummyComponent
          },
          {
            path: 'profiles/user',
            component: DummyComponent
          },
          {
            path: 'notifications/list',
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
          provide: NavController,
          useValue: navControllerSpy
        },
        {
          provide: ApiWebflowService,
          useValue: apiWebflowServiceMock
        },
        {
          provide: NotificationsService,
          useValue: notificationsServiceMock
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    apiFundsService = TestBed.inject(ApiFundsService);
    apiWebflowService = TestBed.inject(ApiWebflowService);
    tabsComponent = TestBed.inject(TabsComponent);
    apiUsuariosService = TestBed.inject(ApiUsuariosService);
    logsServiceMock = TestBed.inject(LogsService);
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call status and set it in apiUsuariosService on ionViewWillEnter', () => {
    const spy = spyOn(apiUsuariosService, 'status');
    spy.and.returnValue(of({}));
    const spySetSteps = spyOn(component, 'setSteps');
    const spySetActionButton = spyOn(component, 'setActionButton');
    const spySetNewFundUrl = spyOn(component, 'setNewFundUrl');
    component.ionViewWillEnter();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spySetSteps).toHaveBeenCalledTimes(1);
    expect(spySetActionButton).toHaveBeenCalledTimes(1);
    expect(spySetNewFundUrl).toHaveBeenCalledTimes(1);
  });

  it('should return profiles/personal-data when profile not valid', () => {
    component.status = {
      profile_valid: false,
      empty_linked_keys: false,
      has_own_funds: true,
      has_subscribed_funds: true,
      status_name: 'FROM_BOT'
    };
    fixture.detectChanges();
    component.setNewFundUrl();
    fixture.detectChanges();
    expect(component.newFundUrl).toBe('profiles/personal-data');
    expect(tabsComponent.newFundUrl).toBe('profiles/personal-data');
  });

  it('should return apikeys/tutorial when profile valid and not empty linked keys', () => {
    component.status = {
      profile_valid: true,
      empty_linked_keys: false,
      has_own_funds: true,
      has_subscribed_funds: true,
      status_name: 'EXOLORER'
    };
    fixture.detectChanges();
    component.setNewFundUrl();
    fixture.detectChanges();
    expect(component.newFundUrl).toBe('apikeys/tutorial');
    expect(tabsComponent.newFundUrl).toBe('apikeys/tutorial');
  });


  it('should return funds/fund-name when profile valid and empty linked keys', () => {
    component.status = {
      profile_valid: true,
      empty_linked_keys: true,
      has_own_funds: false,
      has_subscribed_funds: false,
      status_name: 'BEGINNER'
    };
    fixture.detectChanges();
    component.setNewFundUrl();
    fixture.detectChanges();
    expect(component.newFundUrl).toBe('funds/fund-name');
    expect(tabsComponent.newFundUrl).toBe('funds/fund-name');
  });

  it('should call getFundBalances in apiFundsService', () => {
    const spy = spyOn(apiFundsService, 'getFundBalances');
    spy.and.returnValue(of([]));
    component.ionViewDidEnter();
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should call trackEvent on trackService when Go To Profile button clicked', () => {
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

  // TODO: Activate this test when notifications button shows
  it('should call trackEvent on trackService when Show Notifications button clicked', () => {
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

  it('should call trackEvent on trackService when Action Button button clicked', () => {
    component.status = {
      profile_valid: true,
      empty_linked_keys: true,
      has_own_funds: false,
      has_subscribed_funds: false,
      status_name: 'BEGINNER'
    };
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'Action Button'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call getNews in apiWebflow', () => {
    const spy = spyOn(apiWebflowService, 'getNews');
    spy.and.returnValue(of([]));
    component.ionViewDidEnter();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
