import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundEditStopLossPage } from './fund-edit-stop-loss.page';
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
    stop_loss: 15,
  },
  invalid: {
    stop_loss: '',
  },
};
const fund = {
  nombre_bot: 'test',
  currency: 'USDT',
  ganancia: 10,
  perdida: 10,
};

describe('FundEditStopLossPage', () => {
  let component: FundEditStopLossPage;
  let fixture: ComponentFixture<FundEditStopLossPage>;
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
        declarations: [FundEditStopLossPage, TrackClickDirective, DummyComponent],
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
    fixture = TestBed.createComponent(FundEditStopLossPage);
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

  it('should call apiFundsService.getLastFundRun on ionViewWillEnter', async () => {
    fixture.detectChanges();
    expect(apiFundsServiceSpy).toHaveBeenCalledTimes(1);
  });

  it('should call apiFunds.update on handleSubmit', async () => {
    fixture.detectChanges();
    const spy = spyOn(apiFundsService.crud, 'update');
    spy.and.returnValue(of({}));
    await component.handleSubmit(formData.valid);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
