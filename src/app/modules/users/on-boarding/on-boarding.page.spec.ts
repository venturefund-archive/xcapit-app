import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { SwiperModule } from 'swiper/angular';
import { OnBoardingPage } from './on-boarding.page';
import { AuthService } from '../shared-users/services/auth/auth.service';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';

describe('OnBoardingPage', () => {
  let component: OnBoardingPage;
  let fixture: ComponentFixture<OnBoardingPage>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let ionicStorageServiceSpy: jasmine.SpyObj<IonicStorageService>;

  beforeEach(waitForAsync(() => {
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy', {
      trackEvent: Promise.resolve(true),
    });
    ionicStorageServiceSpy = jasmine.createSpyObj('IonicStorageService', {
      set: Promise.resolve(),
    });
    authServiceSpy = jasmine.createSpyObj('AuthService', { logout: Promise.resolve() });
    TestBed.configureTestingModule({
      declarations: [OnBoardingPage],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot(), SwiperModule],
      providers: [
        { provide: NavController, useValue: navControllerSpy },
        { provide: TrackService, useValue: trackServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: IonicStorageService, useValue: ionicStorageServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(OnBoardingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to Create wallet page when button is clicked', () => {
    fixture.debugElement.query(By.css('ion-button[name="Create wallet"]')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/wallets/select-wallet-type');
  });

  it('should navigate to Import wallet page when button is clicked', async () => {
    fixture.debugElement.query(By.css('ion-button[name="Import wallet"]')).nativeElement.click();
    await fixture.whenStable();
    expect(ionicStorageServiceSpy.set).toHaveBeenCalledOnceWith('warranty_wallet', false);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/wallets/create-first/disclaimer/import');
  });

  it('should track screenview event on init', () => {
    component.ionViewWillEnter();
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
  });

  it('should remove old jwt tokens on init', () => {
    component.ionViewWillEnter();
    expect(authServiceSpy.logout).toHaveBeenCalledTimes(1);
  });
});
