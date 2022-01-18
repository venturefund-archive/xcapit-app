import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { ReferralPromotionCardComponent } from './referral-promotion-card.component';
import { FakeNavController } from '../../../../../../testing/fakes/nav-controller.fake.spec';
import { By } from '@angular/platform-browser';
import { TrackClickDirectiveTestHelper } from '../../../../../../testing/track-click-directive-test.helper';
import { TranslateModule } from '@ngx-translate/core';
import { FakeTrackClickDirective } from '../../../../../../testing/fakes/track-click-directive.fake.spec';

fdescribe('ReferralPromotionCardComponent', () => {
  let component: ReferralPromotionCardComponent;
  let fixture: ComponentFixture<ReferralPromotionCardComponent>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<ReferralPromotionCardComponent>;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      TestBed.configureTestingModule({
        declarations: [ReferralPromotionCardComponent, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [{ provide: NavController, useValue: navControllerSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(ReferralPromotionCardComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to referrals page on button click', () => {
    fixture.debugElement.query(By.css('ion-button[name="Go To Referrals"]')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith('/referrals/summary');
  });

  it('should navigate to referrals page on card click', () => {
    fixture.debugElement.query(By.css('div[name="Go To Referrals"]')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith('/referrals/summary');
  });

  it('should call trackEvent on trackService when Go To Referrals link clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Go To Referrals');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
