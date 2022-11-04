import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { UserAddressInformationComponent } from './user-address-information.component';

const data = {
  street: 'streetTest',
  number: '122313123',
  apartment: '1',
  floor: '1',
  city: 'cityTest',
  zipCode: '123',
};

describe('UserAddressInformationComponent', () => {
  let component: UserAddressInformationComponent;
  let fixture: ComponentFixture<UserAddressInformationComponent>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;

  beforeEach(waitForAsync(() => {
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    TestBed.configureTestingModule({
      declarations: [UserAddressInformationComponent],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [{ provide: NavController, useValue: navControllerSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(UserAddressInformationComponent);
    component = fixture.componentInstance;
    component.street = data.street;
    component.number = data.number;
    component.floor = data.floor;
    component.city = data.city;
    component.apartment = data.apartment;
    component.zipCode = data.zipCode;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to address information page when ux_edit_user_address button is clicked', async () => {
    fixture.debugElement.query(By.css('ion-button[name="ux_edit_user_address"]')).nativeElement.click();
    expect(navControllerSpy.navigateBack).toHaveBeenCalledOnceWith('fiat-ramps/user-address');
  });
});
