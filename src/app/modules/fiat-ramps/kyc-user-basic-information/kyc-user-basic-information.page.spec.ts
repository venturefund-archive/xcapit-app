import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { UserKycKriptonDataService } from '../shared-ramps/services/user-kyc-kripton-data/user-kyc-kripton-data.service';
import { KycUserBasicInformationPage } from './kyc-user-basic-information.page';

const invalidFormData = {
  firstName: 'test',
  lastName: 'test',
  birthday: '1-1-1999',
};

const validFormData = {
  firstName: 'test',
  lastName: 'test',
  birthday: '1/1/1999',
};

describe('KycUserBasicInformationPage', () => {
  let component: KycUserBasicInformationPage;
  let fixture: ComponentFixture<KycUserBasicInformationPage>;
  let userKycKriptonDataServiceSpy: jasmine.SpyObj<UserKycKriptonDataService>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;

  beforeEach(waitForAsync(() => {
    userKycKriptonDataServiceSpy = jasmine.createSpyObj('UserKycKriptonDataService', {
      updateData: null,
      getData: validFormData,
    });
    trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy', {
      trackEvent: Promise.resolve(true),
    });
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    TestBed.configureTestingModule({
      declarations: [KycUserBasicInformationPage],
      imports: [IonicModule.forRoot(), ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [
        { provide: UserKycKriptonDataService, useValue: userKycKriptonDataServiceSpy },
        { provide: TrackService, useValue: trackServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(KycUserBasicInformationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly', async () => {
    const progressEl = fixture.debugElement.query(By.css('.ubi__container__progress'));
    const providerEl = fixture.debugElement.query(By.css('div.ubi__container__provider > ion-text'));
    const titleEl = fixture.debugElement.query(By.css('div.ubi__container__title > ion-text'));
    const subtitleEl = fixture.debugElement.query(By.css('div.ubi__container__subtitle > ion-text'));
    const iconEl = fixture.debugElement.query(By.css('div.ubi__container__subtitle > ion-text > ion-icon'));
    const [input1, input2, input3] = fixture.debugElement.queryAll(
      By.css('div.ubi__container__form > form > app-ux-input')
    );
    const buttonEl = fixture.debugElement.query(By.css('ion-footer.ubi__footer > div > ion-button'));
    expect(progressEl).toBeTruthy();
    expect(providerEl.nativeElement.innerHTML).toContain('fiat_ramps.kyc.user_basic.provider');
    expect(titleEl.nativeElement.innerHTML).toContain('fiat_ramps.kyc.user_basic.title');
    expect(subtitleEl.nativeElement.innerHTML).toContain('fiat_ramps.kyc.user_basic.subtitle');
    expect(iconEl).toBeTruthy();
    expect(input1.attributes.controlName).toContain('firstName');
    expect(input2.attributes.controlName).toContain('lastName');
    expect(input3.attributes.controlName).toContain('birthday');
    expect(buttonEl).toBeTruthy();
  });

  it('should disable Continue button if form is not valid', () => {
    component.form.patchValue(invalidFormData);
    fixture.detectChanges();

    const buttonEl = fixture.debugElement.query(By.css('ion-footer.ubi__footer > div > ion-button'));

    expect(buttonEl.properties.disabled).toBeTrue();
  });

  it('should set userKycKriptonData and redirect to personal information page when form was sumbitted', () => {
    component.form.patchValue(validFormData);
    fixture.detectChanges();

    const buttonEl = fixture.debugElement.query(By.css('ion-footer.ubi__footer > div > ion-button'));
    buttonEl.nativeElement.click();

    expect(userKycKriptonDataServiceSpy.updateData).toHaveBeenCalledOnceWith(validFormData);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('fiat-ramps/user-personal-information');
  });

  it('should track screenview event on init', () => {
    component.ionViewWillEnter();
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
  });

  it('should get data and patch data on form on init if there is data', async () => {
    component.form.value.firstName = validFormData.firstName;
    await component.ionViewWillEnter();
    fixture.detectChanges();
    expect(userKycKriptonDataServiceSpy.getData).toHaveBeenCalledTimes(1);
    expect(component.form.value.firstName).toEqual(validFormData.firstName);
    expect(component.form.value.lastName).toEqual(validFormData.lastName);
    expect(component.form.value.birthday).toEqual(validFormData.birthday);
  });
});
