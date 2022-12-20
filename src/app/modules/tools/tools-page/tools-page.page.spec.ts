import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeAppVersion } from 'src/app/shared/models/app-version/fake/fake-app-version';
import { AppVersionInjectable } from 'src/app/shared/models/app-version/injectable/app-version.injectable';
import { AppStorageService } from 'src/app/shared/services/app-storage/app-storage.service';
import { PlatformService } from 'src/app/shared/services/platform/platform.service';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { FakeFeatureFlagDirective } from 'src/testing/fakes/feature-flag-directive.fake.spec';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { WalletBackupService } from '../../wallets/shared-wallets/services/wallet-backup/wallet-backup.service';
import { WalletConnectService } from '../../wallets/shared-wallets/services/wallet-connect/wallet-connect.service';
import { ToolsPage } from './tools-page.page';

describe('ToolPagePage', () => {
  let component: ToolsPage;
  let fixture: ComponentFixture<ToolsPage>;
  let walletBackupServiceSpy: jasmine.SpyObj<WalletBackupService>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;
  let appStorageServiceSpy: jasmine.SpyObj<AppStorageService>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let walletConnectServiceSpy: jasmine.SpyObj<WalletConnectService>;
  let remoteConfigServiceSpy: jasmine.SpyObj<RemoteConfigService>;
  let fakeAppVersion: FakeAppVersion;
  let appVersionInjectableSpy: jasmine.SpyObj<AppVersionInjectable>;
  let platformServiceSpy: jasmine.SpyObj<PlatformService>;

  const dataTest = {
    category: 'purchases',
    expenses: 700,
    income: 1000,
    name: 'Auto',
    necessaryAmount: 2500,
  };

  beforeEach(waitForAsync(() => {
    walletBackupServiceSpy = jasmine.createSpyObj('WalletBackupService', {
      presentModal: Promise.resolve('skip'),
    });
    trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy', { trackEvent: Promise.resolve(true) });
    appStorageServiceSpy = jasmine.createSpyObj('AppStorageService', { get: dataTest });
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    walletConnectServiceSpy = jasmine.createSpyObj('WalletConnectService', { connected: false });

    remoteConfigServiceSpy = jasmine.createSpyObj('RemoteConfigService', {
      getFeatureFlag: true,
    });

    fakeAppVersion = new FakeAppVersion(Promise.resolve('3.0.1'), '3.0.1', Promise.resolve(true));

    appVersionInjectableSpy = jasmine.createSpyObj('AppVersionInjectable', {
      create: fakeAppVersion,
    });

    platformServiceSpy = jasmine.createSpyObj('PlatformService', {
      isNative: false,
    });

    TestBed.configureTestingModule({
      declarations: [ToolsPage, FakeFeatureFlagDirective, FakeTrackClickDirective],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: WalletBackupService, useValue: walletBackupServiceSpy },
        { provide: TrackService, useValue: trackServiceSpy },
        { provide: AppStorageService, useValue: appStorageServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: WalletConnectService, useValue: walletConnectServiceSpy },
        { provide: RemoteConfigService, useValue: remoteConfigServiceSpy },
        { provide: AppVersionInjectable, useValue: appVersionInjectableSpy },
        { provide: PlatformService, useValue: platformServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ToolsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render app-objetive-card component if there is planner data in the storage', async () => {
    await component.ionViewWillEnter();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    const componentObjetiveEl = fixture.debugElement.query(By.css('div.card-objetive'));
    expect(appStorageServiceSpy.get).toHaveBeenCalledTimes(1);
    expect(componentObjetiveEl).toBeTruthy();
  });

  it('should track screenview event on init', async () => {
    await component.ionViewWillEnter();
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
  });

  it('should navigate to objetive page when ux_go_to_planner is clicked', async () => {
    await component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('app-tools-card')).triggerEventHandler('primaryActionEvent', 'ux_go_to_planner');
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['/financial-planner/result-objetive']);
  });

  it('should navigate to donations when ux_go_to_donations is clicked', async () => {
    platformServiceSpy.isNative.and.returnValue(true);
    await component.ionViewWillEnter();
    await fixture.whenStable();
    fixture.detectChanges();
    fixture.debugElement
      .query(By.css('app-tools-card'))
      .triggerEventHandler('primaryActionEvent', 'ux_go_to_donations');
    await fixture.whenStable();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['/donations/causes']);
  });

  it('should navigate to objetive page when objetive card is clicked', async () => {
    component.plannerData = dataTest;
    await component.ionViewWillEnter();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('div.card-objetive')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['/financial-planner/result-objetive']);
  });

  it('should render correct icon if wallet connect is not connected and redirect to new connection page when icon is clicked', async () => {
    walletConnectServiceSpy.connected = false;
    await component.ionViewWillEnter();
    fixture.detectChanges();
    const iconEl = fixture.debugElement.query(By.css('ion-icon[name="ux-walletconnect"]'));
    iconEl.nativeElement.click();
    expect(iconEl).toBeTruthy();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/wallets/wallet-connect/new-connection');
  });

  it('should render correct icon if wallet connect is connected and redirect to connection detail page when icon is clicked', async () => {
    walletConnectServiceSpy.connected = true;
    await component.ionViewWillEnter();
    fixture.detectChanges();
    const iconEl = fixture.debugElement.query(By.css('ion-icon[name="ux-walletconnectconnect"]'));
    iconEl.nativeElement.click();
    expect(iconEl).toBeTruthy();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/wallets/wallet-connect/connection-detail');
  });

  it('should hide donations if in review feature flag is true', async () => {
    platformServiceSpy.isNative.and.returnValue(true);
    remoteConfigServiceSpy.getFeatureFlag.withArgs('inReview').and.returnValue(true);
    await component.ionViewWillEnter();
    fixture.detectChanges();

    expect(component.content.length).toEqual(3);
  });
});
