import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReferralDetailComponent } from './referral-detail.component';
import { By } from '@angular/platform-browser';

describe('ReferralDetailComponent', () => {
  let component: ReferralDetailComponent;
  let fixture: ComponentFixture<ReferralDetailComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ReferralDetailComponent],
        imports: [IonicModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(ReferralDetailComponent);
      component = fixture.componentInstance;
      component.title = 'testTitle';
      component.subtitle = 'testSubtitle';
      component.quantity = 10;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be rendered properly', async () => {
    await fixture.whenRenderingDone();

    const titleEl = fixture.debugElement.query(By.css('.rd__title'));
    expect(titleEl.nativeElement.innerHTML).toContain('testTitle');

    const subtitleEl = fixture.debugElement.query(By.css('.rd__subtitle'));
    expect(subtitleEl.nativeElement.innerHTML).toContain('testSubtitle');

    const rewardEl = fixture.debugElement.query(By.css('.rd__reward'));
    expect(rewardEl).not.toBeTruthy();
  });

  it('should render reward when reward is set', async () => {
    component.reward = 1;
    fixture.detectChanges();
    await fixture.whenRenderingDone();

    const rewardElWithReward = fixture.debugElement.query(By.css('.rd__reward'));
    expect(rewardElWithReward.nativeElement.innerHTML).toContain('10');
  });
});
