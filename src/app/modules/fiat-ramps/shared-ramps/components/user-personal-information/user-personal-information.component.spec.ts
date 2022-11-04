import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { UserPersonalInformationComponent } from './user-personal-information.component';

const data = {
  nationality: { name: 'nationalityTest' },
  documentNumber: '122313123',
  gender: { value: 'genderTest' },
  maritalStatus: { value: 'maritalStatusTest' },
  countryCode: '123',
  phoneNumber: '1234567',
};

describe('UserPersonalInformationComponent', () => {
  let component: UserPersonalInformationComponent;
  let fixture: ComponentFixture<UserPersonalInformationComponent>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;

  beforeEach(waitForAsync(() => {
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    TestBed.configureTestingModule({
      declarations: [UserPersonalInformationComponent],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [{ provide: NavController, useValue: navControllerSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(UserPersonalInformationComponent);
    component = fixture.componentInstance;
    component.nationality = data.nationality.name;
    component.documentNumber = data.documentNumber;
    component.gender = data.gender.value;
    component.maritalStatus = data.maritalStatus.value;
    component.countryCode = data.countryCode;
    component.phoneNumber = data.phoneNumber;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to personal information page when ux_edit_personal_information button is clicked', async () => {
    fixture.debugElement.query(By.css('ion-button[name="ux_edit_personal_information"]')).nativeElement.click();
    expect(navControllerSpy.navigateBack).toHaveBeenCalledOnceWith('fiat-ramps/user-personal-information');
  });
});
