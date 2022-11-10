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
import { StorageOperationService } from '../shared-ramps/services/operation/storage-operation.service';
import { rawOperationData } from '../shared-ramps/fixtures/raw-operation-data';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';

describe('UserEmailPage', () => {
  let component: UserEmailPage;
  let fixture: ComponentFixture<UserEmailPage>;
  let fiatRampServiceSpy: jasmine.SpyObj<FiatRampsService>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let storageOperationServiceSpy: jasmine.SpyObj<StorageOperationService>;
  let remoteConfigServiceSpy: jasmine.SpyObj<RemoteConfigService>;
  const STATUS = Object.keys(RegistrationStatus);

  beforeEach(waitForAsync(() => {
    fiatRampServiceSpy = jasmine.createSpyObj('FiatRampService', {
      getOrCreateUser: of(),
    });
    remoteConfigServiceSpy = jasmine.createSpyObj('RemoteConfigService', { getFeatureFlag: false });

    navControllerSpy = new FakeNavController().createSpy();

    storageOperationServiceSpy = jasmine.createSpyObj('StorageOperationService', {
      getData: rawOperationData,
      updateData: null,
    });

    TestBed.configureTestingModule({
      declarations: [UserEmailPage],
      imports: [IonicModule.forRoot(), ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [
        { provide: FiatRampsService, useValue: fiatRampServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: StorageOperationService, useValue: storageOperationServiceSpy },
        { provide: RemoteConfigService, useValue: remoteConfigServiceSpy },

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
      remoteConfigServiceSpy.getFeatureFlag.and.returnValue(false);
      fiatRampServiceSpy.getOrCreateUser.and.returnValue(of({ registration_status: registrationStatus }));
      component.form.patchValue({ email: 'test@test.com',token: '12345' });
      fixture.debugElement.query(By.css('ion-button[name="ux_user_mail_continue"]')).nativeElement.click();
      fixture.detectChanges();
      await fixture.whenStable();
      expect(fiatRampServiceSpy.getOrCreateUser).toHaveBeenCalledOnceWith({ email: 'test@test.com', token: '12345' });
      expect(storageOperationServiceSpy.updateData).toHaveBeenCalledTimes(1);
      expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(URL);
    });
  });
});
