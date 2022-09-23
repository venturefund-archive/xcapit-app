import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { SUCCESS_TYPES } from 'src/app/shared/components/success-content/success-types.constant';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { SuccessRecoveryWalletPage } from './success-recovery-wallet.page';

describe('SuccessRecoveryWalletPage', () => {
  let component: SuccessRecoveryWalletPage;
  let fixture: ComponentFixture<SuccessRecoveryWalletPage>;
  let ionicStorageServiceSpy: jasmine.SpyObj<IonicStorageService>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;

  beforeEach(waitForAsync(() => {
    ionicStorageServiceSpy = jasmine.createSpyObj('IonicStorageService', {
      get: Promise.resolve(),
    });

    trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy', {
      trackEvent: Promise.resolve(true),
    });
    TestBed.configureTestingModule({
      declarations: [SuccessRecoveryWalletPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: IonicStorageService, useValue: ionicStorageServiceSpy },
        { provide: TrackService, useValue: trackServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SuccessRecoveryWalletPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change primary url when profile test is completed', async () => {
    ionicStorageServiceSpy.get.and.resolveTo(true);
    const expectedData = { ...SUCCESS_TYPES.success_wallet_recovery };
    expectedData.urlPrimaryAction = '/tabs/wallets';

    component.ngOnInit();
    await fixture.whenStable();

    expect(component.data).toEqual(expectedData);
  });

  it('should not change primary url when profile test is not completed', async () => {
    component.ngOnInit();
    await fixture.whenStable();

    expect(component.data).toEqual(SUCCESS_TYPES.success_wallet_recovery);
  });

  it('should track screenview event on init', () => {
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
  });
});
