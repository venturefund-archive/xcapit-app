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
    last: true,
    value: 'MATIC',
    network: 'MATIC',
    chainId: 80001,
    rpc: 'http://testrpc.text/',
    decimals: 18,
    native: true,
  },
];

const formData = {
  valid: {
    ETH: {
      AAVE: false,
      ETH: true,
      LINK: false,
      UNI: true,
      USDT: false,
    },
    POLYGON: {
      MATIC: false,
    },
    RSK: {
      RBTC: false,
      RIF: false,
    },
  },
  invalid: {
    ETH: {
      AAVE: false,
      ETH: false,
      LINK: false,
      UNI: false,
      USDT: false,
    },
    POLYGON: {
      MATIC: false,
    },
    RSK: {
      RBTC: false,
      RIF: false,
    },
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

  it('should not activate the Next button when no token is selected', () => {
    const nextButton = fixture.debugElement.query(By.css('ion-button[name="Next"]'));
    expect(nextButton.attributes['ng-reflect-disabled']).toEqual('true');
  });

  it('should activate the Next button when at least one token is selected', () => {
    component.form.patchValue({ ETH: { LINK: true } });
    fixture.detectChanges();
    const nextButton = fixture.debugElement.query(By.css('ion-button[name="Next"]'));
    expect(nextButton.attributes['ng-reflect-disabled']).toEqual('false');
  });

  it('should navigate to recovery phrase page on submit button clicked , valid form and mode empty', () => {
    component.mode = '';
    component.almostOneChecked = true;
    fixture.debugElement.query(By.css('form.ux_main')).triggerEventHandler('ngSubmit', null);
    component.form.patchValue(formData.valid);
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['/wallets/create-first/recovery-phrase']);
  });

  it('should navigate to recovery phrase page on submit button clicked having at least one asset selected, and importing the wallet', () => {
    component.mode = 'import';
    component.almostOneChecked = true;
    const spy = spyOn(walletService, 'create');
    component.form.patchValue(formData.valid);
    fixture.debugElement.query(By.css('form.ux_main')).triggerEventHandler('ngSubmit', null);
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['/wallets/create-password', 'import']);
  });

  it('should not navigate to recovery phrase page on submit button clicked  dont having at least one asset selected', () => {
    component.almostOneChecked = false;
    fixture.detectChanges();
    component.handleSubmit();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(0);
  });

  it('should set coins in wallet service on handleSubmit and valid form', () => {
    component.coins = testCoins;
    component.form.patchValue({ ETH: { ETH: true } });
    fixture.detectChanges();
    component.handleSubmit();
    expect(walletService.coins).toEqual([testCoins[0]]);
  });
});
