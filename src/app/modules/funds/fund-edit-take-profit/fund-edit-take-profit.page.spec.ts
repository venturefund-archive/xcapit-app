import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FundEditTakeProfitPage } from './fund-edit-take-profit.page';
import { of } from 'rxjs';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { navControllerMock } from '../../../../testing/spies/nav-controller-mock.spec';
import { modalControllerMock } from '../../../../testing/spies/modal-controller-mock.spec';

const formData = {
  valid: {
    take_profit: 20,
  },
  invalid: {
    take_profit: '',
  },
};
const fund = {
  nombre_bot: 'test',
  currency: 'USDT',
  ganancia: 10,
  perdida: 10,
};

describe('FundEditTakeProfitPage', () => {
  let component: FundEditTakeProfitPage;
  let fixture: ComponentFixture<FundEditTakeProfitPage>;
  let apiFundsMock: any;
  let apiFundsService: any;
  let modalControllerSpy: any;
  let navControllerSpy: any;
  let apiFundsServiceSpy: any;

  beforeEach(
    waitForAsync(() => {
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
      modalControllerSpy = jasmine.createSpyObj('ModalController', modalControllerMock);

      apiFundsMock = {
        crud: {
          update: () => of(),
        },
        getLastFundRun: () => of(fund),
      };

      TestBed.configureTestingModule({
        declarations: [FundEditTakeProfitPage, TrackClickDirective, DummyComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [
          ReactiveFormsModule,
          RouterTestingModule.withRoutes([
            {
              path: 'funds/fund-success',
              component: DummyComponent,
            },
          ]),
          HttpClientTestingModule,
          TranslateModule.forRoot(),
          IonicModule,
        ],
        providers: [
          {
            provide: ApiFundsService,
            useValue: apiFundsMock,
          },
          { provide: ModalController, useValue: modalControllerSpy },
          { provide: NavController, useValue: navControllerSpy },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FundEditTakeProfitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    apiFundsService = TestBed.inject(ApiFundsService);
    apiFundsServiceSpy = spyOn(apiFundsService, 'getLastFundRun');
    apiFundsServiceSpy.and.returnValue(of(fund));
    component.ionViewWillEnter();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call apiFundsService.getLastFundRun on ionViewWillEnter', async (done) => {
    fixture.detectChanges();
    fixture.whenStable().then(() => expect(apiFundsServiceSpy).toHaveBeenCalledTimes(1));
    done();
  });

  it('should call apiFunds.update on handleSubmit', async (done) => {
    const spy = spyOn(apiFundsService.crud, 'update');
    spy.and.returnValue(of({}));
    fixture.detectChanges();
    component.handleSubmit(formData.valid);
    fixture.detectChanges();
    fixture.whenStable().then(() => expect(spy).toHaveBeenCalledTimes(1));
    done();
  });
});
