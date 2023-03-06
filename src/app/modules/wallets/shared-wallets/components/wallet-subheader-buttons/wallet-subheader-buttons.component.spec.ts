import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { WalletSubheaderButtonsComponent } from './wallet-subheader-buttons.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FakeTrackClickDirective } from '../../../../../../testing/fakes/track-click-directive.fake.spec';
import { FakeNavController } from '../../../../../../testing/fakes/nav-controller.fake.spec';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';
import { FakeFeatureFlagDirective } from 'src/testing/fakes/feature-flag-directive.fake.spec';
import { WalletBackupService } from '../../services/wallet-backup/wallet-backup.service';
import { TokenOperationDataService } from 'src/app/modules/fiat-ramps/shared-ramps/services/token-operation-data/token-operation-data.service';
import { DefaultSwapsUrls } from 'src/app/modules/swaps/shared-swaps/routes/default-swaps-urls';
import { rawUSDTData } from '../../../../swaps/shared-swaps/models/fixtures/raw-tokens-data';

describe('WalletSubheaderButtonsComponent', () => {
  let component: WalletSubheaderButtonsComponent;
  let fixture: ComponentFixture<WalletSubheaderButtonsComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<WalletSubheaderButtonsComponent>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let ionicStorageServiceSpy: jasmine.SpyObj<IonicStorageService>;
  let remoteConfigServiceSpy: jasmine.SpyObj<RemoteConfigService>;
  let walletBackupServiceSpy: jasmine.SpyObj<WalletBackupService>;
  let tokenOperationDataServiceSpy: jasmine.SpyObj<TokenOperationDataService>;
  beforeEach(waitForAsync(() => {
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    ionicStorageServiceSpy = jasmine.createSpyObj('IonicStorageService', {
      get: Promise.resolve(false),
      set: Promise.resolve(),
    });
    remoteConfigServiceSpy = jasmine.createSpyObj('RemoteConfigService', {
      getFeatureFlag: true,
    });
    walletBackupServiceSpy = jasmine.createSpyObj('WalletBackupService', {
      presentModal: Promise.resolve('skip'),
    });

    tokenOperationDataServiceSpy = jasmine.createSpyObj(
      'TokenOperationDataService',
      { clean: {}, set: {} },
      { tokenOperationData: {} }
    );

    TestBed.configureTestingModule({
      declarations: [WalletSubheaderButtonsComponent, FakeTrackClickDirective, FakeFeatureFlagDirective],
      imports: [TranslateModule.forRoot(), HttpClientTestingModule, IonicModule],
      providers: [
        { provide: IonicStorageService, useValue: ionicStorageServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: RemoteConfigService, useValue: remoteConfigServiceSpy },
        { provide: WalletBackupService, useValue: walletBackupServiceSpy },
        { provide: TokenOperationDataService, useValue: tokenOperationDataServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WalletSubheaderButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render send card', () => {
    fixture.detectChanges();
    const div = fixture.debugElement.query(By.css('.wsb__card-buttons__send-card'));
    expect(div).not.toBeNull();
  });

  it('should render swap card', () => {
    fixture.detectChanges();
    const div = fixture.debugElement.query(By.css('.wsb__card-buttons__swap-card'));
    expect(div).not.toBeNull();
  });

  it('should navigate to Send page when ux_go_to_send is clicked from HomeWalletPage', async () => {
    component.asset = '';
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('app-icon-button-card', 'ux_go_to_send');
    el.nativeElement.click();
    await fixture.whenStable();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['wallets/send/select-currency']);
  });

  it('should navigate to Send page of an specific asset when ux_go_to_send is clicked from AssetDetailPage', async () => {
    component.asset = rawUSDTData.value;
    component.tokenAddress = rawUSDTData.contract;
    component.network = rawUSDTData.network;
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('app-icon-button-card', 'ux_go_to_send');
    el.nativeElement.click();
    await fixture.whenStable();

    expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith([
      'wallets/send/detail/blockchain',
      rawUSDTData.network,
      'token',
      rawUSDTData.contract,
    ]);
  });

  it('should navigate to receive page with the default asset selected when ux_go_to_receive is clicked from HomeWalletPage', async () => {
    const el = trackClickDirectiveHelper.getByElementByName('app-icon-button-card', 'ux_go_to_receive');
    component.asset = '';
    el.nativeElement.click();
    await fixture.whenStable();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['wallets/receive/select-currency']);
  });

  it('should navigate to receive page with an asset selected when ux_go_to_receive is clicked from AssetDetailPage', async () => {
    const el = trackClickDirectiveHelper.getByElementByName('app-icon-button-card', 'ux_go_to_receive');
    component.asset = 'LINK';
    component.network = 'ERC20';
    el.nativeElement.click();
    await fixture.whenStable();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(
      ['wallets/receive/detail'],
      Object({ queryParams: Object({ asset: 'LINK', network: 'ERC20' }) })
    );
  });

  it('should navigate to swap page when ux_go_to_swap button is clicked and termsAndConditions1InchSwapAccepted is set on storage', async () => {
    ionicStorageServiceSpy.get.and.resolveTo(true);
    fixture.detectChanges();
    fixture.debugElement.query(By.css("app-icon-button-card[name='ux_go_to_swap']")).nativeElement.click();
    await fixture.whenStable();

    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(new DefaultSwapsUrls().home());
  });

  it('should navigate to buy conditions page when ux_go_to_buy button is clicked and conditionsPurchasesAccepted is not set on storage', async () => {
    fixture.debugElement.query(By.css("app-icon-button-card[name='ux_go_to_buy']")).nativeElement.click();
    await fixture.whenStable();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['fiat-ramps/buy-conditions']);
  });

  it('should navigate to purchases home page and clean asset data when ux_go_to_buy button is clicked and conditionsPurchasesAccepted is set on storage and is from tabs/walllet', async () => {
    ionicStorageServiceSpy.get.and.resolveTo(true);
    fixture.detectChanges();
    fixture.debugElement.query(By.css("app-icon-button-card[name='ux_go_to_buy']")).nativeElement.click();
    await fixture.whenStable();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['fiat-ramps/purchases']);
    expect(tokenOperationDataServiceSpy.clean).toHaveBeenCalledTimes(1);
  });

  it('should navigate to purchases home page and set asset data when ux_go_to_buy button is clicked, conditionsPurchasesAccepted is set on storage and is from token detail', async () => {
    component.asset = rawUSDTData.value;
    component.network = rawUSDTData.network;
    ionicStorageServiceSpy.get.and.resolveTo(true);
    fixture.detectChanges();
    fixture.debugElement.query(By.css("app-icon-button-card[name='ux_go_to_buy']")).nativeElement.click();
    await fixture.whenStable();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['fiat-ramps/purchases']);
    expect(tokenOperationDataServiceSpy.set).toHaveBeenCalledOnceWith({
      asset: 'USDT',
      network: 'ERC20',
      isFirstTime: true,
    });
  });

  it('should save data into service when ux_go_to_buy button is clicked and conditionsPurchasesAccepted is set on storage and there is asset', async () => {
    ionicStorageServiceSpy.get.and.resolveTo(true);
    component.asset = 'USDT';
    component.network = 'ERC20';
    fixture.detectChanges();
    fixture.debugElement.query(By.css("app-icon-button-card[name='ux_go_to_buy']")).nativeElement.click();
    await fixture.whenStable();
    expect(tokenOperationDataServiceSpy.tokenOperationData).not.toBeNull();
  });

  [
    {
      buttonName: 'ux_go_to_buy',
    },
    {
      buttonName: 'ux_go_to_send',
    },
    {
      buttonName: 'ux_go_to_receive',
    },
    {
      buttonName: 'ux_go_to_swap',
    },
  ].forEach((testcase) => {
    it(`should call trackEvent on trackService when ${testcase.buttonName} Button clicked`, () => {
      fixture.detectChanges();
      const el = trackClickDirectiveHelper.getByElementByName('app-icon-button-card', testcase.buttonName);
      const directive = trackClickDirectiveHelper.getDirective(el);
      const spy = spyOn(directive, 'clickEvent');
      el.nativeElement.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it(`should open modal and continue normally when ${testcase.buttonName} button is clicked and user clicks skip`, async () => {
      fixture.debugElement.query(By.css(`app-icon-button-card[name="${testcase.buttonName}"]`)).nativeElement.click();
      await fixture.whenStable();
      expect(walletBackupServiceSpy.presentModal).toHaveBeenCalledTimes(1);
      expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(1);
    });

    it(`should navigate to backup wallet when ${testcase.buttonName} button is clicked and user clicks backup button`, async () => {
      walletBackupServiceSpy.presentModal.and.resolveTo('backup');
      fixture.debugElement.query(By.css(`app-icon-button-card[name="${testcase.buttonName}"]`)).nativeElement.click();
      await fixture.whenStable();
      expect(walletBackupServiceSpy.presentModal).toHaveBeenCalledTimes(1);
      expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(0);
    });

    it(`should not navigate when ${testcase.buttonName} button is clicked and user clicks close button`, async () => {
      walletBackupServiceSpy.presentModal.and.resolveTo('close');
      fixture.debugElement.query(By.css(`app-icon-button-card[name="${testcase.buttonName}"]`)).nativeElement.click();
      await fixture.whenStable();
      expect(walletBackupServiceSpy.presentModal).toHaveBeenCalledTimes(1);
      expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(0);
    });
  });

  it(`should not render ux_go_to_buy if token is not available for purchase`, () => {
    component.enabledToBuy = false;
    fixture.detectChanges();
    const div = fixture.debugElement.query(By.css('.wsb__card-buttons__buy-card'));
    expect(div).toBeFalsy();
  });

  it(`should only render ux_go_to_receive if token is not available for operation`, () => {
    component.enabledToOperate = false;
    fixture.detectChanges();
    const divReceive = fixture.debugElement.query(By.css('.wsb__card-buttons__receive-card'));
    const divSend = fixture.debugElement.query(By.css('.wsb__card-buttons__send-card'));
    const divBuy = fixture.debugElement.query(By.css('.wsb__card-buttons__buy-card'));
    const divSwap = fixture.debugElement.query(By.css('.wsb__card-buttons__swap-card'));

    expect(divReceive).toBeTruthy();
    expect(divSend).toBeFalsy();
    expect(divBuy).toBeFalsy();
    expect(divSwap).toBeFalsy();
  });
});
