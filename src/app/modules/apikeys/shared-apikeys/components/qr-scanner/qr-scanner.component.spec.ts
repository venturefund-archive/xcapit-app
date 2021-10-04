import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { barcodeScannerMock } from 'src/testing/spies/barcode-scanner-mock.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { QrScannerComponent } from './qr-scanner.component';
import { FakeTrackClickDirective } from '../../../../../../testing/fakes/track-click-directive.fake.spec';

const QRData = {
  valid: '{"apiKey":"kLnBhJuI98745Df32CsX09kN","secretKey":"EvHElKo98JyDeHVfJdSwC45J657Ml4","comment":"myapikey"}',
  formInvalid:
    '{"apiKey":"kLnBhJuI98745Df32CsX09kN","secretKey":"EvHElKo98JyDeHVfJdSwC45J657Ml4","comment":"My Binance API key"}',
  unparseableString: 'Some random string',
  invalidJson: '{}',
};

describe('QrScannerComponent', () => {
  let component: QrScannerComponent;
  let fixture: ComponentFixture<QrScannerComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<QrScannerComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [QrScannerComponent, FakeTrackClickDirective],
        imports: [
          RouterTestingModule.withRoutes([{ path: 'apikeys/register', component: DummyComponent }]),
          TranslateModule.forRoot(),
          HttpClientTestingModule,
          IonicModule,
        ],
        providers: [],

        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(QrScannerComponent);
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

  it('should format the result correctly for the form on formatQRResult', () => {
    component.formatQRResult(QRData.valid);
    const result = component.scannedApikeys;
    expect(Object.keys(result)).toContain('alias');
    expect(Object.keys(result)).toContain('api_key');
    expect(Object.keys(result)).toContain('secret_key');
  });

  it('should call apikeyScannedSuccessfullyEvent on readQRCode and valid QR data', async () => {
    barcodeScannerMock.result.content = QRData.valid;
    const spy = spyOn(component, 'apikeyScannedSuccessfullyEvent');
    await component.readQRCode();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call apikeyScannedSuccessfullyEvent on readQRCode and formInvalid QR data', async () => {
    barcodeScannerMock.result.content = QRData.formInvalid;
    const spy = spyOn(component, 'apikeyScannedSuccessfullyEvent');
    await component.readQRCode();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should not call apikeyScannedSuccessfullyEvent on readQRCode and invalid QR data', async () => {
    barcodeScannerMock.result.content = QRData.invalidJson;
    const spy = spyOn(component, 'apikeyScannedSuccessfullyEvent');
    await component.readQRCode();
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should call errorInvalidQREvent on readQRCode and invalid QR data', async () => {
    barcodeScannerMock.result.content = QRData.invalidJson;
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

  it('should not call apikeyScannedSuccessfullyEvent on readQRCode  and false hasContent', async () => {
    barcodeScannerMock.result.hasContent = false;
    const spy = spyOn(component, 'apikeyScannedSuccessfullyEvent');
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
    const spy = spyOn(component, 'apikeyScannedSuccessfullyEvent');
    await component.readQRCode();
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should return true on isValidQR when valid data is scanned', () => {
    const returnValue = component.isValidQR(QRData.valid);
    expect(returnValue).toBeTrue();
  });

  it('should return true on isValidQR when formInvalid data is scanned', () => {
    const returnValue = component.isValidQR(QRData.formInvalid);
    expect(returnValue).toBeTrue();
  });

  it('should return false on isValidQR when string is not a parseable', () => {
    const returnValue = component.isValidQR(QRData.unparseableString);
    expect(returnValue).toBeFalse();
  });

  it('should return false on isValidQR when scanned JSON does not contain the correct keys', () => {
    const returnValue = component.isValidQR(QRData.invalidJson);
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

  it('should emit event on stop scan', () => {
    const spy = spyOn(component.stoppedScan, 'emit');
    component.stopQRScan();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
