import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { InvestorTestCardsComponent } from './investor-test-cards.component';

describe('InvestorTestCardsComponent', () => {
  let component: InvestorTestCardsComponent;
  let fixture: ComponentFixture<InvestorTestCardsComponent>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let remoteConfigSpy: jasmine.SpyObj<RemoteConfigService>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<InvestorTestCardsComponent>;

  beforeEach(waitForAsync(() => {
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    remoteConfigSpy = jasmine.createSpyObj('RemoteConfigService', { getFeatureFlag: false });
    TestBed.configureTestingModule({
      declarations: [InvestorTestCardsComponent, FakeTrackClickDirective],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        {
          provide: NavController,
          useValue: navControllerSpy,
        },
        {
          provide: RemoteConfigService,
          useValue: remoteConfigSpy,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InvestorTestCardsComponent);
    component = fixture.componentInstance;
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    fixture.detectChanges();
  }));

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

  it('should not render properly badge if education is true', async () => {
    component.optionsTestAvailable = false;
    remoteConfigSpy.getFeatureFlag.and.returnValue(true);

    component.ngOnInit();
    fixture.detectChanges();

    const badgeEl = fixture.debugElement.query(By.css('.badge'));
    expect(badgeEl.nativeNode.innerHTML).toContain('home.home_page.test_investor_cards.badge_text');
  });

  it('should render properly badge if ff education is false', async () => {
    component.optionsTestAvailable = true;

    component.ngOnInit();
    fixture.detectChanges();

    const badgeEl = fixture.debugElement.query(By.css('.badge'));
    expect(badgeEl.nativeNode.innerHTML).toContain('home.home_page.test_investor_cards.badge_text');
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
    const clickeableDiv = fixture.debugElement.query(By.css('div[name="ux_go_to_investor_profile"]'));
    clickeableDiv.nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['wealth-management/investor-test-options']);
  });

  it('should navigate to financial education when financial education is available', async () => {
    component.testAvailable = true;
    const clickeableDiv = fixture.debugElement.query(By.css('div[name="ux_go_to_education"]'));
    clickeableDiv.nativeElement.click();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['tabs/financial-education']);
  });

  it('should call appTrackEvent on trackService when ux_go_to_investor_profile is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('div', 'ux_go_to_investor_profile');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call appTrackEvent on trackService when ux_go_to_education is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('div', 'ux_go_to_education');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
