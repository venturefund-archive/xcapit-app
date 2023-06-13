import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { UserKycKriptonDataService } from '../shared-ramps/services/user-kyc-kripton-data/user-kyc-kripton-data.service';
import { KycUserAddressInformationPage } from './kyc-user-address-information.page';

describe('KycUserAddressInformationPage', () => {
  let component: KycUserAddressInformationPage;
  let fixture: ComponentFixture<KycUserAddressInformationPage>;
  let userKycKriptonDataServiceSpy: jasmine.SpyObj<UserKycKriptonDataService>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;

  const invalidFormData = {
    street_address: 'test',
    street_number: 'test',
    city: 'test123',
    floor: '',
    apartment: '',
    postal_code: '123',
  };
  
  const validFormData = {
    street_address: 'test',
    street_number: '123',
    city: 'test123',
    floor: '',
    apartment: '',
    postal_code: '123',
  };

  beforeEach(waitForAsync(() => {
    userKycKriptonDataServiceSpy = jasmine.createSpyObj('UserKycKriptonDataService', {
      updateData: null,
      getData: validFormData,
    });

    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    TestBed.configureTestingModule({
      declarations: [KycUserAddressInformationPage],
      imports: [IonicModule.forRoot(), ReactiveFormsModule, TranslateModule.forRoot()],
      providers: [
        { provide: UserKycKriptonDataService, useValue: userKycKriptonDataServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
      ],
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
    expect(streetInput.attributes.controlName).toContain('street_address');
    expect(cityInput.attributes.controlName).toContain('city');
    expect(zipCodeInput.attributes.controlName).toContain('postal_code');
    expect(numberInput.attributes.controlName).toContain('street_number');
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

  it('should set userKycKriptonData and redirect to summary data page when form was sumbitted', () => {
    component.form.patchValue(validFormData);
    fixture.detectChanges();

    const buttonEl = fixture.debugElement.query(By.css('ion-footer.uai__footer > div > ion-button'));
    buttonEl.nativeElement.click();

    expect(userKycKriptonDataServiceSpy.updateData).toHaveBeenCalledOnceWith(validFormData);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('fiat-ramps/summary-data');
  });

  it('should get data and patch data on form on init if there is data', async () => {
    component.ionViewWillEnter();
    fixture.detectChanges();
    expect(userKycKriptonDataServiceSpy.getData).toHaveBeenCalledTimes(1);
    expect(component.form.value.street_address).toEqual(validFormData.street_address);
    expect(component.form.value.street_number).toEqual(validFormData.street_number);
    expect(component.form.value.floor).toEqual(validFormData.floor);
    expect(component.form.value.apartment).toEqual(validFormData.apartment);
    expect(component.form.value.city).toEqual(validFormData.city);
    expect(component.form.value.postal_code).toEqual(validFormData.postal_code);
  });
});
