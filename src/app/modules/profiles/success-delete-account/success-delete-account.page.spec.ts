import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { AuthService } from '../../users/shared-users/services/auth/auth.service';
import { DeleteAccountDataService } from '../shared-profiles/services/delete-account-data/delete-account-data.service';
import { SuccessDeleteAccountPage } from './success-delete-account.page';

describe('SuccessDeleteAccountPage', () => {
  let component: SuccessDeleteAccountPage;
  let fixture: ComponentFixture<SuccessDeleteAccountPage>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let ionicStorageServiceSpy: jasmine.SpyObj<IonicStorageService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let deleteAccountDataServiceSpy: jasmine.SpyObj<DeleteAccountDataService>;

  beforeEach(waitForAsync(() => {
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();

    ionicStorageServiceSpy = jasmine.createSpyObj('IonicStorageService', {
      get: Promise.resolve(false),
      set: Promise.resolve(),
    });

    authServiceSpy = jasmine.createSpyObj('AuthService', {
      logout: Promise.resolve(),
    });

    deleteAccountDataServiceSpy = jasmine.createSpyObj('DeleteAccountDataService', {}, { email: 'test@test.com' });
    TestBed.configureTestingModule({
      declarations: [SuccessDeleteAccountPage],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: NavController, useValue: navControllerSpy },
        { provide: IonicStorageService, useValue: ionicStorageServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: DeleteAccountDataService, useValue: deleteAccountDataServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SuccessDeleteAccountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should logout and redirect to login page when close button is clicked', async () => {
    component.ionViewWillEnter();
    fixture.debugElement.query(By.css('ion-button[name="close"]')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(authServiceSpy.logout).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateRoot).toHaveBeenCalledOnceWith('users/login');
  });
});
