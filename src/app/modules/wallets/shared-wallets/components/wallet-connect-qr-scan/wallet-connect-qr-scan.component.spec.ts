import { async, ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { barcodeScannerMock } from 'src/testing/spies/barcode-scanner-mock.spec';

import { WalletConnectQrScanComponent } from './wallet-connect-qr-scan.component';

describe('WalletConnectQrScanComponent', () => {
  let component: WalletConnectQrScanComponent;
  let fixture: ComponentFixture<WalletConnectQrScanComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [WalletConnectQrScanComponent],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletConnectQrScanComponent);
    component = fixture.componentInstance;
    component.barcodeScanner = barcodeScannerMock;
    barcodeScannerMock.result.hasContent = true;
    barcodeScannerMock.permission.granted = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
