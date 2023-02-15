import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { UxInputComponent } from './ux-input.component';
import { UntypedFormControl, UntypedFormGroup, FormGroupDirective } from '@angular/forms';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { ClipboardService } from '../../services/clipboard/clipboard.service';
import { ToastService } from '../../services/toast/toast.service';
import { By } from '@angular/platform-browser';
import { CustomValidatorErrors } from '../../validators/custom-validator-errors';

describe('UxInputComponent', () => {
  let component: UxInputComponent;
  let fixture: ComponentFixture<UxInputComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<UxInputComponent>;
  let clipboardServiceSpy: any;
  let toastServiceSpy: any;
  let formGroupDirectiveMock: any;
  let controlContainerMock: any;
  beforeEach(waitForAsync(() => {
    toastServiceSpy = jasmine.createSpyObj('ToastService', { showInfoToast: Promise.resolve() });
    clipboardServiceSpy = jasmine.createSpyObj('ClipboardService', {
      write: Promise.resolve(),
      read: Promise.resolve({ value: 'test', type: 'text/plain' }),
    });
    controlContainerMock = new UntypedFormGroup({
      testControl: new UntypedFormControl(),
    });
    formGroupDirectiveMock = new FormGroupDirective([], []);
    formGroupDirectiveMock.form = controlContainerMock;
    TestBed.configureTestingModule({
      declarations: [UxInputComponent, FakeTrackClickDirective],
      imports: [TranslateModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: FormGroupDirective, useValue: formGroupDirectiveMock },
        { provide: ClipboardService, useValue: clipboardServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UxInputComponent);
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    component = fixture.componentInstance;
    component.controlName = 'testControl';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call write in ClipboardService when call copyToClipboard', async () => {
    clipboardServiceSpy.write.and.returnValue(of({}).toPromise());
    component.copyToClipboard();
    expect(clipboardServiceSpy.write).toHaveBeenCalledTimes(1);
  });

  it('should call write with dataInput when copyToClipboard is called', async () => {
    component.control.patchValue('test');
    const expectedArg = { url: 'test' };
    fixture.detectChanges();
    component.copyToClipboard();
    fixture.whenStable().then(() => {
      expect(clipboardServiceSpy.write).toHaveBeenCalledWith(expectedArg);
    });
  });

  it('should paste test when paste button is clicked and type is text/plain', async () => {
    const pasteButtonEl = fixture.debugElement.query(By.css('ion-button[name="Paste_Address"]'));
    pasteButtonEl.nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.control.value).toBe('test');
  });

  it('should not paste test when paste button is clicked and type is not text/plain', async () => {
    component.control.patchValue('');
    clipboardServiceSpy.read.and.resolveTo({ type: 'other', value: 'test' });
    const pasteButton = fixture.debugElement.query(By.css('ion-button[name="Paste_Address"]'));
    pasteButton.nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.control.value).toBe('');
  });

  it('should call showToast when copyToClipboard is called', async () => {
    fixture.detectChanges();
    component.copyToClipboard();
    await fixture.whenStable();
    expect(toastServiceSpy.showInfoToast).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Copy button is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Copy');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should disable Copy button when input is empty', () => {
    component.copyType = true;
    component.control.patchValue('');
    fixture.detectChanges();
    const nextButton = fixture.debugElement.query(By.css('ion-button[name="Copy"]'));
    expect(nextButton.properties.disabled).toBeTruthy();
  });

  it('should emit event on qr icon', async () => {
    component.disabled = false;
    component.qrScanner = true;
    component.native = true;
    const spy = spyOn(component.qrScannerOpened, 'emit');
    await fixture.whenRenderingDone();
    await fixture.whenStable();
    fixture.detectChanges();
    const qrEl = fixture.debugElement.query(By.css('ion-icon[name="qr-code-outline"]'));
    qrEl.nativeElement.click();
    expect(qrEl).toBeTruthy();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should show old style', () => {
    component.newStyle = false;
    component.control.setErrors(CustomValidatorErrors.walletIncorrectPassword);
    component.control.markAsTouched();
    fixture.detectChanges();
    const errorIconEl = fixture.debugElement.query(By.css('ion-icon.ux_input_container__item__error_icon'));
    const itemEl = fixture.debugElement.query(By.css('ion-item.error'));
    expect(errorIconEl).toBeTruthy();
    expect(itemEl).toBeFalsy();
  });
  
  it('should show new style', () => {
    component.newStyle = true;
    component.control.setErrors(CustomValidatorErrors.walletIncorrectPassword);
    component.control.markAsTouched();
    fixture.detectChanges();
    const errorIconEl = fixture.debugElement.query(By.css('ion-icon.ux_input_container__item__error_icon'));
    const itemEl = fixture.debugElement.query(By.css('ion-item.error'));
    expect(errorIconEl).toBeFalsy();
    expect(itemEl).toBeTruthy();
  });
});
