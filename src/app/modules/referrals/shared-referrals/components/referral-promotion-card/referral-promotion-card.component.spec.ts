import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { ReferralPromotionCardComponent } from './referral-promotion-card.component';
import { FakeNavController } from '../../../../../../testing/fakes/nav-controller.fake.spec';
import { By } from '@angular/platform-browser';
import { TrackClickDirectiveTestHelper } from '../../../../../../testing/track-click-directive-test.spec';
import { TranslateModule } from '@ngx-translate/core';
import { FakeTrackClickDirective } from '../../../../../../testing/fakes/track-click-directive.fake.spec';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';
import { FakeFeatureFlagDirective } from 'src/testing/fakes/feature-flag-directive.fake.spec';

describe('ReferralPromotionCardComponent', () => {
  let component: ReferralPromotionCardComponent;
  let fixture: ComponentFixture<ReferralPromotionCardComponent>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<ReferralPromotionCardComponent>;
  let remoteConfigServiceSpy: jasmine.SpyObj<RemoteConfigService>;
  beforeEach(
    waitForAsync(() => {
      remoteConfigServiceSpy = jasmine.createSpyObj('RemoteConfigService', { getString: '' });
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      TestBed.configureTestingModule({
        declarations: [ReferralPromotionCardComponent, FakeTrackClickDirective, FakeFeatureFlagDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [{ provide: NavController, useValue: navControllerSpy }, { provide: RemoteConfigService, useValue: remoteConfigServiceSpy }],
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


  it('should navigate to page setted by remote config service on card click', () => {
    remoteConfigServiceSpy.getString.and.returnValue('/referrals/summary');
    fixture.detectChanges();
    fixture.debugElement.query(By.css('div[name="Go To Referrals"]')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/referrals/summary');
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
