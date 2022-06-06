import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { InvestorTestCardsComponent } from './investor-test-cards.component';

describe('InvestorTestCardsComponent', () => {
  let component: InvestorTestCardsComponent;
  let fixture: ComponentFixture<InvestorTestCardsComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<InvestorTestCardsComponent>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let storageServiceSpy: jasmine.SpyObj<IonicStorageService>;
  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      storageServiceSpy = jasmine.createSpyObj('IonicStorageService', {
        get: null
      });
      TestBed.configureTestingModule({
        declarations: [InvestorTestCardsComponent, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [
          {
            provide: NavController,
            useValue: navControllerSpy,
          },
          {
            provide: IonicStorageService,
            useValue: storageServiceSpy,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(InvestorTestCardsComponent);
      component = fixture.componentInstance;
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not render properly badge if testAvailable or manualTestAvailable are true', async () => {
    component.testAvailable = true;
    component.optionsTestAvailable = true;
    fixture.detectChanges();
    const badgeEl = fixture.debugElement.query(By.css('.badge'));
    expect(badgeEl).toBeNull();
  });

  it('should render properly badge if testAvailable or manualTestAvailable are false', async () => {
    component.optionsTestAvailable = false;
    component.testAvailable = false;
    fixture.detectChanges();
    const badgeEl = fixture.debugElement.query(By.css('.badge'));
    expect(badgeEl.nativeNode.innerHTML).toContain('home.home_page.test_investor_cards.badge_text');
  });

  it('should navigate to option select test page when options-test-card Div is clicked and optionsTestAvailable is true', async () => {
    component.optionsTestAvailable = true;
    const clickeableDiv = fixture.debugElement.query(By.css('div[name="Go Investor Options"]'));
    clickeableDiv.nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['wealth-management/investor-test-options']);
  });

  it('should navigate to education tests page when testAvailable is true and user did not make introduction', async () => {
    component.testAvailable = true;
    const clickeableDiv = fixture.debugElement.query(By.css('div[name="ux_education_go"]'));
    clickeableDiv.nativeElement.click();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['financial-education/introduction/financial-freedom']);
  });

  it('should not navigate to education tests page when testAvailable is true and user make introduction', async () => {
    component.testAvailable = true;
    storageServiceSpy.get.and.resolveTo(true);
    const clickeableDiv = fixture.debugElement.query(By.css('div[name="ux_education_go"]'));
    clickeableDiv.nativeElement.click();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['financial-education/home']);
  });


});
