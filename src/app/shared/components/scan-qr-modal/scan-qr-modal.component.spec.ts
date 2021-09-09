import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { IonicModule, ModalController, Platform } from '@ionic/angular';
import { ScanQrModalComponent } from './scan-qr-modal.component';
import { Renderer2, Type } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FakeModalController } from '../../../../testing/fakes/modal-controller.fake.spec';
import { Subject } from 'rxjs';

describe('ScanQrModalComponent', () => {
  let component: ScanQrModalComponent;
  let fixture: ComponentFixture<ScanQrModalComponent>;
  let barcodeScannerSpy: jasmine.SpyObj<any>;
  let renderer2: Renderer2;
  let addClassSpy: any;
  let removeClassSpy: any;
  let fakeModalController: FakeModalController;
  let modalControllerSpy;
  let platformMock: any;
  beforeEach(() => {
    platformMock = {
      backButton: new Subject(),
    };
    fakeModalController = new FakeModalController();
    modalControllerSpy = fakeModalController.createSpy();
    barcodeScannerSpy = jasmine.createSpyObj('BarcodeScanner', {
      hideBackground: Promise.resolve(),
      showBackground: Promise.resolve(),
      startScan: Promise.resolve(),
      stopScan: Promise.resolve(),
      checkPermission: Promise.resolve({ granted: true }),
    });
    TestBed.configureTestingModule({
      declarations: [ScanQrModalComponent],
      imports: [IonicModule],
      providers: [
        Renderer2,
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: Platform, useValue: platformMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ScanQrModalComponent);
    component = fixture.componentInstance;
    renderer2 = fixture.componentRef.injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
    addClassSpy = spyOn(renderer2, 'addClass');
    removeClassSpy = spyOn(renderer2, 'removeClass');
    component.barcodeScanner = barcodeScannerSpy;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set scan on init and success scan', async () => {
    barcodeScannerSpy.startScan.and.returnValue(Promise.resolve({ hasContent: true, content: 'test' }));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledOnceWith('test', 'success');
    expect(barcodeScannerSpy.startScan).toHaveBeenCalledTimes(1);
    expect(addClassSpy).toHaveBeenCalledTimes(2);
    expect(removeClassSpy).toHaveBeenCalledTimes(2);
  });

  it('should set scan on init and error scan', async () => {
    barcodeScannerSpy.startScan.and.returnValue(Promise.resolve({ hasContent: false }));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(barcodeScannerSpy.startScan).toHaveBeenCalledTimes(1);
    expect(modalControllerSpy.dismiss).toHaveBeenCalledOnceWith(undefined, 'error');
    expect(addClassSpy).toHaveBeenCalledTimes(2);
    expect(removeClassSpy).toHaveBeenCalledTimes(2);
  });

  it('should dismiss on unauthorized', async () => {
    barcodeScannerSpy.checkPermission.and.returnValue(Promise.resolve({ granted: false }));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(barcodeScannerSpy.checkPermission).toHaveBeenCalledTimes(1);
    expect(modalControllerSpy.dismiss).toHaveBeenCalledWith(null, 'unauthorized');
  });

  it('should dismiss on close', async () => {
    fixture.debugElement.query(By.css('ion-button[name="Cancel"]')).nativeElement.click();
    await fixture.whenStable();
    expect(barcodeScannerSpy.stopScan).toHaveBeenCalledTimes(1);
    expect(modalControllerSpy.dismiss).toHaveBeenCalledWith(null, 'cancelled');
  });

  it('should dismiss when back button is pressed', fakeAsync(() => {
    platformMock.backButton.next();
    tick(350);
    expect(barcodeScannerSpy.stopScan).toHaveBeenCalledTimes(1);
    expect(modalControllerSpy.dismiss).toHaveBeenCalledWith(null, 'cancelled');
  }));
});
