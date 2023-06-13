import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { rawProvidersData } from '../shared-ramps/fixtures/raw-providers-data';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { UserKycKriptonDataService } from '../shared-ramps/services/user-kyc-kripton-data/user-kyc-kripton-data.service';
import { KycUserPersonalInformationPage } from './kyc-user-personal-information.page';

describe('KycUserPersonalInformationPage', () => {
  let component: KycUserPersonalInformationPage;
  let fixture: ComponentFixture<KycUserPersonalInformationPage>;
  let userKycKriptonDataServiceSpy: jasmine.SpyObj<UserKycKriptonDataService>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;
  let fiatRampsServiceSpy: jasmine.SpyObj<FiatRampsService>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;

  const invalidFormData = {
    nationality: 'test',
    document_type: 'test',
    document_number: '123',
    gender: 'test',
    marital_status: 'test',
    country_code: 'test',
    telephone_number: '123',
  };
  
  const validFormData = {
    nationality: 'test',
    document_type: 'test',
    document_number: '12345678',
    gender: 'test',
    marital_status: 'test',
    country_code: 'test',
    telephone_number: '0123456789',
  };
  
  const dataTest = {
    nationality: 'Argentina',
    document_type: 'documentTest',
    document_number: '12334345345',
    gender: { name: 'male', value: 'fiat_ramps.register.gender_list.male' },
    marital_status: { name: 'married', value: 'fiat_ramps.register.marital_status_list.married' },
    country_code: { code: 'VEN (+58)' },
    telephone_number: '12333234456',
    politically_exposed: false,
  };

  const provider = rawProvidersData[1];

  beforeEach(waitForAsync(() => {
    userKycKriptonDataServiceSpy = jasmine.createSpyObj('UserKycKriptonDataService', {
      updateData: null,
      getData: dataTest,
    });
    trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy', {
      trackEvent: Promise.resolve(true),
    });
    fiatRampsServiceSpy = jasmine.createSpyObj('FiatRampsService', {
      getProvider: provider,
    });
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    TestBed.configureTestingModule({
      declarations: [KycUserPersonalInformationPage],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot(), ReactiveFormsModule],
      providers: [
        { provide: UserKycKriptonDataService, useValue: userKycKriptonDataServiceSpy },
        { provide: TrackService, useValue: trackServiceSpy },
        { provide: FiatRampsService, useValue: fiatRampsServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(KycUserPersonalInformationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly', async () => {
    const progressEl = fixture.debugElement.query(By.css('.upi__container__progress'));
    const providerEl = fixture.debugElement.query(By.css('div.upi__container__provider > ion-text'));
    const titleEl = fixture.debugElement.query(By.css('div.upi__container__title > ion-text'));
    const [inputSelectNationalityEl, inputSelectGenderEl, inputSelectMaritalEl] = fixture.debugElement.queryAll(
      By.css('div.upi__container__form > form > app-input-select')
    );
    const inputSelectDocumentEl = fixture.debugElement.query(
      By.css(
        'div.upi__container__form > form > div.upi__container__form__document > div.upi__container__form__document__input-select > app-input-select'
      )
    );
    const inputSelectDocumentNumberEl = fixture.debugElement.query(
      By.css(
        'div.upi__container__form > form > div.upi__container__form__document > div.upi__container__form__document__input > app-ux-input'
      )
    );
    const inputSelectCountryCodeEl = fixture.debugElement.query(
      By.css(
        'div.upi__container__form > form > div.upi__container__form__phone > div.upi__container__form__phone__input-select > app-input-select'
      )
    );
    const inputSelectPhoneNumberEl = fixture.debugElement.query(
      By.css(
        'div.upi__container__form > form > div.upi__container__form__phone > div.upi__container__form__phone__input > app-ux-input'
      )
    );
    const buttonEl = fixture.debugElement.query(By.css('ion-footer.upi__footer > div > ion-button'));
    expect(progressEl).toBeTruthy();
    expect(providerEl.nativeElement.innerHTML).toContain('fiat_ramps.kyc.user_personal_information.provider');
    expect(titleEl.nativeElement.innerHTML).toContain('fiat_ramps.kyc.user_personal_information.title');
    expect(inputSelectNationalityEl.attributes.controlName).toContain('nationality');
    expect(inputSelectGenderEl.attributes.controlName).toContain('gender');
    expect(inputSelectMaritalEl.attributes.controlName).toContain('marital_status');
    expect(inputSelectDocumentEl.attributes.controlName).toContain('document_type');
    expect(inputSelectDocumentNumberEl.attributes.controlName).toContain('document_number');
    expect(inputSelectCountryCodeEl.attributes.controlName).toContain('country_code');
    expect(inputSelectPhoneNumberEl.attributes.controlName).toContain('telephone_number');
    expect(buttonEl).toBeTruthy();
  });

  it('should disable Continue button if form is not valid', () => {
    component.form.patchValue(invalidFormData);
    fixture.detectChanges();

    const buttonEl = fixture.debugElement.query(By.css('ion-footer.upi__footer > div > ion-button'));

    expect(buttonEl.properties.disabled).toBeTrue();
  });

  it('should set userKycKriptonData and redirect to user address page when form was sumbitted', () => {
    component.form.patchValue(validFormData);
    fixture.detectChanges();

    const buttonEl = fixture.debugElement.query(By.css('ion-footer.upi__footer > div > ion-button'));
    buttonEl.nativeElement.click();

    expect(userKycKriptonDataServiceSpy.updateData).toHaveBeenCalledOnceWith(validFormData);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('fiat-ramps/user-address');
  });

  it('should track screenview event on init', () => {
    component.ionViewWillEnter();
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
  });

  it('should get and patch data on form on init if there is data', async () => {
    dataTest.nationality = 'Argentina'
    await component.ionViewWillEnter();
    fixture.detectChanges();
    expect(userKycKriptonDataServiceSpy.getData).toHaveBeenCalledTimes(1);
    expect(component.form.value.nationality).toEqual(dataTest.nationality);
    expect(component.form.value.document_type).toEqual(dataTest.document_type);
    expect(component.form.value.document_number).toEqual(dataTest.document_number);
    expect(component.form.value.gender).toEqual(dataTest.gender);
    expect(component.form.value.marital_status).toEqual(dataTest.marital_status);
    expect(component.form.value.country_code).toEqual(dataTest.country_code);
    expect(component.form.value.telephone_number).toEqual(dataTest.telephone_number);
  });

  it('should patch default country code on form on init if there isnt data', async () => {
    dataTest.nationality = undefined;
    await component.ionViewWillEnter();
    fixture.detectChanges();
    expect(userKycKriptonDataServiceSpy.getData).toHaveBeenCalledTimes(1);
    expect(component.form.value.country_code.code).toEqual('AR (+54)');
  });
});
