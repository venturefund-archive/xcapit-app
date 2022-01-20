import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ReferralsPendingComponent } from './referrals-pending.component';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirectiveTestHelper } from '../../../../../../testing/track-click-directive-test.helper';
import { FakeTrackClickDirective } from '../../../../../../testing/fakes/track-click-directive.fake.spec';
import { ReferralDetailComponent } from '../referral-detail/referral-detail.component';

const referrals = {
  first_order: { with_wallet: 4, without_wallet: 5, reward: 1 },
  second_order: { with_wallet: 2, without_wallet: 6, reward: 0.5 },
};

describe('ReferralsPendingComponent', () => {
  let component: ReferralsPendingComponent;
  let fixture: ComponentFixture<ReferralsPendingComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<ReferralsPendingComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ReferralsPendingComponent, FakeTrackClickDirective, ReferralDetailComponent],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(ReferralsPendingComponent);
      component = fixture.componentInstance;
      component.referrals = referrals;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be rendered properly', async () => {
    await fixture.whenRenderingDone();

    const firstOrderEl = fixture.debugElement.query(By.css('.rp__summary__first-order'));
    expect(firstOrderEl.nativeElement.innerHTML).toContain('referrals.referrals_pending.first_order_title');
    expect(firstOrderEl.nativeElement.innerHTML).toContain('referrals.referrals_pending.first_order_subtitle');

  });

});
