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
import { WalletBackupService } from '../../wallet-backup/wallet-backup.service';
import { defaultSwapsUrls } from 'src/app/modules/swaps/swaps-routing.module';

describe('WalletSubheaderButtonsComponent', () => {
  let component: WalletSubheaderButtonsComponent;
  let fixture: ComponentFixture<WalletSubheaderButtonsComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<WalletSubheaderButtonsComponent>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let ionicStorageServiceSpy: jasmine.SpyObj<IonicStorageService>;
  let remoteConfigServiceSpy: jasmine.SpyObj<RemoteConfigService>;
  let walletBackupServiceSpy: jasmine.SpyObj<WalletBackupService>;

  beforeEach(
    waitForAsync(() => {
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

      TestBed.configureTestingModule({
        declarations: [WalletSubheaderButtonsComponent, FakeTrackClickDirective, FakeFeatureFlagDirective],
        imports: [TranslateModule.forRoot(), HttpClientTestingModule, IonicModule],
        providers: [
          { provide: IonicStorageService, useValue: ionicStorageServiceSpy },
          { provide: NavController, useValue: navControllerSpy },
          { provide: RemoteConfigService, useValue: remoteConfigServiceSpy },
          { provide: WalletBackupService, useValue: walletBackupServiceSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(WalletSubheaderButtonsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

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

  it('should navigate to Send page when ux_go_to_send is clicked from HomeWalletPage', async() => {
    component.asset = '';
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('app-icon-button-card', 'ux_go_to_send');
    el.nativeElement.click();
    await fixture.whenStable();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['wallets/send/select-currency']);
  });

  it('should navigate to Send page of an specific asset when ux_go_to_send is clicked from AssetDetailPage', async() => {
    component.asset = 'USDT';
    component.network = 'ERC20';
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('app-icon-button-card', 'ux_go_to_send');
    el.nativeElement.click();
    await fixture.whenStable();

    expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(
      ['wallets/send/detail'],
      Object({ queryParams: Object({ asset: 'USDT', network: 'ERC20' }) })
    );
  });

  it('should navigate to receive page with the default asset selected when ux_go_to_receive is clicked from HomeWalletPage', async() => {
    const el = trackClickDirectiveHelper.getByElementByName('app-icon-button-card', 'ux_go_to_receive');
    component.asset = '';
    el.nativeElement.click();
    await fixture.whenStable();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['wallets/receive/select-currency']);
  });

  it('should navigate to receive page with an asset selected when ux_go_to_receive is clicked from AssetDetailPage', async() => {
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

  it('should navigate to swap when ux_go_to_swap button is clicked', async () => {
    fixture.debugElement.query(By.css("app-icon-button-card[name='ux_go_to_swap']")).nativeElement.click();
    await fixture.whenStable();

    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(defaultSwapsUrls.swapHome);
  });

  it('should navigate to fiat-ramps moonpay page when ux_go_to_buy button is clicked', async () => {
    fixture.debugElement.query(By.css("app-icon-button-card[name='ux_go_to_buy']")).nativeElement.click();
    await fixture.whenStable();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['fiat-ramps/select-provider']);
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
});
