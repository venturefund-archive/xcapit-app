import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { ExportPrivateKeyPage } from './export-private-key.page';
import { ApiWalletService } from '../shared-wallets/services/api-wallet/api-wallet.service';
import { WalletEncryptionService } from '../shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { ClipboardService } from '../../../shared/services/clipboard/clipboard.service';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { FakeModalController } from '../../../../testing/fakes/modal-controller.fake.spec';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FakeNavController } from '../../../../testing/fakes/nav-controller.fake.spec';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TrackClickDirectiveTestHelper } from '../../../../testing/track-click-directive-test.spec';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ExportPrivateKeyPage', () => {
  let component: ExportPrivateKeyPage;
  let fixture: ComponentFixture<ExportPrivateKeyPage>;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let walletEncryptionServiceSpy: jasmine.SpyObj<WalletEncryptionService>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;
  let clipboardServiceSpy: jasmine.SpyObj<ClipboardService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<ExportPrivateKeyPage>;
  beforeEach(
    waitForAsync(() => {
      fakeModalController = new FakeModalController({}, { data: 'testPassword' });
      modalControllerSpy = fakeModalController.createSpy();
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', { getNetworks: ['ERC20', 'MATIC'] });
      walletEncryptionServiceSpy = jasmine.createSpyObj('WalletEncryptionService', {
        getDecryptedWalletForNetwork: { privateKey: 'testPrivateKey', address: 'testAddress' },
      });
      clipboardServiceSpy = jasmine.createSpyObj('ClipboardService', { write: Promise.resolve() });
      toastServiceSpy = jasmine.createSpyObj('ToastService', {
        showSuccessToast: Promise.resolve(),
        showErrorToast: Promise.resolve(),
      });
      TestBed.configureTestingModule({
        declarations: [ExportPrivateKeyPage, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot(), ReactiveFormsModule, HttpClientTestingModule],
        providers: [
          { provide: ModalController, useValue: modalControllerSpy },
          { provide: NavController, useValue: navControllerSpy },
          { provide: ApiWalletService, useValue: apiWalletServiceSpy },
          { provide: WalletEncryptionService, useValue: walletEncryptionServiceSpy },
          { provide: ClipboardService, useValue: clipboardServiceSpy },
          { provide: ToastService, useValue: toastServiceSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(ExportPrivateKeyPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set password on enter', async () => {
    await component.ionViewDidEnter();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should set keys on form changes', async () => {
    await component.ionViewDidEnter();
    component.form.patchValue({ network: 'MATIC' });
    fixture.detectChanges();
    await fixture.whenStable();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
    expect(component.keys.address).toEqual('testAddress');
    expect(component.keys.privateKey).toEqual('testPrivateKey');
  });

  it('should redirect and not show error toast if password not set', async () => {
    fakeModalController.modifyReturns({}, { data: undefined });
    walletEncryptionServiceSpy.getDecryptedWalletForNetwork.and.returnValue(Promise.reject());
    await component.ionViewDidEnter();
    await fixture.whenStable();
    expect(navControllerSpy.navigateBack).toHaveBeenCalledTimes(1);
    expect(toastServiceSpy.showErrorToast).toHaveBeenCalledTimes(0);
  });

  it('should redirect and show error toast if password is incorrect', async () => {
    walletEncryptionServiceSpy.getDecryptedWalletForNetwork.and.returnValue(Promise.reject());
    await component.ionViewDidEnter();
    await fixture.whenStable();
    expect(navControllerSpy.navigateBack).toHaveBeenCalledTimes(1);
    expect(toastServiceSpy.showErrorToast).toHaveBeenCalledTimes(1);
  });

  it('should copy private key', async () => {
    await component.ionViewDidEnter();
    component.keys = { address: 'testAddress', privateKey: 'testPrivateKey' };
    fixture.detectChanges();
    await component.copyPrivateKey();
    expect(clipboardServiceSpy.write).toHaveBeenCalledOnceWith({ string: 'testPrivateKey' });
    expect(toastServiceSpy.showSuccessToast).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Export private key button clicked', () => {
    component.keys = { address: 'testAddress', privateKey: 'testPrivateKey' };
    fixture.detectChanges();
    spyOn(component, 'copyPrivateKey');
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'copy_private_key');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should clear password on leave', async () => {
    const spy = spyOn(component, 'clearPassword').and.callThrough();
    await component.ionViewDidEnter();
    component.ionViewWillLeave();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
