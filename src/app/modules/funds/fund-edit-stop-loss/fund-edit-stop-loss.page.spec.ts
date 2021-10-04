import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundEditStopLossPage } from './fund-edit-stop-loss.page';
import { of } from 'rxjs';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { By } from '@angular/platform-browser';
import { FakeNavController } from '../../../../testing/fakes/nav-controller.fake.spec';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';

const formData = {
  valid: {
    stop_loss: 10,
    trailing_stop: 25,
  },
  invalid: {
    stop_loss: '',
  },
};

const fund = {
  id: 5,
  nombre_bot: 'test',
  id_corrida: 1,
  currency: 'USDT',
  ganancia: 10,
  perdida: 10,
  nivel_de_riesgo: 'volume_profile_strategies_USDT',
  trailing_stop: 25,
};

const serializedFund = {
  fund_name: 'test',
  id_corrida: 1,
  currency: 'USDT',
  take_profit: 10,
  stop_loss: 10,
  cantidad_dias: undefined,
  risk_level: 'volume_profile_strategies_USDT',
  trailing_stop: 25,
};

describe('FundEditStopLossPage', () => {
  let component: FundEditStopLossPage;
  let fixture: ComponentFixture<FundEditStopLossPage>;
  let modalControllerSpy: any;
  let navControllerSpy: any;
  let apiFundsServiceSpy: any;
  let activatedRouteSpy: any;
  let fakeNavController: FakeNavController;
  let fakeModalController: FakeModalController;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();

      fakeModalController = new FakeModalController();
      modalControllerSpy = fakeModalController.createSpy();

      activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['params']);
      activatedRouteSpy.snapshot = {
        paramMap: convertToParamMap({
          fundName: 'testFund',
        }),
      };
      apiFundsServiceSpy = {
        crud: jasmine.createSpyObj('CRUD', ['update']),
        getLastFundRun: () => of(),
      };

      TestBed.configureTestingModule({
        declarations: [FundEditStopLossPage, TrackClickDirective, DummyComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [ReactiveFormsModule, HttpClientTestingModule, TranslateModule.forRoot(), IonicModule],
        providers: [
          {
            provide: ApiFundsService,
            useValue: apiFundsServiceSpy,
          },
          { provide: ModalController, useValue: modalControllerSpy },
          { provide: NavController, useValue: navControllerSpy },
          { provide: ActivatedRoute, useValue: activatedRouteSpy },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FundEditStopLossPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should define fund_name from url and define fund, stopLoss and profile when last fund run returns data on ionViewWillEnter', async () => {
    spyOn(apiFundsServiceSpy, 'getLastFundRun').and.returnValue(of(fund));
    component.ionViewWillEnter();
    expect(component.fundName).toEqual('testFund');
    expect(component.fund).toEqual(fund);
    expect(component.stopLoss).toEqual(10);
    expect(component.profile).toEqual('volume_profile_strategies_USDT');
  });

  it('should not define fund, stopLoss and profile when last fund run doesnt return data on ionViewWillEnter', async () => {
    spyOn(apiFundsServiceSpy, 'getLastFundRun').and.returnValue(of(undefined));
    component.ionViewWillEnter();
    expect(component.fund).toBeFalsy();
    expect(component.stopLoss).toBeFalsy();
    expect(component.profile).toBeFalsy();
  });

  it('should update fund when form is submited ', async () => {
    spyOn(apiFundsServiceSpy, 'getLastFundRun').and.returnValue(of(fund));
    apiFundsServiceSpy.crud.update.and.returnValue(of({}));

    component.ionViewWillEnter();
    await fixture.whenStable();
    fixture.detectChanges();
    const selectStopLossComponent = fixture.debugElement.query(By.css('app-fund-select-stop-loss'));
    selectStopLossComponent.triggerEventHandler('save', formData.valid);
    await fixture.whenStable();

    expect(apiFundsServiceSpy.crud.update).toHaveBeenCalledOnceWith(serializedFund, 5);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/funds/fund-settings', 'testFund']);
  });
});
