import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { LoginBiometricActivationModalService } from '../../services/login-biometric-activation-modal-service/login-biometric-activation-modal.service';

import { LoginBiometricActivationModalComponent } from './login-biometric-activation-modal.component';

describe('LoginBiometricActivationModalComponent', () => {
  let component: LoginBiometricActivationModalComponent;
  let fixture: ComponentFixture<LoginBiometricActivationModalComponent>;
  let loginBiometricActivationModalSpy: jasmine.SpyObj<LoginBiometricActivationModalService>;
  let fakeModalController: FakeModalController;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;

  beforeEach(waitForAsync(() => {
    loginBiometricActivationModalSpy = jasmine.createSpyObj('LoginBiometricActivationModalService', {
      disableModal: Promise.resolve(false)
    });
    fakeModalController = new FakeModalController();
    modalControllerSpy = fakeModalController.createSpy();

    TestBed.configureTestingModule({
      declarations: [LoginBiometricActivationModalComponent],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot(), ReactiveFormsModule],
      providers: [
        { provide: LoginBiometricActivationModalService, useValue: loginBiometricActivationModalSpy },
        { provide: ModalController, useValue: modalControllerSpy }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginBiometricActivationModalComponent);
    component = fixture.componentInstance;
    component.form.patchValue({ dontShowModalCheckbox: false });
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return confirm on biometric activation and remember that user checked do not show this again when Confirm button is clicked', async () => {
    component.form.patchValue({ dontShowModalCheckbox: true });
    fixture.debugElement.query(By.css('ion-button[name="Confirm"]')).nativeElement.click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(modalControllerSpy.dismiss).toHaveBeenCalledOnceWith('confirm');
    expect(loginBiometricActivationModalSpy.disableModal).toHaveBeenCalledTimes(1);
  });

  it('should return cancel on biometric activation when Cancel button is clicked', async () => {
    fixture.debugElement.query(By.css('ion-button[name="Cancel"]')).nativeElement.click();
    await fixture.whenStable();
    fixture.detectChanges();
    
    expect(modalControllerSpy.dismiss).toHaveBeenCalledOnceWith('cancel');
    expect(loginBiometricActivationModalSpy.disableModal).not.toHaveBeenCalled();
  });
});
