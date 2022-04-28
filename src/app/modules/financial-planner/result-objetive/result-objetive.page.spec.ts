import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { AppStorageService } from 'src/app/shared/services/app-storage/app-storage.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { TwoPiApi } from '../../defi-investments/shared-defi-investments/models/two-pi-api/two-pi-api.model';
import { ApiWalletService } from '../../wallets/shared-wallets/services/api-wallet/api-wallet.service';
import { ResultObjetivePage } from './result-objetive.page';
import { Vault } from '@2pi-network/sdk';
import { By } from '@angular/platform-browser';

const dataTest = {
  category: 'purchases',
  expenses: 700,
  income: 1000,
  name: 'Auto',
  necessaryAmount: 2500,
};

const productTest = {
  id: 'polygon_usdc',
  title: 'USDC',
  description: 'USD Coin',
  img: 'assets/img/coins/USDC.png',
  apy: 55.58379120677994,
  weeks: 0,
};

const testCoins = [
  jasmine.createSpyObj(
    {},
    {
      name: 'USDC - USD Coin',
      value: 'USDC',
      network: 'MATIC',
      decimals: 6,
    }
  ),
];
const testVault = {
  apy: 0.227843965358873,
  balances: [],
  contract_address: '0x3B353b1CBDDA3A3D648af9825Ee34d9CA816FD38',
  deposits: [],
  identifier: 'polygon_usdc',
  pid: 1,
  token: 'USDC',
  token_address: '0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F',
  tvl: 1301621680000,
} as Vault;

describe('ResultObjetivePage', () => {
  let component: ResultObjetivePage;
  let fixture: ComponentFixture<ResultObjetivePage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<ResultObjetivePage>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let appStorageServiceSpy: jasmine.SpyObj<AppStorageService>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let twoPiApiSpy: jasmine.SpyObj<TwoPiApi>;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();

      appStorageServiceSpy = jasmine.createSpyObj('AppStorageService', {
        get: dataTest,
      });

      apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletServiceSpy', {
        getCoins: testCoins,
      });

      twoPiApiSpy = jasmine.createSpyObj('TwoPiApi', {
        vaults: Promise.resolve([testVault]),
        vault: Promise.resolve(testVault),
      });
      TestBed.configureTestingModule({
        declarations: [ResultObjetivePage, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot(), HttpClientTestingModule],
        providers: [
          { provide: NavController, useValue: navControllerSpy },
          { provide: AppStorageService, useValue: appStorageServiceSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(ResultObjetivePage);
      component = fixture.componentInstance;
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
      component.data = dataTest;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get data planner of storage', () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    expect(component.data).toEqual(dataTest);
  });

  it('should calculate the savings and weeks of the savings section', () => {
    component.saving = dataTest.income - dataTest.expenses;
    component.weeks = Math.round(dataTest.necessaryAmount / (component.saving / 4));
    component.ionViewWillEnter();
    fixture.detectChanges();
    console.log(component.saving);
    expect(component.saving).toEqual(300);
    expect(component.weeks).toEqual(33);
  });

  it('should calculate weeks of the invest section', () => {
    component.weeks = 33;
    productTest.weeks = Math.round(component.weeks / (1 * (1 + productTest.apy / 55)));
    component.ionViewWillEnter();
    fixture.detectChanges();
    expect(productTest.weeks).toEqual(16);
  });

  it('should navigate to investment defi page when button ux_financial_planner_go_to_investments is clicked', () => {
    fixture.debugElement.query(By.css('ion-button[name="ux_financial_planner_go_to_investments"]')).nativeElement.click();
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/tabs/investments']);
  });

  it('should navigate to home page when button ux_financial_planner_back_to_start is clicked', () => {
    fixture.debugElement.query(By.css('ion-button[name="ux_financial_planner_back_to_start"]')).nativeElement.click();
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/tabs/home']);
  });

  it('should call trackEvent on trackService when ux_financial_planner_go_to_investments button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_financial_planner_go_to_investments');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when ux_financial_planner_back_to_start button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_financial_planner_back_to_start');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
