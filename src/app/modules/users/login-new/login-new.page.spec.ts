import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { LoginNewPage } from './login-new.page';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('LoginNewPage', () => {
  const aPassword = 'aPassword';
  const aHashedPassword = 'iRJ1cT5x4V2jlpnVB0gp3bXdN4Uts3EAz4njSxGUNNqOGdxdWpjiTTWLOIAUp+6ketRUhjoRZBS8bpW5QnTnRA==';
  let component: LoginNewPage;
  let fixture: ComponentFixture<LoginNewPage>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let ionicStorageServiceSpy: jasmine.SpyObj<IonicStorageService>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;

  beforeEach(waitForAsync(() => {
    toastServiceSpy = jasmine.createSpyObj('ToastService', {
      showErrorToast: Promise.resolve(),
      dismiss: Promise.resolve(),
    });
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    ionicStorageServiceSpy = jasmine.createSpyObj('IonicStorageService', {
      get: Promise.resolve(aHashedPassword),
      set: Promise.resolve(),
    });
    TestBed.configureTestingModule({
      declarations: [LoginNewPage],
      imports: [IonicModule.forRoot(), ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [
        { provide: IonicStorageService, useValue: ionicStorageServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: ToastService, useValue: toastServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginNewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should login when password is ok', async () => {
    component.form.patchValue({ password: aPassword });

    await component.handleSubmit();

    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/tabs/wallets', { replaceUrl: true });
  });

  it('should show error toast when password is not ok', async () => {
    component.form.patchValue({ password: 'anInvalidPassword' });

    await component.handleSubmit();

    expect(toastServiceSpy.showErrorToast).toHaveBeenCalledOnceWith({
      message: 'users.login_new.invalid_password_text',
      duration: 8000,
    });
  });

  it('should dismiss modal when input is clicked', () => {
    fixture.debugElement.query(By.css('app-ux-input[controlName="password"]')).nativeElement.click();
    expect(toastServiceSpy.dismiss).toHaveBeenCalledTimes(1);
  });

});
