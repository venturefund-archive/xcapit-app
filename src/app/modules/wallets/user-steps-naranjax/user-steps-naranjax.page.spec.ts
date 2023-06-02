import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';

import { UserStepsNaranjaxPage } from './user-steps-naranjax.page';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { By } from '@angular/platform-browser';
import { TrackService } from 'src/app/shared/services/track/track.service';
import { TranslateModule } from '@ngx-translate/core';

describe('UserStepsNaranjaxPage', () => {
  let component: UserStepsNaranjaxPage;
  let fixture: ComponentFixture<UserStepsNaranjaxPage>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;

  beforeEach(waitForAsync(() => {
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();

    trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy', {
      trackEvent: Promise.resolve(true),
    });
    TestBed.configureTestingModule({
      declarations: [UserStepsNaranjaxPage],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: NavController, useValue: navControllerSpy },
        { provide: TrackService, useValue: trackServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserStepsNaranjaxPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to continue button', () => {
    fixture.debugElement.query(By.css('ion-button[name="ux_continue"]')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/wallets/create-password/create');
  });

  it('should navigate to select wallettype when Close button is clicked', () => {
    fixture.debugElement.query(By.css('ion-button[name="Close button"]')).nativeElement.click();
    fixture.detectChanges();
    expect(navControllerSpy.navigateBack).toHaveBeenCalledOnceWith('/wallets/select-wallet-type');
  });

  it('should track screenview event on init', () => {
    component.ionViewWillEnter();
    expect(trackServiceSpy.trackEvent).toHaveBeenCalledTimes(1);
  });
});
