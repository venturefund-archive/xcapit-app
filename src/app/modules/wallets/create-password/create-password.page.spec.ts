import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { CreatePasswordPage } from './create-password.page';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute,  } from '@angular/router';
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
import { FakeActivatedRoute } from '../../../../testing/fakes/activated-route.fake.spec';
import { Wallet } from 'ethers';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';
import { WalletInitializeProcess } from '../shared-wallets/services/wallet-initialize-process/wallet-initialize-process';
import { By } from '@angular/platform-browser';

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
  let remoteConfigSpy: jasmine.SpyObj<RemoteConfigService>;
  let walletInitializeProcessSpy: jasmine.SpyObj<WalletInitializeProcess>;
  beforeEach(waitForAsync(() => {
    fakeLoadingService = new FakeLoadingService();
    loadingServiceSpy = fakeLoadingService.createSpy();
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    fakeActivatedRoute = new FakeActivatedRoute();
    activatedRouteSpy = fakeActivatedRoute.createSpy();
    fakeActivatedRoute.modifySnapshotParams({ mode: 'import' });
    walletMnemonicServiceSpy = jasmine.createSpyObj(
      'WalletMnemonicService',
      {
        newMnemonic: testMnemonic,
      },
      {
        mnemonic: testMnemonic,
      }
    );

    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
      saveWalletAddresses: of({}),
      getCoins: coins,
      getInitialTokens: coins,
    });
    walletEncryptionServiceSpy = jasmine.createSpyObj(
      'WalletEncryptionService',
      {
        encryptWallet: Promise.resolve(true),
      },
      { creationMethod: 'default' }
    );

    walletSpy = jasmine.createSpyObj(
      'Wallet',
      {
        signMessage: Promise.resolve('aSignedMessage'),
      },
      { mnemonic: { path: 'aDerivedPath' }, address: 'anAddress' }
    );
    spyOn(Wallet, 'fromMnemonic').and.returnValue(walletSpy);

    walletServiceSpy = jasmine.createSpyObj(
      'WalletService',
      {},
      {
        coins: [],
      }
    );

    remoteConfigSpy = jasmine.createSpyObj('RemoteConfigService', { getFeatureFlag: true });
    walletInitializeProcessSpy = jasmine.createSpyObj('WalletInitializeProcess', {
      run: Promise.resolve(),
    });
    TestBed.configureTestingModule({
      declarations: [CreatePasswordPage, FakeTrackClickDirective],
      imports: [ReactiveFormsModule, IonicModule, TranslateModule.forRoot()],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
        { provide: WalletEncryptionService, useValue: walletEncryptionServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: ApiWalletService, useValue: apiWalletServiceSpy },
        { provide: WalletService, useValue: walletServiceSpy },
        { provide: WalletMnemonicService, useValue: walletMnemonicServiceSpy },
        { provide: RemoteConfigService, useValue: remoteConfigSpy },
        { provide: WalletInitializeProcess, useValue: walletInitializeProcessSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize wallet on submit', fakeAsync(() => {
    component.createPasswordForm.patchValue(formData.valid);
    component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="ux_import_submit_wallet_password"]')).nativeElement.click();
    tick();
    expect(walletEncryptionServiceSpy.encryptWallet).toHaveBeenCalledTimes(1);
    expect(walletInitializeProcessSpy.run).toHaveBeenCalledTimes(1);
  }));

  it('should navigate to success import page when mode is import', fakeAsync(() => {
    component.createPasswordForm.patchValue(formData.valid);
    component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="ux_import_submit_wallet_password"]')).nativeElement.click();
    tick();
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledOnceWith('/wallets/recovery/success');
  }));

  it('should navigate to experimental onboarding when creating wallet and experimental onboarding', fakeAsync(() => {
    fakeActivatedRoute.modifySnapshotParams({ mode: 'create' });
    component.createPasswordForm.patchValue(formData.valid);
    component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="ux_create_submit_wallet_password"]')).nativeElement.click();
    tick();
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledOnceWith('wallets/experimental-onboarding');
  }));

  it('should navigate to success creation when creating wallet but no experimental onboarding', fakeAsync(() => {
    fakeActivatedRoute.modifySnapshotParams({ mode: 'create' });
    remoteConfigSpy.getFeatureFlag.and.returnValue(false);
    component.createPasswordForm.patchValue(formData.valid);
    component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="ux_create_submit_wallet_password"]')).nativeElement.click();
    tick();
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledOnceWith('/wallets/success-creation');
  }));

  it('should not initialize wallet when form is not valid', async () => {
    component.createPasswordForm.patchValue(formData.invalid);
    fixture.detectChanges();
    await component.handleSubmit();
    await fixture.whenStable();
    expect(walletEncryptionServiceSpy.encryptWallet).toHaveBeenCalledTimes(0);
    expect(walletInitializeProcessSpy.run).toHaveBeenCalledTimes(0);
  });

  it('should navigate to derived-path-options/import when mode is import', () => {
    component.ionViewWillEnter();
    fixture.debugElement.query(By.css('ion-button[name="ux_edit"]')).nativeElement.click();
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('wallets/derived-path-options/import');
  });

  it('should navigate to derived-path-options/create when mode is create', () => {
    fakeActivatedRoute.modifySnapshotParams({ mode: 'create' });
    component.ionViewWillEnter();
    fixture.debugElement.query(By.css('ion-button[name="ux_edit"]')).nativeElement.click();
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('wallets/derived-path-options/create');
  });

  it('should create a wallet when did enter', async () => {
    fakeActivatedRoute.modifySnapshotParams({ mode: 'create' });
    component.ionViewWillEnter();
    await component.ionViewDidEnter();
    fixture.detectChanges();
    expect(apiWalletServiceSpy.getInitialTokens).toHaveBeenCalledTimes(1);
    expect(walletMnemonicServiceSpy.newMnemonic).toHaveBeenCalledTimes(1);
  });

});
