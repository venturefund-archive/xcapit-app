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
    expect(firstOrderEl.nativeElement.innerHTML).toContain('4');
    expect(firstOrderEl.nativeElement.innerHTML).toContain('referrals.referrals_pending.first_order_title');
    expect(firstOrderEl.nativeElement.innerHTML).toContain('referrals.referrals_pending.first_order_subtitle');

    const secondOrderEl = fixture.debugElement.query(By.css('.rp__summary__second-order'));
    expect(secondOrderEl.nativeElement.innerHTML).toContain('2');
    expect(secondOrderEl.nativeElement.innerHTML).toContain('referrals.referrals_pending.second_order_title');
    expect(secondOrderEl.nativeElement.innerHTML).toContain('referrals.referrals_pending.second_order_subtitle');

    const totalEl = fixture.debugElement.query(By.css('.rp__total'));
    expect(totalEl.nativeElement.innerHTML).toContain('5');
    expect(totalEl.nativeElement.innerHTML).toContain('referrals.referrals_pending.total_title');

    const claimButtonEl = fixture.debugElement.query(By.css('.rp__claim ion-button'));
    expect(claimButtonEl.nativeElement.innerHTML).toContain('referrals.referrals_pending.claim_button');
    expect(claimButtonEl.nativeElement.attributes['ng-reflect-disabled']).toBeTruthy();
  });

  it('should call trackEvent on trackService when Claim button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Claim');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
