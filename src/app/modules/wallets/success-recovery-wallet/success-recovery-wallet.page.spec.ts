import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { SUCCESS_TYPES } from 'src/app/shared/components/success-content/success-types.constant';
import { TrackedWalletAddressInjectable } from 'src/app/shared/models/tracked-wallet-address/injectable/tracked-wallet-address.injectable';
import { TrackedWalletAddress } from 'src/app/shared/models/tracked-wallet-address/tracked-wallet-address';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { SuccessRecoveryWalletPage } from './success-recovery-wallet.page';

describe('SuccessRecoveryWalletPage', () => {
  let component: SuccessRecoveryWalletPage;
  let fixture: ComponentFixture<SuccessRecoveryWalletPage>;
  let ionicStorageServiceSpy: jasmine.SpyObj<IonicStorageService>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;
  let trackedWalletAddressSpy: jasmine.SpyObj<TrackedWalletAddress>;
  let trackedWalletAddressInjectableSpy: jasmine.SpyObj<TrackedWalletAddressInjectable>;

  beforeEach(waitForAsync(() => {
    ionicStorageServiceSpy = jasmine.createSpyObj('IonicStorageService', {
      get: Promise.resolve(),
    });

    trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy', {
      trackEvent: Promise.resolve(true),
    });

    trackedWalletAddressSpy = jasmine.createSpyObj('TrackedWalletAddress', {
      value: null,
    });

    trackedWalletAddressInjectableSpy = jasmine.createSpyObj('TrackedWalletAddressInjectable', {
      create: trackedWalletAddressSpy,
    });
    TestBed.configureTestingModule({
      declarations: [SuccessRecoveryWalletPage],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: IonicStorageService, useValue: ionicStorageServiceSpy },
        { provide: TrackService, useValue: trackServiceSpy },
        { provide: TrackedWalletAddressInjectable, useValue: trackedWalletAddressInjectableSpy },
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

  it('should change properly data when profile test is completed', async () => {
    ionicStorageServiceSpy.get.and.resolveTo(true);
    const expectedUrl = '/tabs/wallets';
    const expectedName = 'wallets.success_wallet_recovery.button_home';

    component.ngOnInit();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    fixture.detectChanges();

    expect(component.data.urlPrimaryAction).toEqual(expectedUrl);
    expect(component.data.namePrimaryAction).toEqual(expectedName);
  });

  it('should not change primary url when profile test is not completed', async () => {
    component.ngOnInit();
    await fixture.whenStable();

    expect(component.data).toEqual(SUCCESS_TYPES.success_wallet_recovery);
  });

  it('should track screenview event and track wallet address on init', () => {
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
    expect(trackedWalletAddressSpy.value).toHaveBeenCalledTimes(1);
  });
});
