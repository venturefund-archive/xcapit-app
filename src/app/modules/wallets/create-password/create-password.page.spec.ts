import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { CreatePasswordPage } from './create-password.page';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, UrlSerializer } from '@angular/router';
import { WalletEncryptionService } from '../shared-wallets/services/wallet-encryption/wallet-encryption.service';
import { LoadingService } from '../../../shared/services/loading/loading.service';
import { ApiWalletService } from '../shared-wallets/services/api-wallet/api-wallet.service';
import { of } from 'rxjs';
import { FakeNavController } from '../../../../testing/fakes/nav-controller.fake.spec';
import { FakeLoadingService } from '../../../../testing/fakes/loading.fake.spec';

fdescribe('CreatePasswordPage', () => {
  let component: CreatePasswordPage;
  let fixture: ComponentFixture<CreatePasswordPage>;
  let walletEncryptionServiceSpy: jasmine.SpyObj<WalletEncryptionService>;
  let activatedRouteMock: any;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;
  let fakeLoadingService: FakeLoadingService;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;

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
    fakeLoadingService = new FakeLoadingService();
    loadingServiceSpy = fakeLoadingService.createSpy();
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
      saveWalletAddresses: of({}),
    });
    walletEncryptionServiceSpy = jasmine.createSpyObj('WalletEncryptionService', {
      encryptWallet: Promise.resolve(true),
      getEncryptedWallet: Promise.resolve({ addresses: { ERC20: 'testERC20Address', RSK: 'testRSKAddress' } }),
    });
    activatedRouteMock = { snapshot: { paramMap: { get: () => 'import' } } };
    TestBed.configureTestingModule({
      declarations: [CreatePasswordPage],
      imports: [ReactiveFormsModule, IonicModule, TranslateModule.forRoot()],
      providers: [
        UrlSerializer,
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: WalletEncryptionService, useValue: walletEncryptionServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: ApiWalletService, useValue: apiWalletServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call handleSubmit on submit event, valid form', () => {
    component.createPasswordForm.patchValue(formData.valid);
    component.ionViewWillEnter();
    const spy = spyOn(component, 'handleSubmit');
    fixture.detectChanges();
    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call encryptWallet on encrypt, valid form', async () => {
    component.createPasswordForm.patchValue(formData.valid);
    fixture.detectChanges();
    component.handleSubmit();
    await fixture.whenStable();
    expect(walletEncryptionServiceSpy.encryptWallet).toHaveBeenCalledTimes(1);
  });

  it('should not call encryptWallet on encrypt, no valid form', async () => {
    component.createPasswordForm.patchValue(formData.invalid);
    fixture.detectChanges();
    component.handleSubmit();
    await fixture.whenStable();
    expect(walletEncryptionServiceSpy.encryptWallet).toHaveBeenCalledTimes(0);
  });

  it('should show import text when importing wallet', () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    const titleEl = fixture.debugElement.query(By.css('ion-title')).nativeElement;
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name = "ux_import_submit_wallet_password"]')).nativeElement;
    console.log(titleEl);
    console.log(buttonEl);
    expect(titleEl.innerText).toContain('wallets.recovery_wallet.header');
    expect(buttonEl.innerText).toContain('wallets.create_password.finish_button_import');
  })
});
