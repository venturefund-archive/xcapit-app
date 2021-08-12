import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ReceivePage } from './receive.page';
import { QRCodeService } from '../../../shared/services/qr-code/qr-code.service';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ClipboardService } from '../../../shared/services/clipboard/clipboard.service';
import { clipboard } from 'ionicons/icons';
import { ShareService } from '../../../shared/services/share/share.service';
import { ToastService } from '../../../shared/services/toast/toast.service';

fdescribe('ReceivePage', () => {
  let component: ReceivePage;
  let fixture: ComponentFixture<ReceivePage>;
  let qrCodeServiceMock;
  let qrCodeService: QRCodeService;
  let clipboardServiceMock;
  let clipboardService: ClipboardService;
  let shareServiceMock;
  let shareService: ShareService;
  let toastServiceMock;
  let toastService: ToastService;
  beforeEach(
    waitForAsync(() => {
      qrCodeServiceMock = {
        generateQRFromText: () => Promise.resolve('test_qr'),
      };
      clipboardServiceMock = {
        write: () => Promise.resolve(),
      };
      shareServiceMock = {
        share: () => Promise.resolve(),
      };
      toastServiceMock = {
        showToast: () => Promise.resolve(),
      };
      TestBed.configureTestingModule({
        declarations: [ReceivePage],
        imports: [IonicModule, ReactiveFormsModule, RouterTestingModule.withRoutes([]), TranslateModule.forRoot()],
        providers: [
          { provide: QRCodeService, useValue: qrCodeServiceMock },
          { provide: ClipboardService, useValue: clipboardServiceMock },
          { provide: ShareService, useValue: shareServiceMock },
          { provide: ToastService, useValue: toastServiceMock },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(ReceivePage);
      component = fixture.componentInstance;
      component.address = 'test_address';
      fixture.detectChanges();
      qrCodeService = TestBed.inject(QRCodeService);
      clipboardService = TestBed.inject(ClipboardService);
      shareService = TestBed.inject(ShareService);
      toastService = TestBed.inject(ToastService);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate QR with address on enter page', async () => {
    const spy = spyOn(qrCodeService, 'generateQRFromText').and.callThrough();

    await component.ionViewWillEnter();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('test_address');
    expect(component.addressQr).toBeTruthy();
    expect(fixture.debugElement.query(By.css('#qr-img')));
  });

  it('should copy address when click in copy button', async () => {
    const spyToast = spyOn(toastService, 'showToast').and.callThrough();
    const spy = spyOn(clipboardService, 'write').and.callThrough();
    const button = fixture.debugElement.query(By.css('#copy-address-button'));
    await button.nativeElement.click();
    expect(spyToast).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ string: 'test_address' });
  });

  it('should share address when click in share button', () => {
    const spy = spyOn(shareService, 'share').and.callThrough();
    const button = fixture.debugElement.query(By.css('#share-address-button'));
    button.nativeElement.click();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(
      {
        title: 'Direccion de wallet',
        dialogTitle: 'Direccion de wallet',
        text: 'test_address',
      },
      'Error al compartir'
    );
  });
});
