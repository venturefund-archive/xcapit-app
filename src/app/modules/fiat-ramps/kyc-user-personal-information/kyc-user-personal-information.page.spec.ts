import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { rawProvidersData } from '../shared-ramps/fixtures/raw-providers-data';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { UserKycKriptonDataService } from '../shared-ramps/services/user-kyc-kripton-data/user-kyc-kripton-data.service';
import { KycUserPersonalInformationPage } from './kyc-user-personal-information.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

const invalidFormData = {
  nationality: 'test',
  document: 'test',
  document_number: '123',
  gender: 'test',
  marital_status: 'test',
  country_code: 'test',
  phone_number: '123',
};

const validFormData = {
  nationality: 'test',
  document: 'test',
  document_number: '12345678',
  gender: 'test',
  marital_status: 'test',
  country_code: 'test',
  phone_number: '0123456789',
};

const provider = rawProvidersData[1];

describe('KycUserBasicInformationStep2Page', () => {
  let component: KycUserPersonalInformationPage;
  let fixture: ComponentFixture<KycUserPersonalInformationPage>;
  let userKycKriptonDataServiceSpy: jasmine.SpyObj<UserKycKriptonDataService>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;
  let fiatRampsServiceSpy: jasmine.SpyObj<FiatRampsService>;

  beforeEach(waitForAsync(() => {
    userKycKriptonDataServiceSpy = jasmine.createSpyObj('UserKycKriptonDataService', {
      updateData: null,
    });
    trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy', {
      trackEvent: Promise.resolve(true),
    });
    fiatRampsServiceSpy = jasmine.createSpyObj('FiatRampsService', {
      getProvider: provider,
    });
    TestBed.configureTestingModule({
      declarations: [KycUserPersonalInformationPage],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot(), ReactiveFormsModule],
      providers: [
        { provide: UserKycKriptonDataService, useValue: userKycKriptonDataServiceSpy },
        { provide: TrackService, useValue: trackServiceSpy },
        { provide: FiatRampsService, useValue: fiatRampsServiceSpy },
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
    const subtitleEl = fixture.debugElement.query(By.css('div.upi__container__subtitle > ion-text'));
    const iconEl = fixture.debugElement.query(By.css('div.upi__container__subtitle > ion-text > ion-icon'));
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
    expect(subtitleEl.nativeElement.innerHTML).toContain('fiat_ramps.kyc.user_personal_information.subtitle');
    expect(iconEl).toBeTruthy();
    expect(inputSelectNationalityEl.attributes.controlName).toContain('nationality');
    expect(inputSelectGenderEl.attributes.controlName).toContain('gender');
    expect(inputSelectMaritalEl.attributes.controlName).toContain('marital_status');
    expect(inputSelectDocumentEl.attributes.controlName).toContain('document');
    expect(inputSelectDocumentNumberEl.attributes.controlName).toContain('document_number');
    expect(inputSelectCountryCodeEl.attributes.controlName).toContain('country_code');
    expect(inputSelectPhoneNumberEl.attributes.controlName).toContain('phone_number');
    expect(buttonEl).toBeTruthy();
  });

  it('should disable Continue button if form is not valid', () => {
    component.form.patchValue(invalidFormData);
    fixture.detectChanges();

    const buttonEl = fixture.debugElement.query(By.css('ion-footer.upi__footer > div > ion-button'));

    expect(buttonEl.properties.disabled).toBeTrue();
  });

  it('should set userKycKriptonData when form was sumbitted', () => {
    component.form.patchValue(validFormData);
    fixture.detectChanges();

    const buttonEl = fixture.debugElement.query(By.css('ion-footer.upi__footer > div > ion-button'));
    buttonEl.nativeElement.click();

    expect(userKycKriptonDataServiceSpy.updateData).toHaveBeenCalledOnceWith(validFormData);
  });

  it('should track screenview event on init', () => {
    component.ionViewWillEnter();
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
  });
});
