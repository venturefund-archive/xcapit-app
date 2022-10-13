import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LoginBiometricActivationModalComponent } from './login-biometric-activation-modal.component';

describe('LoginBiometricActivationModalComponent', () => {
  let component: LoginBiometricActivationModalComponent;
  let fixture: ComponentFixture<LoginBiometricActivationModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginBiometricActivationModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginBiometricActivationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
