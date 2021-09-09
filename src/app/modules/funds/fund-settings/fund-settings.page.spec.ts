import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';

import { FundSettingsPage } from './fund-settings.page';
import { ApiFundsService } from '../shared-funds/services/api-funds/api-funds.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ApiApikeysService } from '../../apikeys/shared-apikeys/services/api-apikeys/api-apikeys.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';

const fund = {
  nombre_bot: 'test',
  currency: 'USDT',
  ganancia: 10,
  perdida: 10,
};

const fundWithoutSLAndTP = {
  nombre_bot: 'test',
  currency: 'USDT',
  ganancia: 5000,
  perdida: 100,
};

const ak = {
  ak: 'test_ak',
  secret: '',
};
describe('FundSettingsPage', () => {
  let component: FundSettingsPage;
  let fixture: ComponentFixture<FundSettingsPage>;
  let apiFundsServiceMock: any;
  let apiApiKeysServiceMock: any;
  let apiFundsService: ApiFundsService;
  let apiApiKeysService: ApiApikeysService;
  let activatedRouteSpy: any;
  let fakeNavController: FakeNavController;
  let navControllerSpy: any;
  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController({});
      navControllerSpy = fakeNavController.createSpy();
      activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['params']);
      activatedRouteSpy.snapshot = {
        paramMap: convertToParamMap({
          name: 'test',
        }),
      };

      apiFundsServiceMock = {
        getLastFundRun: () => of(fund),
      };
      apiApiKeysServiceMock = {
        getByFundName: () => of(ak),
      };
      TestBed.configureTestingModule({
        declarations: [FundSettingsPage],
        imports: [IonicModule, HttpClientTestingModule, TranslateModule.forRoot()],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          {
            provide: ApiFundsService,
            useValue: apiFundsServiceMock,
          },
          {
            provide: ApiApikeysService,
            useValue: apiApiKeysServiceMock,
          },
          {
            provide: ActivatedRoute,
            useValue: activatedRouteSpy,
          },
          {
            provide: NavController,
            useValue: navControllerSpy,
          },
        ],
      }).compileComponents();
      fixture = TestBed.createComponent(FundSettingsPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
      apiFundsService = TestBed.inject(ApiFundsService);
      apiApiKeysService = TestBed.inject(ApiApikeysService);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getLastFundRun in apiFundsService on ionViewWillEnter', () => {
    const spy = spyOn(apiFundsService, 'getLastFundRun');
    spy.and.returnValue(of(fund));
    component.ionViewWillEnter();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call getByFundName in ApiApikeysService on ionViewWillEnter', () => {
    const spy = spyOn(apiApiKeysService, 'getByFundName');
    spy.and.returnValue(of(ak));
    component.ionViewWillEnter();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should render manual stop loss code and take_profit code if the stop loss is manual and take profit is manual', () => {
    const spy = spyOn(apiFundsService, 'getLastFundRun');
    spy.and.returnValue(of(fundWithoutSLAndTP));
    component.ionViewWillEnter();
    fixture.detectChanges();
    const stopLossEl = fixture.debugElement.query(By.css('.fs__stop_loss h3'));
    expect(stopLossEl.nativeElement.innerHTML).toContain('shared.without_SL_TP.without_stop_loss');
    const takeProfitEl = fixture.debugElement.query(By.css('.fs__take_profit h3'));
    expect(takeProfitEl.nativeElement.innerHTML).toContain('shared.without_SL_TP.without_take_profit');
  });

  it('should render manual stop loss code and take_profit code if the stop loss and take profit are different than manual', () => {
    const spy = spyOn(apiFundsService, 'getLastFundRun');
    spy.and.returnValue(of(fund));
    component.ionViewWillEnter();
    fixture.detectChanges();
    const stopLossEl = fixture.debugElement.query(By.css('.fs__stop_loss h3'));
    expect(stopLossEl.nativeElement.innerHTML).toContain('10%');
    const takeProfitEl = fixture.debugElement.query(By.css('.fs__take_profit h3'));
    expect(takeProfitEl.nativeElement.innerHTML).toContain('10%');
  });

  it('should navigate to Edit Stop Loss Page when ', () => {
    const spy = spyOn(apiFundsService, 'getLastFundRun');
    spy.and.returnValue(of(fund));
    component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('.fs__stop_loss')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['funds/edit-stop-loss/', 'test']);
  });

  it('should navigate to Edit Take Profit Page when', async () => {
    const spy = spyOn(apiFundsService, 'getLastFundRun');
    spy.and.returnValue(of(fund));
    component.ionViewWillEnter();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.debugElement.query(By.css('.fs__take_profit')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['funds/edit-take-profit/', 'test']);
  });
});
