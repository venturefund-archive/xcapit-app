import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { UserKycKriptonDataService } from '../shared-ramps/services/user-kyc-kripton-data/user-kyc-kripton-data.service';
import { KycSummaryDataPage } from './kyc-summary-data.page';

const dataTest = {
  firstName: 'nameTest',
  lastName: 'lastNameTest',
  birthday: 'birthdayTest',
  nationality: { name: 'nameNationalityTest' },
  document: 'documentTest',
  document_number: '12334345345',
  gender: { name: 'male', value: 'fiat_ramps.register.gender_list.male' },
  marital_status: { name: 'married', value: 'fiat_ramps.register.marital_status_list.married' },
  country_code: { code: 'AR (+54)' },
  phone_number: '12333234456',
  street: 'streetTest',
  number: '3',
  floor: 'PB',
  apartment: '2',
  city: 'cityTest',
  zipCode: '123',
  politically_exposed: false,
};

describe('KycSummaryDataPage', () => {
  let component: KycSummaryDataPage;
  let fixture: ComponentFixture<KycSummaryDataPage>;
  let userKycKriptonDataServiceSpy: jasmine.SpyObj<UserKycKriptonDataService>;
  let fiatRampsServiceSpy: jasmine.SpyObj<FiatRampsService>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;

  beforeEach(waitForAsync(() => {
    userKycKriptonDataServiceSpy = jasmine.createSpyObj(
      'UserKycKriptonDataService',
      { getData: dataTest, updateData: null },
      { userKycKriptonData: dataTest }
    );

    fiatRampsServiceSpy = jasmine.createSpyObj('FiatRampsService', {
      registerUserInfo: of({}),
    });

    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    TestBed.configureTestingModule({
      declarations: [KycSummaryDataPage],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot(), ReactiveFormsModule],
      providers: [
        { provide: NavController, useValue: navControllerSpy },
        { provide: UserKycKriptonDataService, useValue: userKycKriptonDataServiceSpy },
        { provide: FiatRampsService, useValue: fiatRampsServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(KycSummaryDataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get data of service on init', () => {
    component.ionViewWillEnter();
    expect(component.data).toEqual(dataTest);
  });

  it('should format correctly country code on init', () => {
    component.ionViewWillEnter();
    expect(component.countryCode).toEqual('(+54)');
  });

  it('should disable confirm button if form is invalid', () => {
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="ux_buy_kripton_details_confirm"]'));
    expect(buttonEl.properties.disabled).toBeTrue();
  });

  it('should enable confirm button if form is valid', () => {
    component.form.patchValue({not_politically_exposed: true});
    fixture.detectChanges();
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="ux_buy_kripton_details_confirm"]'));
    expect(buttonEl.properties.disabled).toBeFalse();
  });

  it('should update data with politically_exposed, send data and redirect to register user page when ux_buy_kripton_details_confirm is clicked and form is valid', () => {
    component.ionViewWillEnter();
    component.form.patchValue({not_politically_exposed: true});
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="ux_buy_kripton_details_confirm"]')).nativeElement.click();
    fixture.detectChanges();
    expect(userKycKriptonDataServiceSpy.updateData).toHaveBeenCalledTimes(1);
    expect(fiatRampsServiceSpy.registerUserInfo).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('fiat-ramps/user-register');
  });

  it('should not update data with politically_exposed, not send data and not redirect to register user page when ux_buy_kripton_details_confirm is clicked but form is invalid', () => {
    component.ionViewWillEnter();
    fixture.debugElement.query(By.css('ion-button[name="ux_buy_kripton_details_confirm"]')).nativeElement.click();
    fixture.detectChanges();
    expect(userKycKriptonDataServiceSpy.updateData).toHaveBeenCalledTimes(0);
    expect(fiatRampsServiceSpy.registerUserInfo).toHaveBeenCalledTimes(0);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(0);
  });
});
