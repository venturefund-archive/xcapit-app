import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FundTimelineDetailPage } from './fund-timeline-detail.page';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { DummyComponent } from '../../../../testing/dummy.component.spec';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LocalizedDatePipe } from 'src/app/shared/pipes/localized-date/localized-date.pipe';
import { DatePipe } from '@angular/common';
import { FundPercentageEvolutionChartInterface } from '../shared-funds/components/performance-chart-card/fund-performance-chart.interface';
const fund = {
  nombre_bot: 'test',
  nivel_de_riesgo: 'volume_profile_strategies_USDT'
};
const testPerformance = {
  fund: {
    fundName: 'Test',
    currency: 'BTC'
  },
  percentage_evolution: {} as FundPercentageEvolutionChartInterface,
};
describe('FundTimelineDetailPage', () => {
  let component: FundTimelineDetailPage;
  let fixture: ComponentFixture<FundTimelineDetailPage>;
  let apiFundsServiceMock: any;
  let apiFundsService: ApiFundsService;
  beforeEach(
    waitForAsync(() => {
      apiFundsServiceMock = {
        getLastPercentage: () => of([fund]),
        getPercentageEvolution: () => of(testPerformance)
      };
      TestBed.configureTestingModule({
        declarations: [
          FundTimelineDetailPage,
          DummyComponent,
          LocalizedDatePipe,
        ],
        imports: [
          IonicModule,
          HttpClientTestingModule,
          TranslateModule.forRoot(),
          RouterTestingModule.withRoutes([
            {
              path: 'funds/fund-detail',
              component: DummyComponent,
            },
          ]),
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          {
            provide: ApiFundsService,
            useValue: apiFundsServiceMock,
          },
          DatePipe,
        ],
      }).compileComponents();
      fixture = TestBed.createComponent(FundTimelineDetailPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
      apiFundsService = TestBed.inject(ApiFundsService);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getLastPercentage in apiFundsService on ionViewWillEnter', () => {
    const spy = spyOn(apiFundsService, 'getLastPercentage');
    spy.and.returnValue(of([fund]));
    component.ionViewWillEnter();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call getPercentageEvolution in apiFundsService on getTimelineDetailInfo', () => {
    const spyLastPercentage = spyOn(apiFundsService, 'getLastPercentage');
    spyLastPercentage.and.returnValue(of([fund]));
    const spy = spyOn(apiFundsService, 'getPercentageEvolution');
    spy.and.returnValue(of(testPerformance));
    component.getTimelineDetailInfo();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
