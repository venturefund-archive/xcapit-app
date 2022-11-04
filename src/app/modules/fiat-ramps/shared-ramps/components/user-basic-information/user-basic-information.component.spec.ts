import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { UserBasicInformationComponent } from './user-basic-information.component';

const data = {
  firstName: 'nameTest',
  lastName: 'lastNameTest',
  birthday: 'birthdayTest',
};

describe('UserBasicInformationComponent', () => {
  let component: UserBasicInformationComponent;
  let fixture: ComponentFixture<UserBasicInformationComponent>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;

  beforeEach(waitForAsync(() => {
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    TestBed.configureTestingModule({
      declarations: [UserBasicInformationComponent],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [{ provide: NavController, useValue: navControllerSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(UserBasicInformationComponent);
    component = fixture.componentInstance;
    component.firstName = data.firstName;
    component.lastName = data.lastName;
    component.birthday = data.birthday;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to basic information page when ux_edit_user_basic button is clicked', async () => {
    fixture.debugElement.query(By.css('ion-button[name="ux_edit_user_basic"]')).nativeElement.click();
    expect(navControllerSpy.navigateBack).toHaveBeenCalledOnceWith('fiat-ramps/user-basic');
  });
});
