import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { rawCommonFieldsData, rawSpecificFieldsData } from '../shared-ramps/fixtures/raw-user-bank-account-data';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { TokenOperationDataService } from '../shared-ramps/services/token-operation-data/token-operation-data.service';
import { UserBankDataService } from '../shared-ramps/services/user-bank-data/user-bank-data.service';
import { UserBankAccountPage } from './user-bank-account.page';

describe('UserBankAccountPage', () => {
  let component: UserBankAccountPage;
  let fixture: ComponentFixture<UserBankAccountPage>;
  let userBankDataServiceSpy: jasmine.SpyObj<UserBankDataService>;
  let fiatRampsServiceSpy: jasmine.SpyObj<FiatRampsService>;
  let tokenOperationDataServiceSpy: jasmine.SpyObj<TokenOperationDataService>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;

  const formControlsKeys = [
    'name',
    'account_type',
    'type_of_document',
    'number_of_document',
    'account_number',
    'currency',
    'country',
  ];

  const validFormData = {
    name: 'testname',
    account_type: { key: 'Ahorro', value: 'Ahorro' },
    type_of_document: { key: 'DNI', value: 'DNI' },
    number_of_document: 12345678,
    account_number: 36631487,
  };

  beforeEach(waitForAsync(() => {
    fiatRampsServiceSpy = jasmine.createSpyObj('FiatRampsService', {
      getCashOutFormFields: of(),
    });

    tokenOperationDataServiceSpy = jasmine.createSpyObj(
      'TokenOperationDataService',
      {},
      {
        tokenOperationData: { country: 'COL', asset: 'USDC' },
      }
    );

    userBankDataServiceSpy = jasmine.createSpyObj(
      'UserBankDataService',
      {
        set: {},
      },
      {
        userBankData: undefined,
      }
    );

    fakeNavController = new FakeNavController({});
    navControllerSpy = fakeNavController.createSpy();

    TestBed.configureTestingModule({
      declarations: [UserBankAccountPage],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot(), ReactiveFormsModule],
      providers: [
        { provide: FiatRampsService, useValue: fiatRampsServiceSpy },
        { provide: TokenOperationDataService, useValue: tokenOperationDataServiceSpy },
        { provide: NavController, useValue: navControllerSpy },
        { provide: UserBankDataService, useValue: userBankDataServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(UserBankAccountPage);
    component = fixture.componentInstance;
    fiatRampsServiceSpy.getCashOutFormFields.and.returnValues(of(rawCommonFieldsData), of(rawSpecificFieldsData));
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render form fields properly', async () => {
    await component.ionViewWillEnter();
    fixture.detectChanges();
    const inputs = fixture.debugElement.queryAll(By.css('app-ux-input'));
    const selects = fixture.debugElement.queryAll(By.css('app-input-select'));
    expect(inputs.length).toEqual(3);
    expect(selects.length).toEqual(2);
  });

  it('should create form properly', async () => {
    await component.ionViewWillEnter();
    fixture.detectChanges();
    const controls = Object.keys(component.form.controls);
    expect(controls.length).toEqual(7);
    expect(controls).toEqual(formControlsKeys);
  });

  it('should navigate to info page and save user bank data when button is clicked and form is valid', async () => {
    await component.ionViewWillEnter();
    fixture.detectChanges();
    component.form.patchValue(validFormData);
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="ux_sell_bankdata_continue"]')).nativeElement.click();
    fixture.detectChanges();
    expect(userBankDataServiceSpy.set).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['fiat-ramps/sell-order']);
  });

  it('should not navigate to info page and not save user bank data when button is clicked and form is invalid', async () => {
    await component.ionViewWillEnter();
    fixture.detectChanges();
    component.form.reset();
    fixture.detectChanges();
    const buttonEl = fixture.debugElement.query(By.css('ion-button[name="ux_sell_bankdata_continue"]'));
    expect(buttonEl.properties.disabled).toBeTrue();
  });
});
