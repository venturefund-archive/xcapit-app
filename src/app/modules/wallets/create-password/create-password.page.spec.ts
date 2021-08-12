import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { navControllerMock } from 'src/testing/spies/nav-controller-mock.spec';
import { CreatePasswordPage } from './create-password.page';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { UrlSerializer } from '@angular/router';
import { WalletEncryptionService } from '../shared-wallets/services/wallet-encryption/wallet-encryption.service';

describe('CreatePasswordPage', () => {
  let component: CreatePasswordPage;
  let fixture: ComponentFixture<CreatePasswordPage>;
  let walletEncryptionServiceMock;
  let navController: NavController;

  const formData = {
    valid: {
      password: 'Test123',
      repeat_password: 'Test123',
    },
    invalid: {
      password: 'Test123',
      repeat_password: 'Test111',
    },
  };

  beforeEach(() => {
    walletEncryptionServiceMock = {
      encryptWallet: (password) => true,
    };

    TestBed.configureTestingModule({
      declarations: [CreatePasswordPage],
      imports: [IonicModule.forRoot(), ReactiveFormsModule, IonicModule, TranslateModule.forRoot()],
      providers: [
        UrlSerializer,
        { provide: WalletEncryptionService, useValue: walletEncryptionServiceMock },
        { provide: NavController, useValue: navControllerMock },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    navController = TestBed.inject(NavController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call handleSubmit on submit event, valid form', () => {
    component.createPasswordForm.patchValue(formData.valid);
    const spy = spyOn(component, 'handleSubmit');
    fixture.detectChanges();
    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call encryptWallet on encrypt, valid form', async () => {
    component.createPasswordForm.patchValue(formData.valid);
    fixture.detectChanges();
    const spy = await spyOn(walletEncryptionServiceMock, 'encryptWallet').and.returnValue(Promise.resolve(true));
    component.handleSubmit();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should not call encryptWallet on encrypt, no valid form', () => {
    const spy = spyOn(walletEncryptionServiceMock, 'encryptWallet').and.returnValue(Promise.resolve(true));
    component.createPasswordForm.patchValue(formData.invalid);
    fixture.detectChanges();
    component.handleSubmit();
    expect(spy).toHaveBeenCalledTimes(0);
  });
});
