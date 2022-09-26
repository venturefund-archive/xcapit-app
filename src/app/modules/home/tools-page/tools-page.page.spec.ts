import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { AppStorageService } from 'src/app/shared/services/app-storage/app-storage.service';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { FakeFeatureFlagDirective } from 'src/testing/fakes/feature-flag-directive.fake.spec';
import { WalletBackupService } from '../../wallets/shared-wallets/services/wallet-backup/wallet-backup.service';
import { ToolsPage } from './tools-page.page';

const dataTest = {
  category: 'purchases',
  expenses: 700,
  income: 1000,
  name: 'Auto',
  necessaryAmount: 2500,
};

describe('ToolPagePage', () => {
  let component: ToolsPage;
  let fixture: ComponentFixture<ToolsPage>;
  let walletBackupServiceSpy: jasmine.SpyObj<WalletBackupService>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;
  let appStorageServiceSpy: jasmine.SpyObj<AppStorageService>;

  beforeEach(waitForAsync(() => {
    walletBackupServiceSpy = jasmine.createSpyObj('WalletBackupService', {
      presentModal: Promise.resolve('skip'),
    });
    trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy', { trackEvent: Promise.resolve(true) });
    appStorageServiceSpy = jasmine.createSpyObj('AppStorageService', { get: dataTest });

    TestBed.configureTestingModule({
      declarations: [ ToolsPage, FakeFeatureFlagDirective ],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [ 
        { provide: WalletBackupService, useValue: walletBackupServiceSpy },
        { provide: TrackService, useValue: trackServiceSpy },
        { provide: AppStorageService, useValue: appStorageServiceSpy },
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

  it('should render app-objetive-card component if there is data in the storage', async () => {
    component.ionViewWillEnter();
    await fixture.whenRenderingDone();
    fixture.detectChanges();
    const componentObjetiveEl = fixture.debugElement.query(By.css('div.card-objetive'));
    expect(appStorageServiceSpy.get).toHaveBeenCalledTimes(1);
    expect(componentObjetiveEl).toBeTruthy();
  });

  it('should track screenview event on init', () => {
    component.ionViewWillEnter();
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
  });
});
