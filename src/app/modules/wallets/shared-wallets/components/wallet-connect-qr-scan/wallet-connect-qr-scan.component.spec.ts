import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { barcodeScannerMock } from 'src/testing/spies/barcode-scanner-mock.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { WalletConnectQrScanComponent } from './wallet-connect-qr-scan.component';
import { FakeTrackClickDirective } from '../../../../../../testing/fakes/track-click-directive.fake.spec';
import { ToastService } from '../../../../../shared/services/toast/toast.service';
import { modalControllerMock } from '../../../../../../testing/spies/modal-controller-mock.spec';

const QRData = {
  valid: 'wc:4083bd7b-1413-4ed3-83e1-dce6e180913b@1?bridge=https%3A%2F%2Fk.bridge.walletconnect.org&key=33670d2d62a39df6659dfdb37591c5f039dad28e4429e3f0f2921bc62f50dbc9',
  invalid: '4083bd7b-1413-4ed3-83e1-dce6e180913b@1?https=https%3A%2F%2Fk.path.walletconnect.org&key=33670d2d62a39df6659dfdb37591c5f039dad28e4429e3f0f2921bc62f50dbc9'
}

describe('WalletConnectQrScanComponent', () => {
  let component: WalletConnectQrScanComponent;
  let fixture: ComponentFixture<WalletConnectQrScanComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<WalletConnectQrScanComponent>;
  let toastServiceSpy: any;
  let modalControllerSpy;
  beforeEach(
    waitForAsync(() => {
      toastServiceSpy = jasmine.createSpyObj('ToastService', ['showToast']);
      modalControllerSpy = jasmine.createSpyObj('ModalController', modalControllerMock);
      TestBed.configureTestingModule({
        declarations: [WalletConnectQrScanComponent, FakeTrackClickDirective],
        imports: [
          RouterTestingModule.withRoutes([{ path: 'wallets/wallet-connect/new-connection', component: DummyComponent }]),
          HttpClientTestingModule,
          IonicModule, 
          TranslateModule.forRoot()],
        providers: [
          { provide: ToastService, useValue: toastServiceSpy },
          { provide: ModalController, useValue: modalControllerSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletConnectQrScanComponent);
    component = fixture.componentInstance;
    component.barcodeScanner = barcodeScannerMock;
    barcodeScannerMock.result.hasContent = true;
    barcodeScannerMock.permission.granted = true;
    const readQRCodeSpy = spyOn(component, 'readQRCode');
    readQRCodeSpy.and.returnValue(Promise.resolve());
    fixture.detectChanges();
    readQRCodeSpy.and.callThrough();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('checkPermission should return false if access to camera was denied', async () => {
    barcodeScannerMock.permission.granted = false;
    const result = await component.checkPermission();
    expect(result).toBeFalse();
  });

  it('should call hideBackground on hideBackground', () => {
    const spy = spyOn(component.barcodeScanner, 'hideBackground');
    component.hideBackground();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call startScan on scanQR', async () => {
    const spy = spyOn(component.barcodeScanner, 'startScan');
    await component.scanQR();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call stopScan on stopQRScan', async () => {
    const spy = spyOn(component.barcodeScanner, 'stopScan');
    await component.stopQRScan();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call checkPermission on checkPermission', async () => {
    const spy = spyOn(component.barcodeScanner, 'checkPermission').and.returnValue(
      Promise.resolve(barcodeScannerMock.permission)
    );
    await component.checkPermission();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call qrScannedSuccessfullyEvent on readQRCode and valid QR data', async () => {
    barcodeScannerMock.result.content = QRData.valid;
    const spy = spyOn(component, 'qrScannedSuccessfullyEvent');
    await component.readQRCode();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call errorInvalidQREvent on readQRCode and invalid QR data', async () => {
    barcodeScannerMock.result.content = QRData.invalid;
    const spy = spyOn(component, 'errorInvalidQREvent');
    await component.readQRCode();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call errorNoContentQREvent on readQRCode and false hasContent', async () => {
    barcodeScannerMock.result.hasContent = false;
    const spy = spyOn(component, 'errorNoContentQREvent');
    await component.readQRCode();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should not call qrScannedSuccessfullyEvent on readQRCode and false hasContent', async () => {
    barcodeScannerMock.result.hasContent = false;
    const spy = spyOn(component, 'qrScannedSuccessfullyEvent');
    await component.readQRCode();
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should call errorCameraAccessDeniedEvent on readQRCode if access to camera was denied', async () => {
    barcodeScannerMock.permission.granted = false;
    const spy = spyOn(component, 'errorCameraAccessDeniedEvent');
    await component.readQRCode();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should not call apikeyScannedSuccessfullyEvent on readQRCode if access to camera was denied', async () => {
    barcodeScannerMock.permission.granted = false;
    const spy = spyOn(component, 'qrScannedSuccessfullyEvent');
    await component.readQRCode();
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should return true on isValidQR when valid data is scanned', () => {
    const returnValue = component.isValidQR(QRData.valid);
    expect(returnValue).toBeTrue();
  });

  it('should return true on isValidQR when invalid data is scanned', () => {
    const returnValue = component.isValidQR(QRData.invalid);
    expect(returnValue).toBeFalse();
  });

  it('should call trackEvent on trackService when Cancel Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Cancel');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should stop scan when click on stopQRScan', () => {
    const spy = spyOn(component.barcodeScanner, 'stopScan');
    component.stopQRScan();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call modal dismiss on qrScannedSuccessfullyEvent', () => {
    component.scannedQR = QRData.valid;
    component.qrScannedSuccessfullyEvent();
    fixture.detectChanges();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
  });

  it('should call stopQRScan on close when scanningQR is true', () => {
    const spy = spyOn(component, 'stopQRScan');
    component.scanningQR = true;
    fixture.detectChanges();
    component.close();
    expect(spy).toHaveBeenCalledTimes(1);
  })
});
