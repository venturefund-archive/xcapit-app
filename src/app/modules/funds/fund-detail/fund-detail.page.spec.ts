import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';

import { FundDetailPage } from './fund-detail.page';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { of } from 'rxjs';
import { FundPercentageEvolutionChartInterface } from '../shared-funds/components/performance-chart-card/fund-performance-chart.interface';
import { modalControllerMock } from 'src/testing/spies/modal-controller-mock.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DummyComponent } from '../../../../testing/dummy.component.spec';
const testMetrics = {
  fund: {
    fundName: 'Test',
    currency: 'BTC',
  },
  balance: {},
};

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
  beforeEach(async(() => {
    modalControllerSpy = jasmine.createSpyObj(
      'ModalController',
      modalControllerMock
    );

    apiFundsSpy = jasmine.createSpyObj('ApiFundsService', {
      getPercentageEvolution: of(testPerformance),
      getMetrics: of(testMetrics),
      getBalance: of({}),
      getFundRuns: of({}),
    });

    TestBed.configureTestingModule({
      declarations: [FundDetailPage, TrackClickDirective, DummyComponent],
      imports: [
        IonicModule,
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([
          {path: 'funds/fund-settings/:name', component: DummyComponent}
        ]),
        HttpClientTestingModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ApiFundsService, useValue: apiFundsSpy },
        { provide: ModalController, useValue: modalControllerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FundDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call apiFunds.getPercentageEvolution on ionViewWillEnter', () => {
    component.ionViewWillEnter();
    expect(apiFundsSpy.getPercentageEvolution).toHaveBeenCalledTimes(1);
  });

  it('should call apiFunds.getBalance on ionViewWillEnter', () => {
    component.ionViewWillEnter();
    expect(apiFundsSpy.getBalance).toHaveBeenCalledTimes(1);
  });

  it('should call apiFunds.getMetrics on ionViewWillEnter', () => {
    component.ionViewWillEnter();
    expect(apiFundsSpy.getMetrics).toHaveBeenCalledTimes(1);
  });

  it('should call apiFunds.getFundRuns on ionViewWillEnter', () => {
    component.ionViewWillEnter();
    expect(apiFundsSpy.getFundRuns).toHaveBeenCalledTimes(1);
  });

  it('should call mockController create on changeDelta', () => {
    component.changeDelta();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should call apiFunds.getPercentageEvolution on setDelta', () => {
    component.setDelta('1d');
    expect(apiFundsSpy.getPercentageEvolution).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Edit Fund button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName(
      'ion-button',
      'Edit Fund'
    );
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
