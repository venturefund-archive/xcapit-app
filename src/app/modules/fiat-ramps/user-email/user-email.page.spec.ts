import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { UserEmailPage } from './user-email.page';
import { RegistrationStatus } from '../enums/registration-status.enum';
import { KriptonStorageService } from '../shared-ramps/services/kripton-storage/kripton-storage.service';

describe('UserEmailPage', () => {
  let component: UserEmailPage;
  let fixture: ComponentFixture<UserEmailPage>;
  let fiatRampServiceSpy: jasmine.SpyObj<FiatRampsService>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let kriptonStorageSpy: jasmine.SpyObj<KriptonStorageService>;

  const STATUS = Object.keys(RegistrationStatus);

  beforeEach(waitForAsync(() => {
    fiatRampServiceSpy = jasmine.createSpyObj('FiatRampService', {
      getOrCreateUser: of(),
    });

    navControllerSpy = new FakeNavController().createSpy();

    kriptonStorageSpy = jasmine.createSpyObj('KriptonStorageService', {
      set: Promise.resolve()
    })

    TestBed.configureTestingModule({
      declarations: [UserEmailPage],
      imports: [IonicModule.forRoot(), ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [
        { provide: FiatRampsService, useValue: fiatRampServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: KriptonStorageService, useValue: kriptonStorageSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(UserEmailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  STATUS.forEach((registrationStatus) => {
    const URL = RegistrationStatus[registrationStatus];
    it(`should redirect to ${URL} when user status is ${registrationStatus}`, async () => {
      fiatRampServiceSpy.getOrCreateUser.and.returnValue(of({ registration_status: registrationStatus }));
      component.form.patchValue({ email: 'test@test.com', token: '12345'});
      fixture.debugElement.query(By.css('ion-button[name="ux_user_mail_continue"]')).nativeElement.click();
      await fixture.whenStable();
      await fixture.whenRenderingDone();
      fixture.detectChanges();
      expect(kriptonStorageSpy.set).toHaveBeenCalledOnceWith('email','test@test.com')
      expect(fiatRampServiceSpy.getOrCreateUser).toHaveBeenCalledOnceWith({ email: 'test@test.com'});
      expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(URL);
    });
  });
});
