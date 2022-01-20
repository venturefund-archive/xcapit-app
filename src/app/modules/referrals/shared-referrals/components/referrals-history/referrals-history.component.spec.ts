import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ReferralsHistoryComponent } from './referrals-history.component';
import { By } from '@angular/platform-browser';
import { ReferralDetailComponent } from '../referral-detail/referral-detail.component';
import { TranslateModule } from '@ngx-translate/core';

const referrals = {
  first_order: { with_wallet: 4, without_wallet: 5, reward: 1 },
  second_order: { with_wallet: 2, without_wallet: 6, reward: 0.5 },
};

describe('ReferralsHistoryComponent', () => {
  let component: ReferralsHistoryComponent;
  let fixture: ComponentFixture<ReferralsHistoryComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ReferralsHistoryComponent, ReferralDetailComponent],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(ReferralsHistoryComponent);
      component = fixture.componentInstance;
      component.referrals = referrals;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be rendered properly', async () => {
    await fixture.whenRenderingDone();

    const referralsEl = fixture.debugElement.query(By.css('.rh__summary__referrals'));
    expect(referralsEl.nativeElement.innerHTML).toContain('referrals.referrals_history.referrals_title');
    expect(referralsEl.nativeElement.innerHTML).toContain('referrals.referrals_history.referrals_subtitle');

    const firstOrderEl = fixture.debugElement.query(By.css('.rh__summary__first-order'));
    expect(firstOrderEl.nativeElement.innerHTML).toContain('referrals.referrals_history.first_order_title');
    expect(firstOrderEl.nativeElement.innerHTML).toContain('referrals.referrals_history.first_order_subtitle');

    const secondOrderEl = fixture.debugElement.query(By.css('.rh__summary__second-order'));
    expect(secondOrderEl.nativeElement.innerHTML).toContain('referrals.referrals_history.second_order_title');
    expect(secondOrderEl.nativeElement.innerHTML).toContain('referrals.referrals_history.second_order_subtitle');
  });
});
