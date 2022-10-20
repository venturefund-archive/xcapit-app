import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { UserKycKriptonDataService } from '../shared-ramps/services/user-kyc-kripton-data/user-kyc-kripton-data.service';
import { KycUserAddressInformationPage } from './kyc-user-address-information.page';

describe('KycUserAddressInformationPage', () => {
  let component: KycUserAddressInformationPage;
  let fixture: ComponentFixture<KycUserAddressInformationPage>;
  let userKycKriptonDataServiceSpy: jasmine.SpyObj<UserKycKriptonDataService>;
  const invalidFormData = {
    street: 'test',
    number: 'test',
    city: 'test123',
    floor: '',
    apartment: '',
    zipCode: '123',
  };
  const validFormData = {
    street: 'test',
    number: '123',
    city: 'test123',
    floor: '',
    apartment: '',
    zipCode: '123',
  };
  beforeEach(waitForAsync(() => {
    userKycKriptonDataServiceSpy = jasmine.createSpyObj('UserKycKriptonDataService', {
      updateData: null,
    });
    TestBed.configureTestingModule({
      declarations: [KycUserAddressInformationPage],
      imports: [IonicModule.forRoot(), ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [{ provide: UserKycKriptonDataService, useValue: userKycKriptonDataServiceSpy }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(KycUserAddressInformationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly', async () => {
    const progressEl = fixture.debugElement.query(By.css('.uai__container__progress'));
    const providerEl = fixture.debugElement.query(By.css('div.uai__container__provider > ion-text'));
    const titleEl = fixture.debugElement.query(By.css('div.uai__container__title > ion-text'));
    const subtitleEl = fixture.debugElement.query(By.css('div.uai__container__subtitle > ion-text'));
    const iconEl = fixture.debugElement.query(By.css('div.uai__container__subtitle > ion-text > ion-icon'));
    const [streetInput, cityInput, zipCodeInput] = fixture.debugElement.queryAll(
      By.css('div.uai__container__form > form > app-ux-input')
    );
    const [numberInput, floorInput, apartmentInput] = fixture.debugElement.queryAll(
      By.css('div.uai__container__form > form > div.uai__container__form__group > app-ux-input')
    );
    const buttonEl = fixture.debugElement.query(By.css('ion-footer.uai__footer > div > ion-button'));
    expect(progressEl).toBeTruthy();
    expect(providerEl.nativeElement.innerHTML).toContain('fiat_ramps.kyc.user_address.provider');
    expect(titleEl.nativeElement.innerHTML).toContain('fiat_ramps.kyc.user_address.title');
    expect(subtitleEl.nativeElement.innerHTML).toContain('fiat_ramps.kyc.user_address.subtitle');
    expect(iconEl).toBeTruthy();
    expect(streetInput.attributes.controlName).toContain('street');
    expect(cityInput.attributes.controlName).toContain('city');
    expect(zipCodeInput.attributes.controlName).toContain('zipCode');
    expect(numberInput.attributes.controlName).toContain('number');
    expect(floorInput.attributes.controlName).toContain('floor');
    expect(apartmentInput.attributes.controlName).toContain('apartment');
    expect(buttonEl).toBeTruthy();
  });

  it('should disable Continue button if form is not valid', () => {
    component.form.patchValue(invalidFormData);
    fixture.detectChanges();

    const buttonEl = fixture.debugElement.query(By.css('ion-footer.uai__footer > div > ion-button'));

    expect(buttonEl.properties.disabled).toBeTrue();
  });

  it('should set userKycKriptonData when form was sumbitted', () => {
    component.form.patchValue(validFormData);
    fixture.detectChanges();

    const buttonEl = fixture.debugElement.query(By.css('ion-footer.uai__footer > div > ion-button'));
    buttonEl.nativeElement.click();

    expect(userKycKriptonDataServiceSpy.updateData).toHaveBeenCalledOnceWith(validFormData);
  });

});
