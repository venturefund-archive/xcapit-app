import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { AddressInputCardComponent } from './address-input-card.component';
import { By } from '@angular/platform-browser';
import { FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { ClipboardService } from '../../../../../shared/services/clipboard/clipboard.service';
import { ToastService } from '../../../../../shared/services/toast/toast.service';
import { TranslateModule } from '@ngx-translate/core';
import { UxInputUnderlinedComponent } from '../../../../../shared/components/ux-input-underlined/ux-input-underlined.component';
import { FakeModalController } from '../../../../../../testing/fakes/modal-controller.fake.spec';
import { PlatformService } from 'src/app/shared/services/platform/platform.service';

describe('AddressInputCardComponent', () => {
  let component: AddressInputCardComponent;
  let fixture: ComponentFixture<AddressInputCardComponent>;
  let clipboardServiceMock: any;
  let modalController: ModalController;
  let modalControllerSpy: any;
  let toastServiceMock: any;
  let toastService: ToastService;
  let controlContainerMock: FormGroup;
  let formGroupDirectiveMock: FormGroupDirective;
  let fakeModalController: FakeModalController;
  let platformServiceSpy: any;

  beforeEach(() => {
    fakeModalController = new FakeModalController();
    modalControllerSpy = fakeModalController.createSpy();

    platformServiceSpy = jasmine.createSpyObj('PlatformService', ['isWeb']);
    platformServiceSpy.isWeb.and.returnValue(false);
    controlContainerMock = new FormGroup({
      address: new FormControl(''),
    });
    formGroupDirectiveMock = new FormGroupDirective([], []);
    formGroupDirectiveMock.form = controlContainerMock;
    clipboardServiceMock = {
      read: () => Promise.resolve({ value: 'test', type: 'text/plain' }),
    };
    toastServiceMock = {
      showToast: () => Promise.resolve(),
    };
    TestBed.configureTestingModule({
      declarations: [AddressInputCardComponent, UxInputUnderlinedComponent],
      imports: [IonicModule, ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [
        { provide: ClipboardService, useValue: clipboardServiceMock },
        { provide: ToastService, useValue: toastServiceMock },
        { provide: ModalController, useValue: modalControllerSpy },
        { provide: FormGroupDirective, useValue: formGroupDirectiveMock },
        { provide: PlatformService, useValue: platformServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AddressInputCardComponent);
    component = fixture.componentInstance;
    component.title = 'Test title';
    component.helpText = 'Test help text';
    fixture.detectChanges();
    modalController = TestBed.inject(ModalController);
    toastService = TestBed.inject(ToastService);
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

  it('should render qr code depending of isPWA', () => {
    let scanQrEl = fixture.debugElement.query(By.css('ion-button[name="Scan QR"]'));
    expect(scanQrEl).toBeTruthy();
    component.isPWA = true;
    fixture.detectChanges();
    scanQrEl = fixture.debugElement.query(By.css('ion-button[name="Scan QR"]'));
    expect(scanQrEl).toBeNull();
  });

  it('should paste test when paste button is clicked and type is text/plain', async () => {
    const pasteButtonEl = fixture.debugElement.query(By.css('ion-button[name="Paste Address"]'));
    pasteButtonEl.nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.form.value.address).toBe('test');
  });

  it('should not paste test when paste button is clicked and type is not text/plain', async () => {
    clipboardServiceMock.read = () => Promise.resolve({ type: 'other', value: 'test' });
    const pasteButton = fixture.debugElement.query(By.css('ion-button[name="Paste Address"]'));
    pasteButton.nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.form.value.address).toBe('');
  });

  it('should render address on qr code scanned success', async () => {
    fakeModalController.modifyReturns(
      {},
      {
        data: 'testAddress',
        role: 'success',
      }
    );
    fixture.debugElement.query(By.css('ion-button[name="Scan QR"]')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.form.value.address).toBe('testAddress');
  });

  it('should not render address and show toast on qr code scanned error', async () => {
    const spy = spyOn(toastService, 'showToast').and.callThrough();
    fakeModalController.modifyReturns({}, { data: 'errorData', role: 'error' });
    fixture.debugElement.query(By.css('ion-button[name="Scan QR"]')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.form.value.address).toBe('');
    expect(spy).toHaveBeenCalledWith({ message: 'wallets.shared_wallets.address_input_card.scan_error' });
  });

  it('should not render address and show toast on qr code scanned unauthorized', async () => {
    const spy = spyOn(toastService, 'showToast').and.callThrough();
    fakeModalController.modifyReturns(
      {},
      {
        data: 'unauthorizedData',
        role: 'unauthorized',
      }
    );
    fixture.debugElement.query(By.css('ion-button[name="Scan QR"]')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.form.value.address).toBe('');
    expect(spy).toHaveBeenCalledWith({ message: 'wallets.shared_wallets.address_input_card.scan_unauthorized' });
  });
});
