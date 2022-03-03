import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { ChooseInvestorProfileCardComponent } from './choose-investor-profile-card.component';

describe('ChooseInvestorProfileCardComponent', () => {
  let component: ChooseInvestorProfileCardComponent;
  let fixture: ComponentFixture<ChooseInvestorProfileCardComponent>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<ChooseInvestorProfileCardComponent>;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();


      TestBed.configureTestingModule({
        declarations: [ChooseInvestorProfileCardComponent, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot(), HttpClientTestingModule],
        providers: [
          { provide: NavController, useValue: navControllerSpy }
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(ChooseInvestorProfileCardComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change text if user took investor test', () => {
    component.hasDoneInvestorTest = true;
    fixture.detectChanges();
    const title = fixture.debugElement.query(By.css('ion-text[name="Title"]')).nativeElement.innerHTML;
    const description = fixture.debugElement.query(By.css('ion-text[name="Description"]')).nativeElement.innerHTML;
    const primaryButton = fixture.debugElement.query(By.css('ion-button[name="Primary Button"]')).nativeElement.innerHTML;
    const secondaryButton = fixture.debugElement.query(By.css('ion-button[name="Secondary Button"]')).nativeElement.innerHTML;
    expect(title).toContain('defi_investments.defi_investment_products.choose_investor_profile.complete_test.title');
    expect(description).toContain('defi_investments.defi_investment_products.choose_investor_profile.complete_test.description');
    expect(primaryButton).toContain('defi_investments.defi_investment_products.choose_investor_profile.complete_test.button_primary');
    expect(secondaryButton).toContain('defi_investments.defi_investment_products.choose_investor_profile.complete_test.button_secondary');
  });

  it('should navigate to choose investor profile page if user took investor test on Primary Button click', async () => {
    component.hasDoneInvestorTest = true;
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="Primary Button"]')).nativeElement.click();
    await fixture.whenStable();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/wealth-management/about-investor-profiles']);
  });

  it('should navigate to investor test first question if user took investor test on Secondary Button click', async () => {
    component.hasDoneInvestorTest = true;
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="Secondary Button"]')).nativeElement.click();
    await fixture.whenStable();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/wealth-management/investor-test', 'defi']);
  });

  it('should change text if user did not take investor test', () => {
    component.hasDoneInvestorTest = false;
    fixture.detectChanges();
    const title = fixture.debugElement.query(By.css('ion-text[name="Title"]')).nativeElement.innerHTML;
    const description = fixture.debugElement.query(By.css('ion-text[name="Description"]')).nativeElement.innerHTML;
    const primaryButton = fixture.debugElement.query(By.css('ion-button[name="Primary Button"]')).nativeElement.innerHTML;
    const secondaryButton = fixture.debugElement.query(By.css('ion-button[name="Secondary Button"]')).nativeElement.innerHTML;
    expect(title).toContain('defi_investments.defi_investment_products.choose_investor_profile.incomplete_test.title');
    expect(description).toContain('defi_investments.defi_investment_products.choose_investor_profile.incomplete_test.description');
    expect(primaryButton).toContain('defi_investments.defi_investment_products.choose_investor_profile.incomplete_test.button_primary');
    expect(secondaryButton).toContain('defi_investments.defi_investment_products.choose_investor_profile.incomplete_test.button_secondary');
  });

  it('should navigate to investor test first question if user did not take investor test on Primary Button click', async () => {
    component.hasDoneInvestorTest = false;
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="Primary Button"]')).nativeElement.click();
    await fixture.whenStable();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/wealth-management/investor-test', 'defi']);
  });

  it('should navigate to choose investor profile page if user did not take investor test on Secondary Button click', async () => {
    component.hasDoneInvestorTest = false;
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-button[name="Secondary Button"]')).nativeElement.click();
    await fixture.whenStable();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/wealth-management/about-investor-profiles']);
  });

  it('should call trackEvent on trackService when Primary Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Primary Button');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Secondary Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Secondary Button');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
