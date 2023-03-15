import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { WarrantiesService } from '../shared-warranties/services/warranties.service';
import { WithdrawWarrantyPage } from './withdraw-warranty.page';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';

const validFormData = {
  dni: '12345678',
};
const invalidFormData = {
  dni: '333',
};

describe('WithdrawWarrantyPage', () => {
  let component: WithdrawWarrantyPage;
  let fixture: ComponentFixture<WithdrawWarrantyPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<WithdrawWarrantyPage>;
  let warrantiesServiceSpy: jasmine.SpyObj<WarrantiesService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;

  beforeEach(waitForAsync(() => {
    warrantiesServiceSpy = jasmine.createSpyObj('WarrantiesService', {
      verifyWarranty: of({ amount: 20 }),
    });
    toastServiceSpy = jasmine.createSpyObj('ToastService', {
      showErrorToast: Promise.resolve(),
    });

    TestBed.configureTestingModule({
      declarations: [WithdrawWarrantyPage, FakeTrackClickDirective],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot(), ReactiveFormsModule],
      providers: [
        { provide: WarrantiesService, useValue: warrantiesServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WithdrawWarrantyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should enable Continue button if form is valid', () => {
    component.form.patchValue(validFormData);
    fixture.detectChanges();
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="ux_warranty_withdraw_DNI"]'));

    expect(buttonEl.properties.disabled).toBeFalse();
  });

  it('should disable Continue button if form is invalid', () => {
    component.form.patchValue(invalidFormData);
    fixture.detectChanges();
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="ux_warranty_withdraw_DNI"]'));

    expect(buttonEl.properties.disabled).toBeTrue();
  });

  it('should get warranty balance on valid dni', async () => {
    component.form.patchValue(validFormData);
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="ux_warranty_withdraw_DNI"]'));
    buttonEl.nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(warrantiesServiceSpy.verifyWarranty).toHaveBeenCalledWith({ user_dni: '12345678' });
    expect(component.warrantyBalance.amount).toEqual(20);
  });

  it('should show error toast if valid dni has no balance', async () => {
    warrantiesServiceSpy.verifyWarranty.and.returnValue(of({ amount: 0 }));
    component.form.patchValue(validFormData);
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="ux_warranty_withdraw_DNI"]'));
    buttonEl.nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(warrantiesServiceSpy.verifyWarranty).toHaveBeenCalledWith({ user_dni: '12345678' });
    expect(component.warrantyBalance.amount).toEqual(0);
    expect(toastServiceSpy.showErrorToast).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService ux_warranty_withdraw_DNI Button clicked', () => {
    spyOn(component, 'submitForm');
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_warranty_withdraw_DNI');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
