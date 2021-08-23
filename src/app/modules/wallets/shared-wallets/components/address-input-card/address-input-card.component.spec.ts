import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { AddressInputCardComponent } from './address-input-card.component';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { ClipboardService } from '../../../../../shared/services/clipboard/clipboard.service';
import { modalControllerMock } from '../../../../../../testing/spies/modal-controller-mock.spec';

describe('AddressInputCardComponent', () => {
  let component: AddressInputCardComponent;
  let fixture: ComponentFixture<AddressInputCardComponent>;
  let clipboardServiceMock: any;
  let modalController: ModalController;
  let modalControllerSpy: any;

  beforeEach(() => {
    clipboardServiceMock = {
      read: () => Promise.resolve({ value: 'test', type: 'text/plain' }),
    };
    modalControllerSpy = jasmine.createSpyObj('ModalController', modalControllerMock);
    TestBed.configureTestingModule({
      declarations: [AddressInputCardComponent],
      imports: [IonicModule, ReactiveFormsModule],
      providers: [
        { provide: ClipboardService, useValue: clipboardServiceMock },
        { provide: ModalController, useValue: modalControllerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddressInputCardComponent);
    component = fixture.componentInstance;
    component.title = 'Test title';
    component.helpText = 'Test help text';
    fixture.detectChanges();
    modalController = TestBed.inject(ModalController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render qr code depending of enableQR', () => {
    let scanQrEl = fixture.debugElement.query(By.css('ion-button[name="Scan QR"]'));
    expect(scanQrEl).toBeTruthy();
    component.enableQR = false;
    fixture.detectChanges();
    scanQrEl = fixture.debugElement.query(By.css('ion-button[name="Scan QR"]'));
    expect(scanQrEl).toBeNull();
  });

  it('should paste test when paste button is clicked and type is text/plain', async () => {
    const pasteButtonEl = fixture.debugElement.query(By.css('ion-button[name="Paste Address"]'));
    pasteButtonEl.nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    const inputEl = fixture.debugElement.query(By.css('#address-input'));
    expect(inputEl.nativeElement.value).toBe('test');
  });

  it('should not paste test when paste button is clicked and type is not text/plain', async () => {
    clipboardServiceMock.read = () => Promise.resolve({ type: 'other', value: 'test' });
    const pasteButton = fixture.debugElement.query(By.css('ion-button[name="Paste Address"]'));
    pasteButton.nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    const inputEl = fixture.debugElement.query(By.css('#address-input'));
    expect(inputEl.nativeElement.value).toBe('');
  });

  it('should render address on qr code scanned success', async () => {
    modalControllerSpy.create.and.returnValue(
      Promise.resolve({
        onDidDismiss: () =>
          Promise.resolve({
            data: 'testAddress',
            role: 'success',
          }),
        present: () => Promise.resolve(),
      })
    );
    fixture.debugElement.query(By.css('ion-button[name="Scan QR"]')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    const inputEl = fixture.debugElement.query(By.css('#address-input'));
    expect(inputEl.nativeElement.value).toBe('testAddress');
  });

  it('should not render address on qr code scanned error', async () => {
    modalControllerSpy.create.and.returnValue(
      Promise.resolve({
        onDidDismiss: () =>
          Promise.resolve({
            data: 'testAddress',
            role: 'error',
          }),
        present: () => Promise.resolve(),
      })
    );
    fixture.debugElement.query(By.css('ion-button[name="Scan QR"]')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    const inputEl = fixture.debugElement.query(By.css('#address-input'));
    expect(inputEl.nativeElement.value).toBe('');
  });
});
