import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync, fakeAsync, tick } from '@angular/core/testing';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { SuccessCreationPage } from './success-creation.page';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';
import { By } from '@angular/platform-browser';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { TrackedWalletAddress } from 'src/app/shared/models/tracked-wallet-address/tracked-wallet-address';
import { TrackedWalletAddressInjectable } from 'src/app/shared/models/tracked-wallet-address/injectable/tracked-wallet-address.injectable';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { GoogleAuthService } from 'src/app/shared/services/google-auth/google-auth.service';
import { WalletEncryptionService } from '../shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { of } from 'rxjs';
import { StorageService } from '../shared-wallets/services/storage-wallets/storage-wallets.service';

describe('SuccessCreationPage', () => {
  let component: SuccessCreationPage;
  let fixture: ComponentFixture<SuccessCreationPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<SuccessCreationPage>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;
  let trackedWalletAddressSpy: jasmine.SpyObj<TrackedWalletAddress>;
  let trackedWalletAddressInjectableSpy: jasmine.SpyObj<TrackedWalletAddressInjectable>;
  let ionicStorageServiceSpy: jasmine.SpyObj<IonicStorageService>;
  let googleAuthServiceSpy: jasmine.SpyObj<GoogleAuthService>;
  let walletEncryptionServiceSpy: jasmine.SpyObj<WalletEncryptionService>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;

  beforeEach(waitForAsync(() => {
    trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy', {
      trackEvent: Promise.resolve(true),
    });
    fakeModalController = new FakeModalController(null, { data: 'password' });
    modalControllerSpy = fakeModalController.createSpy();
    trackedWalletAddressSpy = jasmine.createSpyObj('TrackedWalletAddress', {
      value: null,
    });
    trackedWalletAddressInjectableSpy = jasmine.createSpyObj('TrackedWalletAddressInjectable', {
      create: trackedWalletAddressSpy,
    });

    ionicStorageServiceSpy = jasmine.createSpyObj('IonicStorageService', {
      get: Promise.resolve(true),
      set: Promise.resolve(true),
    });

    ionicStorageServiceSpy.get.withArgs('wallet_backup').and.returnValue(Promise.resolve(true));

    googleAuthServiceSpy = jasmine.createSpyObj('GoogleAuthService', {
      accessToken: of('token'),
      createFile: of({}),
    });

    walletEncryptionServiceSpy = jasmine.createSpyObj('WalletEncryptionService', {
      getEncryptedWallet: Promise.resolve({}),
    });

    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();

    storageServiceSpy = jasmine.createSpyObj('StorageService', {
      getWalletFromStorage: Promise.resolve({
        addresses: { ERC20: 'testAddressErc20' },
      }),
    });
    TestBed.configureTestingModule({
      declarations: [FakeTrackClickDirective, SuccessCreationPage],
      imports: [TranslateModule.forRoot(), IonicModule.forRoot()],
      providers: [
        { provide: TrackService, useValue: trackServiceSpy },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: TrackedWalletAddressInjectable, useValue: trackedWalletAddressInjectableSpy },
        { provide: IonicStorageService, useValue: ionicStorageServiceSpy },
        { provide: GoogleAuthService, useValue: googleAuthServiceSpy },
        { provide: WalletEncryptionService, useValue: walletEncryptionServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: StorageService, useValue: storageServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SuccessCreationPage);
    component = fixture.componentInstance;
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly', () => {
    const imgEl = fixture.debugElement.query(By.css('.header__ux_success_image img'));
    const titleEl = fixture.debugElement.query(By.css('.main__primary_text ion-text'));
    const subtitleEl = fixture.debugElement.query(By.css('.main__secondary_text ion-text'));
    expect(imgEl.attributes.src).toContain('assets/img/wallets/success_creation.svg');
    expect(titleEl.nativeElement.innerHTML).toContain('wallets.success_creation.title');
    expect(subtitleEl.nativeElement.innerHTML).toContain('wallets.success_creation.subtitle');
  });

  it('should open modal when ux_create_skip Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_create_skip');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should track screenview event and track wallet address on init', () => {
    component.ionViewWillEnter();
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
    expect(trackedWalletAddressSpy.value).toHaveBeenCalledTimes(1);
  });

  it('should set correct states of steps if wallet is protected and backup is completed', fakeAsync(() => {
    const stepOne = component.steps.find((step) => step.order === '1');
    const stepTwo = component.steps.find((step) => step.order === '2');
    component.ionViewWillEnter();
    tick();
    fixture.detectChanges();
    expect(stepOne.completed).toBeTrue();
    expect(stepTwo.disabled).toBeFalse();
    expect(stepTwo.completed).toBeTrue();
  }));

  it('should create file on google drive and set wallet_backup in true on storage when backup is completed', fakeAsync(() => {
    ionicStorageServiceSpy.get.withArgs('wallet_backup').and.returnValue(Promise.resolve(false));
    component.ionViewWillEnter();
    fixture.debugElement.query(By.css('app-user-register-step-card')).triggerEventHandler('cardClicked');
    tick(600);
    fixture.detectChanges();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(2);
    expect(googleAuthServiceSpy.accessToken).toHaveBeenCalledTimes(1);
    expect(walletEncryptionServiceSpy.getEncryptedWallet).toHaveBeenCalledTimes(1);
    expect(ionicStorageServiceSpy.set).toHaveBeenCalledTimes(1);
    expect(googleAuthServiceSpy.createFile).toHaveBeenCalledTimes(1);
  }));

  it('should render button "in other moment" if wallet_backup is false', () => {
    ionicStorageServiceSpy.get.withArgs('wallet_backup').and.returnValue(Promise.resolve(false));
    component.ionViewWillEnter();
    fixture.detectChanges();
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="ux_create_skip"]'));
    expect(buttonEl).toBeTruthy();
  });

  it('should render button "finish" if wallet_backup is true', fakeAsync(() => {
    ionicStorageServiceSpy.get.withArgs('wallet_backup').and.returnValue(Promise.resolve(true));
    component.ionViewWillEnter();
    tick();
    fixture.detectChanges();
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="ux_finish_backup"]'));
    expect(buttonEl).toBeTruthy();
  }));

  it('should navigate to wallet home when ux_finish_backup is clicked', fakeAsync(() => {
    ionicStorageServiceSpy.get.withArgs('wallet_backup').and.returnValue(Promise.resolve(true));
    component.ionViewWillEnter();
    tick();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="ux_finish_backup"]')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith('tabs/wallets');
  }));

  it('should set the service variable with the user erc20 wallet on init', async () => {
    await component.ionViewWillEnter();
    expect(storageServiceSpy.getWalletFromStorage).toHaveBeenCalledTimes(1);
    expect(googleAuthServiceSpy.walletAddress).toEqual('testAddressErc20');
  });
});
