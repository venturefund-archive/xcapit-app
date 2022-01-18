import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FundInvestmentPage } from './fund-investment.page';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FundDataStorageService } from '../shared-funds/services/fund-data-storage/fund-data-storage.service';
import { AlertController, IonicModule, ModalController, NavController } from '@ionic/angular';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { alertControllerMock } from '../../../../testing/spies/alert-controller-mock.spec';
import { ApiApikeysService } from '../../apikeys/shared-apikeys/services/api-apikeys/api-apikeys.service';
import { of } from 'rxjs';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { FakeModalController } from '../../../../testing/fakes/modal-controller.fake.spec';
import { FakeNavController } from '../../../../testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FakeWalletService } from 'src/testing/fakes/wallet-service.fake.spec';
import { WalletService } from '../../wallets/shared-wallets/services/wallet/wallet.service';
import { By } from '@angular/platform-browser';

const testApiKey = [
  {
    id: 778,
    alias: 'TestKeys',
    nombre_bot: '',
  },
];

const checkMinBalanceFalse = {
  min_balance: 500,
  balance_is_enough: false,
};

const checkMinBalanceTrue = {
  min_balance: 500,
  balance_is_enough: true,
};

const paramShowTrue = {
  paramMap: convertToParamMap({
    show: true,
  }),
};

const paramShowFalse = {
  paramMap: convertToParamMap({}),
};

describe('FundInvestmentPage', () => {
  let component: FundInvestmentPage;
  let fixture: ComponentFixture<FundInvestmentPage>;
  let fundDataStorageServiceSpy;
  let apiApiKeysService: ApiApikeysService;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<FundInvestmentPage>;
  let alertControllerSpy: any;
  let apiApiKeysServiceSpy: any;
  let activatedRouteSpy: any;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let fakeWalletService: FakeWalletService;
  let walletServiceSpy: jasmine.SpyObj<WalletService>;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      fakeModalController = new FakeModalController();
      modalControllerSpy = fakeModalController.createSpy();
      fundDataStorageServiceSpy = jasmine.createSpyObj('FundDataStorageService', {
        getData: Promise.resolve(),
        setData: Promise.resolve(),
      });
      fundDataStorageServiceSpy.getData.withArgs('apiKeyId').and.returnValue({ api_key_id: 1 });
      activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['params']);
      apiApiKeysServiceSpy = jasmine.createSpyObj('ApiApikeysService', ['checkMinBalance', 'getAll']);
      navControllerSpy = jasmine.createSpyObj('NavController', ['navigateForward']);
      alertControllerSpy = jasmine.createSpyObj('AlertController', alertControllerMock);

      fakeWalletService = new FakeWalletService(true);
      walletServiceSpy = fakeWalletService.createSpy();

      TestBed.configureTestingModule({
        declarations: [FundInvestmentPage, FakeTrackClickDirective],
        imports: [TranslateModule.forRoot(), ReactiveFormsModule, IonicModule, HttpClientTestingModule],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          { provide: FundDataStorageService, useValue: fundDataStorageServiceSpy },
          { provide: ApiApikeysService, useValue: apiApiKeysServiceSpy },
          { provide: AlertController, useValue: alertControllerSpy },
          { provide: NavController, useValue: navControllerSpy },
          { provide: ActivatedRoute, useValue: activatedRouteSpy },
          { provide: ModalController, useValue: modalControllerSpy },
          { provide: WalletService, useValue: walletServiceSpy },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FundInvestmentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    apiApiKeysService = TestBed.inject(ApiApikeysService);
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call fundDataStorageService.getData on init', async () => {
    activatedRouteSpy.snapshot = paramShowFalse;
    fundDataStorageServiceSpy.getData.and.returnValue(Promise.resolve('test'));
    apiApiKeysServiceSpy.getAll.and.returnValue(of([]));
    await component.ionViewWillEnter();
    expect(fundDataStorageServiceSpy.getData).toHaveBeenCalledTimes(2);
  });

  it('should save data and check balance on handleSubmit and form valid on new fund', async () => {
    fundDataStorageServiceSpy.setData.and.returnValue(Promise.resolve());
    activatedRouteSpy.snapshot = paramShowFalse;
    apiApiKeysServiceSpy.getAll.and.returnValue(of(testApiKey));
    apiApiKeysServiceSpy.checkMinBalance.and.returnValue(of(checkMinBalanceTrue));
    fixture.detectChanges();
    await component.ionViewWillEnter();
    await component.handleSubmit({ risk_level: 'prueba', currency: 'USDT' });
    await fixture.whenStable();

    expect(fundDataStorageServiceSpy.setData).toHaveBeenCalledTimes(2);
  });

  it('should return testFund on getDataToCheckBalance when is renew', async () => {
    activatedRouteSpy.snapshot = paramShowFalse;
    apiApiKeysServiceSpy.getAll.and.returnValue(of(testApiKey));
    fundDataStorageServiceSpy.getData.and.returnValues(Promise.resolve(true), Promise.resolve('testFund'));

    fixture.detectChanges();
    await component.ionViewWillEnter();
    const result = await component.getDataToCheckBalance();
    expect(result).toBe('testFund');
  });

  it('should return apikey id on getDataToCheckBalance when is not renew', async () => {
    activatedRouteSpy.snapshot = paramShowFalse;
    apiApiKeysServiceSpy.getAll.and.returnValue(of(testApiKey));
    fundDataStorageServiceSpy.getData.and.returnValues(Promise.resolve(false), Promise.resolve());

    fixture.detectChanges();
    await component.ionViewWillEnter();
    const result = await component.getDataToCheckBalance();

    expect(result).toEqual({ id: 1 });
  });

  it('should call alert and not save data when balance is not enough', async () => {
    fundDataStorageServiceSpy.getData.and.returnValue(Promise.resolve());
    apiApiKeysServiceSpy.getAll.and.returnValue(of(testApiKey));
    apiApiKeysServiceSpy.checkMinBalance.and.returnValue(of(checkMinBalanceFalse));
    activatedRouteSpy.snapshot = paramShowFalse;
    fixture.detectChanges();

    await component.ionViewWillEnter();
    await component.handleSubmit({ risk_level: 'prueba', currency: 'USDT' });
    await fixture.whenStable();

    expect(fundDataStorageServiceSpy.setData).toHaveBeenCalledTimes(0);
    expect(alertControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should open modal on handleSubmit when there no apikeys', async () => {
    await component.handleSubmit({ risk_level: 'prueba', currency: 'USDT' });
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should navigate to apikeys list on handleSubmit when there are apikeys and readOnly is true', async () => {
    apiApiKeysServiceSpy.getAll.and.returnValue(of(testApiKey));
    activatedRouteSpy.snapshot = paramShowTrue;
    fixture.detectChanges();
    await component.ionViewWillEnter();
    await component.handleSubmit({ risk_level: 'prueba', currency: 'USDT' });
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/apikeys/list');
  });

  it('should navigate to moonpay page when buy button is clicked in alert and exist wallet', () => {
    component.existWallet = true;
    fixture.detectChanges();
    component.goToBuyCripto();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['/fiat-ramps/moonpay']);
  });

  it('should navigate to intermediate page when buy button is clicked in alert and not exist wallet', () => {
    component.existWallet = false;
    fixture.detectChanges();
    component.goToBuyCripto();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['/fiat-ramps/no-wallet']);
  });
});
