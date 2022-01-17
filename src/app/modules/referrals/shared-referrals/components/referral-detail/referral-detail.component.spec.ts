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

    const quantityEl = fixture.debugElement.query(By.css('.rd__quantity'));
    expect(quantityEl).toBeTruthy();
  });
});
