import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { UserProfileCardComponent } from './user-profile-card.component';

const testProfiles = {
  conservative: {
    email: 'example@mail.com',
    investor_category: 'wealth_managements.profiles.conservative',
  },
  noTest: {
    email: 'example@mail.com',
    investor_category: 'wealth_managements.profiles.no_category',
  },
};

describe('UserProfileCardComponent', () => {
  let component: UserProfileCardComponent;
  let fixture: ComponentFixture<UserProfileCardComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<UserProfileCardComponent>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();

      TestBed.configureTestingModule({
        declarations: [UserProfileCardComponent, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot(), HttpClientTestingModule],
        providers: [{ provide: NavController, useValue: navControllerSpy }],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(UserProfileCardComponent);
      component = fixture.componentInstance;
      component.profile = testProfiles.conservative;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when Investor Profile button is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Investor Profile');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });

  it("should navigate to Investor Test's starting page when Investor Profile button is clicked", () => {
    fixture.debugElement.query(By.css('ion-button[name="Investor Profile"]')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/wealth-management/investor-test-options']);
  });

  it('should hide Investor Profile button when user has not taken Investor Test', () => {
    component.profile = testProfiles.noTest;
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('ion-button[name="Investor Profile"]'));
    expect(button).toBeNull();
  });
});
