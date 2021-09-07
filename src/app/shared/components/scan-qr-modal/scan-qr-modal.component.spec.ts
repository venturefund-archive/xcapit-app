import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { ScanQrModalComponent } from './scan-qr-modal.component';
import { Renderer2, Type } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FakeModalController } from '../../../../testing/fakes/modal-controller.fake.spec';

fdescribe('ScanQrModalComponent', () => {
  let component: ScanQrModalComponent;
  let fixture: ComponentFixture<ScanQrModalComponent>;
  let barcodeScannerMock: any;
  let renderer2: Renderer2;
  let addClassSpy: any;
  let removeClassSpy: any;
  let fakeModalController: FakeModalController;
  let modalControllerSpy;
  beforeEach(() => {
    fakeModalController = new FakeModalController();
    modalControllerSpy = fakeModalController.createSpy();
    barcodeScannerMock = {
      hideBackground: () => Promise.resolve(),
      showBackground: () => Promise.resolve(),
      startScan: () => Promise.resolve(),
      checkPermission: () => Promise.resolve({ granted: true }),
    };
    TestBed.configureTestingModule({
      declarations: [ScanQrModalComponent],
      imports: [IonicModule],
      providers: [Renderer2, { provide: ModalController, useValue: modalControllerSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(ScanQrModalComponent);
    component = fixture.componentInstance;
    renderer2 = fixture.componentRef.injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
    addClassSpy = spyOn(renderer2, 'addClass');
    removeClassSpy = spyOn(renderer2, 'removeClass');
    component.barcodeScanner = barcodeScannerMock;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set scan on init and success scan', async () => {
    const spy = spyOn(component.barcodeScanner, 'startScan');
    spy.and.returnValue(Promise.resolve({ hasContent: true, content: 'test' }));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledOnceWith('test', 'success');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(addClassSpy).toHaveBeenCalledTimes(2);
    expect(removeClassSpy).toHaveBeenCalledTimes(2);
  });

  it('should set scan on init and error scan', async () => {
    const spy = spyOn(component.barcodeScanner, 'startScan');
    spy.and.returnValue(Promise.resolve({ hasContent: false }));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(modalControllerSpy.dismiss).toHaveBeenCalledOnceWith(undefined, 'error');
    expect(addClassSpy).toHaveBeenCalledTimes(2);
    expect(removeClassSpy).toHaveBeenCalledTimes(2);
  });

  it('should dismiss on unauthorized', async () => {
    const spy = spyOn(component.barcodeScanner, 'checkPermission');
    spy.and.returnValue(Promise.resolve({ granted: false }));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(modalControllerSpy.dismiss).toHaveBeenCalledWith(null, 'unauthorized');
  });

  it('should dismiss on close', async () => {
    fixture.debugElement.query(By.css('ion-button[name="Cancel"]')).nativeElement.click();
    await fixture.whenStable();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledWith(null, 'cancelled');
  });
});
