import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AlertController, IonicModule, ModalController } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { UrlSerializer } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { WalletEncryptionService } from '../../../shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { WalletService } from '../../../../wallets/shared-wallets/services/wallet/wallet.service';
import { BlockchainProviderService } from '../../services/blockchain-provider/blockchain-provider.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirectiveTestHelper } from '../../../../../../testing/track-click-directive-test.spec';
import { By } from '@angular/platform-browser';
import { FakeModalController } from '../../../../../../testing/fakes/modal-controller.fake.spec';
import { FakeTrackClickDirective } from '../../../../../../testing/fakes/track-click-directive.fake.spec';
import { FakeConnectedWallet } from '../../../../../../testing/fakes/wallet.fake.spec';
import { WalletConnectSignRequestComponent } from './wallet-connect-sign-request.component';
import { WalletConnectService } from '../../services/wallet-connect/wallet-connect.service';
import { EthersService } from '../../services/ethers/ethers.service';
import { FakeEthersService } from '../../../../../../testing/fakes/ethers.fake.spec';
import { alertControllerMock } from '../../../../../../testing/spies/alert-controller-mock.spec';

describe('WalletConnectSignRequestComponent', () => {
  let component: WalletConnectSignRequestComponent;
  let fixture: ComponentFixture<WalletConnectSignRequestComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<WalletConnectSignRequestComponent>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;
  let alertControllerSpy: jasmine.SpyObj<AlertController>;
  let walletEncryptionServiceSpy: jasmine.SpyObj<WalletEncryptionService> = null;
  const walletServiceSpy: jasmine.SpyObj<WalletService> = null;
  const blockchainProviderServiceMock = null;
  let connectedWalletSpy;
  let fakeConnectedWallet: FakeConnectedWallet;
  let walletConnectServiceSpy: any;
  let ethersServiceSpy: any;
  let fakeEthersService: FakeEthersService;

  beforeEach(
    waitForAsync(() => {
      fakeEthersService = new FakeEthersService();
      ethersServiceSpy = fakeEthersService.createSpy();

      fakeConnectedWallet = new FakeConnectedWallet();
      connectedWalletSpy = fakeConnectedWallet.createSpy();

      fakeModalController = new FakeModalController();
      modalControllerSpy = fakeModalController.createSpy();

      alertControllerSpy = jasmine.createSpyObj('AlertController', alertControllerMock);

      walletEncryptionServiceSpy = jasmine.createSpyObj('WalletEncryptionService', {
        getDecryptedWalletForNetwork: Promise.resolve(
          jasmine.createSpyObj('Wallet', { connect: () => connectedWalletSpy })
        ),
      });

      walletConnectServiceSpy = jasmine.createSpyObj('WalletConnectService', {
        network: 'ETH',
        rpcUrl: 'https://rpc_test.com/',
        requestInfo: {},
        checkRequest: Promise.resolve({ error: false }),
      });

      TestBed.configureTestingModule({
        declarations: [WalletConnectSignRequestComponent, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), ReactiveFormsModule, HttpClientTestingModule, TranslateModule.forRoot()],
        providers: [
          UrlSerializer,
          { provide: WalletEncryptionService, useValue: walletEncryptionServiceSpy },
          { provide: WalletService, useValue: walletServiceSpy },
          { provide: BlockchainProviderService, useValue: blockchainProviderServiceMock },
          { provide: EthersService, useValue: ethersServiceSpy },
          { provide: ModalController, useValue: modalControllerSpy },
          { provide: WalletConnectService, useValue: walletConnectServiceSpy },
          { provide: AlertController, useValue: alertControllerSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(WalletConnectSignRequestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the modal when checkRequest returns success', async () => {
    component.form.patchValue({ password: 'testPassword' });
    await component.handleSubmit();
    await fixture.whenStable();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
  });

  it('should call showAlertTxError when checkRequest returns an error', async () => {
    walletConnectServiceSpy.checkRequest.and.returnValues({ error: true });
    fixture.detectChanges();
    component.form.patchValue({ password: 'testPassword' });
    await component.handleSubmit();
    await fixture.whenStable();
    expect(modalControllerSpy.dismiss).not.toHaveBeenCalled();
    expect(alertControllerSpy.create).toHaveBeenCalled();
  });

  it('should dismiss the modal when is pressed accept button on showAlertTxError', async () => {
    walletConnectServiceSpy.checkRequest.and.returnValues({ error: true });
    fixture.detectChanges();
    component.form.patchValue({ password: 'testPassword' });
    await component.handleSubmit();
    await fixture.whenStable();
    const button: any = alertControllerSpy.create.calls.first().args[0].buttons[0];
    await button.handler();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
  });

  it('should call showAlert when user password is incorrect', async () => {
    walletEncryptionServiceSpy.getDecryptedWalletForNetwork.and.rejectWith(new Error('invalid password'));
    component.form.patchValue({ password: 'testPassword' });
    await component.handleSubmit();
    await fixture.whenStable();
    expect(modalControllerSpy.dismiss).not.toHaveBeenCalled();
    expect(alertControllerSpy.create).toHaveBeenCalled();
  });

  it('should call trackEvent on trackService when Close Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Close');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should close modal when close button is clicked', async () => {
    fixture.debugElement.query(By.css("ion-button[name='Close']")).nativeElement.click();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
  });
});
