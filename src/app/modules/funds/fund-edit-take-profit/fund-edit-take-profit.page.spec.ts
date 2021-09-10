import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FundEditTakeProfitPage } from './fund-edit-take-profit.page';
import { of } from 'rxjs';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule, NavController } from '@ionic/angular';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { By } from '@angular/platform-browser';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

const formData = {
  valid: {
    take_profit: 20,
  },
};
const fund = {
  nombre_bot: 'test',
  currency: 'USDT',
  ganancia: 20,
  perdida: 10,
  nivel_de_riesgo: 'volume_profile_strategies_USDT',
};

describe('FundEditTakeProfitPage', () => {
  let component: FundEditTakeProfitPage;
  let fixture: ComponentFixture<FundEditTakeProfitPage>;
  let navControllerSpy: any;
  let apiFundsServiceSpy: any;
  let fakeNavController: FakeNavController;
  let activatedRouteSpy: any;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();

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
        declarations: [FundEditTakeProfitPage, TrackClickDirective],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [ReactiveFormsModule, HttpClientTestingModule, TranslateModule.forRoot(), IonicModule],
        providers: [
          { provide: ApiFundsService, useValue: apiFundsServiceSpy },
          { provide: NavController, useValue: navControllerSpy },
          { provide: ActivatedRoute, useValue: activatedRouteSpy },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FundEditTakeProfitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ionViewWillEnter();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should define fund_name from url and define fund, takeProfit and profile when last fund run returns data on ionViewWillEnter', async () => {
    spyOn(apiFundsServiceSpy, 'getLastFundRun').and.returnValue(of(fund));
    component.ionViewWillEnter();
    expect(component.fundName).toEqual('testFund');
    expect(component.fund).toEqual(fund);
    expect(component.takeProfit).toEqual(20);
    expect(component.profile).toEqual('volume_profile_strategies_USDT');
  });

  it('should not define fund, takeProfit and profile when last fund run doesnt return data on ionViewWillEnter', async () => {
    spyOn(apiFundsServiceSpy, 'getLastFundRun').and.returnValue(of(undefined));
    component.ionViewWillEnter();
    expect(component.fund).toBeFalsy();
    expect(component.takeProfit).toBeFalsy();
    expect(component.profile).toBeFalsy();
  });

  it('should update fund when form is submited ', async () => {
    spyOn(apiFundsServiceSpy, 'getLastFundRun').and.returnValue(of(fund));
    apiFundsServiceSpy.crud.update.and.returnValue(of({}));

    component.ionViewWillEnter();
    await fixture.whenStable();
    fixture.detectChanges();
    const selectTakeProfitComponent = fixture.debugElement.query(By.css('app-fund-select-take-profit'));
    selectTakeProfitComponent.triggerEventHandler('save', formData.valid);
    await fixture.whenStable();

    expect(apiFundsServiceSpy.crud.update).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/funds/fund-settings', 'testFund']);
  });
});
