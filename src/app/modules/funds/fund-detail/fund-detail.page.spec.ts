import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { FundDetailPage } from './fund-detail.page';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { of } from 'rxjs';
import { FundPercentageEvolutionChartInterface } from '../shared-funds/components/performance-chart-card/fund-performance-chart.interface';
import { modalControllerMock } from 'src/testing/spies/modal-controller-mock.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DummyComponent } from '../../../../testing/dummy.component.spec';
import { navControllerMock } from '../../../../testing/spies/nav-controller-mock.spec';
import { Storage } from '@ionic/storage';
import { LocalStorageService } from 'src/app/shared/services/local-storage/local-storage.service';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';

const testFund = [
  {
    fundName: 'Test',
  },
];

const testPerformance = {
  fund: {
    fundName: 'Test',
    currency: 'BTC',
  },
  percentage_evolution: {} as FundPercentageEvolutionChartInterface,
};

describe('FundDetailPage', () => {
  let component: FundDetailPage;
  let fixture: ComponentFixture<FundDetailPage>;
  let apiFundsSpy: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<FundDetailPage>;
  let modalControllerSpy: any;
  let navControllerSpy: any;
  let storageSpy: any;
  let localStorageService: LocalStorageService;
  let localStorageServiceMock: any;

  beforeEach(
    waitForAsync(() => {
      localStorageServiceMock = {
        toggleHideFunds: () => undefined,
        getHideFunds: () => Promise.resolve(true),
      };
      modalControllerSpy = jasmine.createSpyObj('ModalController', modalControllerMock);
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);

      apiFundsSpy = jasmine.createSpyObj('ApiFundsService', {
        getPercentageEvolution: of(testPerformance),
        getFundBalances: of(testFund),
        getLastFundRun: of({}),
        getLastPercentage: of({}),
        getBalance: of({}),
        getFundRuns: of({}),
      });
      storageSpy = jasmine.createSpyObj('Storage', ['get', 'set']);
      TestBed.configureTestingModule({
        declarations: [FundDetailPage, FakeTrackClickDirective, DummyComponent],
        imports: [
          IonicModule,
          TranslateModule.forRoot(),
          RouterTestingModule.withRoutes([{ path: 'funds/fund-settings/:name', component: DummyComponent }]),
          HttpClientTestingModule,
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          { provide: ApiFundsService, useValue: apiFundsSpy },
          { provide: ModalController, useValue: modalControllerSpy },
          { provide: NavController, useValue: navControllerSpy },
          { provide: Storage, useValue: storageSpy },
          { provide: LocalStorageService, useValue: localStorageServiceMock },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(FundDetailPage);
      component = fixture.componentInstance;
      component.isOwner = true;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  beforeEach(() => {
    localStorageService = TestBed.inject(LocalStorageService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call SubscribeOnHideFunds on ionViewWillEnter', () => {
    const spySubscribeHideFunds = spyOn(component, 'subscribeOnHideFunds');
    component.ionViewWillEnter();
    expect(spySubscribeHideFunds).toHaveBeenCalledTimes(1);
  });

  it('should call apiFunds.getFundBalances on ionViewWillEnter', () => {
    const spySubscribeHideFunds = spyOn(component, 'subscribeOnHideFunds');
    component.ionViewWillEnter();
    component.fundName = 'test';
    expect(apiFundsSpy.getFundBalances).toHaveBeenCalledTimes(1);
    expect(spySubscribeHideFunds).toHaveBeenCalledTimes(1);
  });

  it('should call apiFunds.getLastPercentage on ionViewWillEnter', () => {
    const spySubscribeHideFunds = spyOn(component, 'subscribeOnHideFunds');
    component.ionViewWillEnter();
    expect(apiFundsSpy.getLastPercentage).toHaveBeenCalledTimes(1);
    expect(spySubscribeHideFunds).toHaveBeenCalledTimes(1);
  });

  it('should call apiFunds.getLastFundRun on ionViewWillEnter', () => {
    const spySubscribeHideFunds = spyOn(component, 'subscribeOnHideFunds');
    component.ionViewWillEnter();
    expect(apiFundsSpy.getLastFundRun).toHaveBeenCalledTimes(1);
    expect(spySubscribeHideFunds).toHaveBeenCalledTimes(1);
  });

  it('should call toggleHideFunds in HideText', () => {
    const spyToggle = spyOn(localStorageService, 'toggleHideFunds');
    spyToggle.and.returnValue(undefined);
    component.hideText();
    expect(localStorageService.toggleHideFunds).toHaveBeenCalledTimes(1);
  });

  it('should call apiFunds.getPercentageEvolution on setDelta', () => {
    component.setDelta('1d');
    expect(apiFundsSpy.getPercentageEvolution).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Edit Fund button clicked', () => {
    component.fundName = 'Test';
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Edit Fund');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
