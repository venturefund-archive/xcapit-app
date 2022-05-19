import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { CreatePasswordPage } from './create-password.page';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, UrlSerializer } from '@angular/router';
import { WalletEncryptionService } from '../shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { LoadingService } from '../../../shared/services/loading/loading.service';
import { ApiWalletService } from '../shared-wallets/services/api-wallet/api-wallet.service';
import { of } from 'rxjs';
import { FakeNavController } from '../../../../testing/fakes/nav-controller.fake.spec';
import { FakeLoadingService } from '../../../../testing/fakes/loading.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { Mnemonic } from '@ethersproject/hdnode';
import { WalletMnemonicService } from '../shared-wallets/services/wallet-mnemonic/wallet-mnemonic.service';
import { WalletService } from '../shared-wallets/services/wallet/wallet.service';

const testMnemonic: Mnemonic = {
  locale: 'en',
  path: '',
  phrase: 'test phrase other word number another rooster keyboard confort destroy jingle july',
};

describe('CreatePasswordPage', () => {
  let component: CreatePasswordPage;
  let fixture: ComponentFixture<CreatePasswordPage>;
  let walletEncryptionServiceSpy: jasmine.SpyObj<WalletEncryptionService>;
  let activatedRouteMock: any;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;
  let fakeLoadingService: FakeLoadingService;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let walletServiceSpy: jasmine.SpyObj<WalletService>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<CreatePasswordPage>;
  let walletMnemonicServiceSpy: jasmine.SpyObj<WalletMnemonicService>;
  const formData = {
    valid: {
      password: 'Test123',
      repeat_password: 'Test123',
    },
    invalid: {
      password: 'Test123',
      repeat_password: 'Test111',
    },
  };
  const coins = [
    {
      id: 0,
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
      id: 1,
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
  ]
  beforeEach(() => {
    fakeLoadingService = new FakeLoadingService();
    loadingServiceSpy = fakeLoadingService.createSpy();
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    walletMnemonicServiceSpy = jasmine.createSpyObj('WalletMnemonicService', {
      newMnemonic: () => testMnemonic,
      mnemonic: testMnemonic,
    });
    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
      saveWalletAddresses: of({}),
      getCoins: coins,
    });
    walletEncryptionServiceSpy = jasmine.createSpyObj('WalletEncryptionService', {
      encryptWallet: Promise.resolve(true),
      getEncryptedWallet: Promise.resolve({ addresses: { ERC20: 'testERC20Address', RSK: 'testRSKAddress' } }),
    });
    walletServiceSpy = jasmine.createSpyObj('WalletService', { 
      create: Promise.resolve({}) 
    },{
      coins: [],
    });
    activatedRouteMock = { snapshot: { paramMap: { get: () => 'import' } } };
    TestBed.configureTestingModule({
      declarations: [CreatePasswordPage, FakeTrackClickDirective],
      imports: [ReactiveFormsModule, IonicModule, TranslateModule.forRoot()],
      providers: [
        UrlSerializer,
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: WalletEncryptionService, useValue: walletEncryptionServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: ApiWalletService, useValue: apiWalletServiceSpy },
        { provide: WalletService, useValue: walletServiceSpy },
        { provide: WalletMnemonicService, useValue: walletMnemonicServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call handleSubmit on submit event, valid form', () => {
    component.createPasswordForm.patchValue(formData.valid);
    component.ionViewWillEnter();
    const spy = spyOn(component, 'handleSubmit');
    fixture.detectChanges();
    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call encryptWallet on encrypt, valid form', async () => {
    component.createPasswordForm.patchValue(formData.valid);
    fixture.detectChanges();
    component.handleSubmit();
    await fixture.whenStable();
    expect(walletEncryptionServiceSpy.encryptWallet).toHaveBeenCalledTimes(1);
  });

  it('should create a wallet', async () => {
    activatedRouteMock.snapshot.paramMap.get = () => 'create';
    component.ionViewWillEnter();
    await component.ionViewDidEnter();
    fixture.detectChanges();
    expect(apiWalletServiceSpy.getCoins).toHaveBeenCalledTimes(1);
    expect(walletMnemonicServiceSpy.newMnemonic).toHaveBeenCalledTimes(1);
    expect(walletServiceSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should not call encryptWallet on encrypt, no valid form', async () => {
    component.createPasswordForm.patchValue(formData.invalid);
    fixture.detectChanges();
    component.handleSubmit();
    await fixture.whenStable();
    expect(walletEncryptionServiceSpy.encryptWallet).toHaveBeenCalledTimes(0);
  });

  it('should show import text when importing wallet', () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    const titleEl = fixture.debugElement.query(By.css('ion-title')).nativeElement;
    const buttonEl = fixture.debugElement.query(
      By.css('ion-button[name = "ux_import_submit_wallet_password"]')
    ).nativeElement;
    expect(titleEl.innerText).toContain('wallets.recovery_wallet.header');
    expect(buttonEl.innerText).toContain('wallets.create_password.finish_button_import');
  });

  it('should show create text when creating wallet', () => {
    activatedRouteMock.snapshot.paramMap.get = () => '';
    component.ionViewWillEnter();
    fixture.detectChanges();
    const titleEl = fixture.debugElement.query(By.css('ion-title')).nativeElement;
    const buttonEl = fixture.debugElement.query(
      By.css('ion-button[name = "ux_create_submit_wallet_password"]')
    ).nativeElement;
    expect(titleEl.innerText).toContain('wallets.create_password.header');
    expect(buttonEl.innerText).toContain('wallets.create_password.finish_button_create');
  });

  it('should call trackEvent on trackService when ux_create_submit_wallet_password clicked', () => {
    activatedRouteMock.snapshot.paramMap.get = () => '';
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_create_submit_wallet_password');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when ux_import_submit_wallet_password clicked', () => {
    const el = fixture.debugElement.query(By.css('ion-button[name = "ux_create_submit_wallet_password"]'));
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
