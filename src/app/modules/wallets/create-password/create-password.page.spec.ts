import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
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
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { WalletBackupService } from '../shared-wallets/services/wallet-backup/wallet-backup.service';
import { FakeActivatedRoute } from '../../../../testing/fakes/activated-route.fake.spec';
import { BlockchainsFactory } from '../../swaps/shared-swaps/models/blockchains/factory/blockchains.factory';
import { Wallet } from 'ethers';
import { XAuthService } from '../../users/shared-users/services/x-auth/x-auth.service';

const testMnemonic: Mnemonic = {
  locale: 'en',
  path: '',
  phrase: 'test phrase other word number another rooster keyboard confort destroy jingle july',
};
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
];

describe('CreatePasswordPage', () => {
  let component: CreatePasswordPage;
  let fixture: ComponentFixture<CreatePasswordPage>;
  let walletEncryptionServiceSpy: jasmine.SpyObj<WalletEncryptionService>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
  let fakeActivatedRoute: FakeActivatedRoute;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;
  let fakeLoadingService: FakeLoadingService;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let walletServiceSpy: jasmine.SpyObj<WalletService>;
  let walletSpy: jasmine.SpyObj<Wallet>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<CreatePasswordPage>;
  let walletMnemonicServiceSpy: jasmine.SpyObj<WalletMnemonicService>;
  let ionicStorageServiceSpy: jasmine.SpyObj<IonicStorageService>;
  let walletBackupServiceSpy: jasmine.SpyObj<WalletBackupService>;
  let blockchainsFactorySpy: jasmine.SpyObj<BlockchainsFactory>;
  let xAuthServiceSpy: jasmine.SpyObj<XAuthService>;

  beforeEach(() => {
    fakeLoadingService = new FakeLoadingService();
    loadingServiceSpy = fakeLoadingService.createSpy();
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    fakeActivatedRoute = new FakeActivatedRoute();
    activatedRouteSpy = fakeActivatedRoute.createSpy();
    fakeActivatedRoute.modifySnapshotParams({ mode: 'import' });
    walletMnemonicServiceSpy = jasmine.createSpyObj('WalletMnemonicService', {
      newMnemonic: testMnemonic,
    },
    {
      mnemonic: testMnemonic,
    });
    blockchainsFactorySpy = jasmine.createSpyObj('BlockchainsFactory', {
      create: {
        oneByName: () => ({
          derivedPath: () => 'aDerivedPath',
        }),
      },
    });
    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
      saveWalletAddresses: of({}),
      getCoins: coins,
    });
    walletEncryptionServiceSpy = jasmine.createSpyObj('WalletEncryptionService', {
      encryptWallet: Promise.resolve(true),
      getEncryptedWallet: Promise.resolve({ addresses: { ERC20: 'testERC20Address', RSK: 'testRSKAddress' } }),
    });

    ionicStorageServiceSpy = jasmine.createSpyObj('IonicStorageService', {
      set: Promise.resolve(),
    });
    walletBackupServiceSpy = jasmine.createSpyObj('WalletBackupService', {
      disableModal: Promise.resolve(),
    });

    walletSpy = jasmine.createSpyObj(
      'Wallet',
      {
        signMessage: Promise.resolve('aSignedMessage'),
      },
      { mnemonic: { path: 'aDerivedPath' }, address: 'anAddress' }
    );

    walletServiceSpy = jasmine.createSpyObj(
      'WalletService',
      {
        create: Promise.resolve({}),
        createForDerivedPath: walletSpy
      },
      {
        coins: [],
      }
    );

    xAuthServiceSpy = jasmine.createSpyObj('XAuthService', { saveToken: Promise.resolve(true) });

    TestBed.configureTestingModule({
      declarations: [CreatePasswordPage, FakeTrackClickDirective],
      imports: [ReactiveFormsModule, IonicModule, TranslateModule.forRoot()],
      providers: [
        UrlSerializer,
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: WalletEncryptionService, useValue: walletEncryptionServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: ApiWalletService, useValue: apiWalletServiceSpy },
        { provide: WalletService, useValue: walletServiceSpy },
        { provide: WalletMnemonicService, useValue: walletMnemonicServiceSpy },
        { provide: IonicStorageService, useValue: ionicStorageServiceSpy },
        { provide: WalletBackupService, useValue: walletBackupServiceSpy },
        { provide: BlockchainsFactory, useValue: blockchainsFactorySpy },
        { provide: XAuthService, useValue: xAuthServiceSpy },
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
    fakeActivatedRoute.modifySnapshotParams({ mode: 'create' });
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
    fakeActivatedRoute.modifySnapshotParams({ mode: '' });
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
    fakeActivatedRoute.modifySnapshotParams({ mode: '' });
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

  it('should set protectedWallet to true when importing wallet succeeds', fakeAsync(() => {
    fixture.detectChanges();
    component.ionViewWillEnter();
    tick();
    component.createPasswordForm.patchValue(formData.valid);
    fixture.detectChanges();
    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
    tick();
    expect(ionicStorageServiceSpy.set).toHaveBeenCalledWith('protectedWallet', true);
    expect(walletBackupServiceSpy.disableModal).toHaveBeenCalledTimes(1);
  }));

  it('should not set protectedWallet to true when creating wallet', fakeAsync(() => {
    fakeActivatedRoute.modifySnapshotParams({ mode: 'create' });
    fixture.detectChanges();
    component.ionViewWillEnter();
    tick();
    component.createPasswordForm.patchValue(formData.valid);
    fixture.detectChanges();
    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
    tick();
    expect(ionicStorageServiceSpy.set).not.toHaveBeenCalledWith('protectedWallet', true);
    expect(walletBackupServiceSpy.disableModal).not.toHaveBeenCalled();
  }));

  it('should save x-auth token after encrypt wallet', fakeAsync(() => {
    fakeActivatedRoute.modifySnapshotParams({ mode: 'create' });
    fixture.detectChanges();
    component.ionViewWillEnter();
    tick();
    component.createPasswordForm.patchValue(formData.valid);
    fixture.detectChanges();

    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
    tick();

    expect(xAuthServiceSpy.saveToken).toHaveBeenCalledWith('anAddress_aSignedMessage');
  }));
});
