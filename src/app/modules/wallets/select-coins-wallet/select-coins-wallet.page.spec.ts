import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { SelectCoinsWalletPage } from './select-coins-wallet.page';
import { WalletService } from '../shared-wallets/services/wallet/wallet.service';
import { ItemCoinComponent } from '../shared-wallets/components/item-coin/item-coin.component';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { By } from '@angular/platform-browser';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';

const testCoins = [
  {
    id: 1,
    name: 'ETH - Ethereum',
    logoRoute: 'assets/img/coins/ETH.svg',
    last: false,
    value: 'ETH',
    network: 'ERC20',
    chainId: 42,
    rpc: 'http://testrpc.test/',
    native: true,
  },
  {
    id: 2,
    name: 'LINK - Chainlink',
    logoRoute: 'assets/img/coins/LINK.png',
    last: false,
    value: 'LINK',
    network: 'ERC20',
    chainId: 42,
    rpc: 'http://testrpc.test/',
    contract: '0x01BE23585060835E02B77ef475b0Cc51aA1e0709',
    decimals: 18,
  },
  {
    id: 3,
    name: 'USDT - Tether',
    logoRoute: 'assets/img/coins/USDT.svg',
    last: false,
    value: 'USDT',
    network: 'ERC20',
    chainId: 42,
    rpc: 'http://testrpc.text/',
    contract: '0x3B00Ef435fA4FcFF5C209a37d1f3dcff37c705aD',
    decimals: 6,
  },
  {
    id: 5,
    name: 'UNI - Uniswap',
    logoRoute: 'assets/img/coins/UNI.svg',
    last: false,
    value: 'UNI',
    network: 'ERC20',
    chainId: 42,
    rpc: 'http://testrpc.text/',
    contract: '0xf2e3c830C6220795C6e101492BD1b98fb122AC01',
    decimals: 18,
  },
  {
    id: 6,
    name: 'RBTC - Smart Bitcoin',
    logoRoute: 'assets/img/coins/RBTC.png',
    last: false,
    value: 'RBTC',
    network: 'RSK',
    chainId: 31,
    rpc: 'http://testrpc.text/',
    native: true,
  },
  {
    id: 7,
    name: 'RIF - Rifos',
    logoRoute: 'assets/img/coins/RIF.png',
    last: false,
    value: 'RIF',
    network: 'RSK',
    chainId: 31,
    rpc: 'http://testrpc.text/',
    contract: '0x19F64674D8A5B4E652319F5e239eFd3bc969A1fE',
    decimals: 18,
  },
  {
    id: 8,
    name: 'MATIC - Polygon',
    logoRoute: 'assets/img/coins/MATIC.png',
    last: false,
    value: 'MATIC',
    network: 'MATIC',
    chainId: 80001,
    rpc: 'http://testrpc.text/',
    decimals: 18,
    native: true,
  },
  {
    id: 9,
    name: 'SOV - Sovryn',
    logoRoute: 'assets/img/coins/SOV.png',
    last: true,
    value: 'SOV',
    network: 'RSK',
    chainId: 31,
    rpc: 'http://testrpc.text/',
    contract: '0x6a9A07972D07E58f0daF5122D11e069288A375fB',
    decimals: 18,
  },
];

