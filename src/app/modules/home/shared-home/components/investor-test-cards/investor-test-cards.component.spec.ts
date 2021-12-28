import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { InvestorTestCardsComponent } from './investor-test-cards.component';

describe('InvestorTestCardsComponent', () => {
  let component: InvestorTestCardsComponent;
  let fixture: ComponentFixture<InvestorTestCardsComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<InvestorTestCardsComponent>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      TestBed.configureTestingModule({
        declarations: [InvestorTestCardsComponent, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [
          {
            provide: NavController,
            useValue: navControllerSpy,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(InvestorTestCardsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not render badge if comingSoon is false', async () => {
    component.comingSoon = false;
    fixture.detectChanges();
    const badgeEl = fixture.debugElement.query(By.css('.badge'));
    expect(badgeEl).toBeNull();
  });

  it('should render badge if comingSoon is true', async () => {
    component.comingSoon = true;
    fixture.detectChanges();
    const badgeEl = fixture.debugElement.query(By.css('.badge'));
    expect(badgeEl.nativeNode.innerHTML).toContain('home.home_page.test_investor_cards.badge_text');
  });

  it('should navigate to investor Test when take_test_card Div is clicked', async () => {
    component.comingSoon = false;
    const clickeableDiv = fixture.debugElement.query(By.css('div[name="Go Investor Test"]'));
    clickeableDiv.nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['']);
  });

  it('should navigate to investor Test when manual_test_card Div is clicked', async () => {
    component.comingSoon = false;
    const clickeableDiv = fixture.debugElement.query(By.css('div[name="Go Investor Profiles"]'));
    clickeableDiv.nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['wealth-management/about-investor-profiles']);
  });
});