const formData = {
  valid: {
    ETH: true,
    RBTC: false,
  },
  invalid: {
    ETH: false,
    RBTC: false,
  },
};
describe('SelectCoinsWalletPage', () => {
  let component: SelectCoinsWalletPage;
  let fixture: ComponentFixture<SelectCoinsWalletPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<SelectCoinsWalletPage>;
  let activatedRouteSpy: any;
  let navControllerSpy: any;
  let walletService: WalletService;
  let walletServiceMock: any;
  let fakeNavController: FakeNavController;

  beforeEach(
    waitForAsync(() => {
      activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['params']);
      walletServiceMock = {
        coins: [],
        create: () => {},
      };
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      TestBed.configureTestingModule({
        declarations: [SelectCoinsWalletPage, FakeTrackClickDirective, ItemCoinComponent],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot(), HttpClientTestingModule, ReactiveFormsModule],
        providers: [
          TrackClickDirective,
          { provide: ActivatedRoute, useValue: activatedRouteSpy },
          { provide: NavController, useValue: navControllerSpy },
          { provide: WalletService, useValue: walletServiceMock },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectCoinsWalletPage);
    component = fixture.componentInstance;
    component.coins = testCoins;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    walletService = TestBed.inject(WalletService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when Next Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Next');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should set mode on ionViewWillEnter when mode exists', () => {
    activatedRouteSpy.snapshot = {
      paramMap: convertToParamMap({
        mode: 'import',
      }),
    };
    component.ionViewWillEnter();
    expect(component.mode).toEqual('import');
  });

  it('should select native token of the network (ETH) when LINK is selected', async () => {
    component.form.patchValue({ LINK: true });
    fixture.debugElement
      .queryAll(By.css('app-item-coin'))[0]
      .triggerEventHandler('change', { detail: { checked: true, value: testCoins[1] } });
    fixture.detectChanges();
    expect(component.form.value.ETH).toBeTrue();
  });

  it('should only select the token itself when a native token is selected', async () => {
    component.form.patchValue({ ETH: true });
    fixture.debugElement
      .queryAll(By.css('app-item-coin'))[0]
      .triggerEventHandler('change', { detail: { checked: true, value: testCoins[0] } });
    fixture.detectChanges();
    expect(component.form.value.ETH).toBeTrue();
    expect(Object.values(component.form.value).filter((value) => value === true).length).toEqual(1);
  });

  it('should deselect all tokens of the same network when a native token is deselected', () => {
    component.form.patchValue({ LINK: true, USDT: true });
    fixture.debugElement
      .queryAll(By.css('app-item-coin'))[0]
      .triggerEventHandler('change', { detail: { checked: false, value: testCoins[0] } });
    fixture.detectChanges();
    expect(component.form.value.LINK).toBeFalse();
    expect(component.form.value.USDT).toBeFalse();
  });

  it('should activate the Next button when at least one token is selected', () => {
    component.form.patchValue({ LINK: true });
    fixture.debugElement
      .queryAll(By.css('app-item-coin'))[0]
      .triggerEventHandler('change', { detail: { checked: true, value: testCoins[1] } });
    fixture.detectChanges();
    const nextButton = fixture.debugElement.query(By.css('ion-button[name="Next"]'));
    expect(nextButton.attributes['ng-reflect-disabled']).toEqual('false');
  });

  it('should not activate the Next button when no token is selected', () => {
    const nextButton = fixture.debugElement.query(By.css('ion-button[name="Next"]'));
    expect(nextButton.attributes['ng-reflect-disabled']).toEqual('true');
  });

  it('should select all tokens when the "select all" toggle is clicked and not all token are selected already', () => {
    fixture.debugElement.query(By.css('ion-toggle[name="AllToggle"]')).nativeElement.click();
    fixture.detectChanges();
    expect(Object.values(component.form.value).filter((value) => value === true).length).toEqual(8);
  });

  it('should deselect all tokens when the "select all" toggle is clicked and all token are selected', () => {
    component.form.patchValue({
      ETH: true,
      LINK: true,
      USDT: true,
      AAVE: true,
      UNI: true,
      RBTC: true,
      RIF: true,
      MATIC: true,
    });
    fixture.debugElement.query(By.css('ion-toggle[name="AllToggle"]')).nativeElement.click();
    fixture.detectChanges();
    expect(Object.values(component.form.value).filter((value) => value === true).length).toEqual(0);
  });

  it('should navigate to recovery phrase page on submit button clicked and valid form', () => {
    component.form.patchValue(formData.valid);
    fixture.debugElement
      .queryAll(By.css('app-item-coin'))[0]
      .triggerEventHandler('change', { detail: { checked: true, value: testCoins[0] } });
    fixture.detectChanges();
    component.handleSubmit();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['/wallets/create-first/recovery-phrase']);
  });

  it('should not navigate to recovery phrase page on submit button clicked and invalid form', () => {
    component.form.patchValue(formData.invalid);
    fixture.debugElement
      .queryAll(By.css('app-item-coin'))[0]
      .triggerEventHandler('change', { detail: { checked: false, value: testCoins[0] } });
    fixture.detectChanges();
    component.handleSubmit();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(0);
  });

  it('should set coins in wallet service on handleSubmit and valid form', () => {
    component.coins = testCoins;
    component.form.patchValue({ ETH: true, RBTC: false, AAVE: true });
    fixture.debugElement
      .queryAll(By.css('app-item-coin'))[0]
      .triggerEventHandler('change', { detail: { checked: true, value: testCoins[0] } });
    fixture.detectChanges();
    component.handleSubmit();
    expect(walletService.coins).toEqual([testCoins[0]]);
  });

  it('should navigate [/wallets/create-password, import] and create when almostOneChecked = true, and mode = import', () => {
    const spy = spyOn(walletService, 'create');
    component.almostOneChecked = true;
    component.mode = 'import';
    component.handleSubmit();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['/wallets/create-password', 'import']);
  });
});
