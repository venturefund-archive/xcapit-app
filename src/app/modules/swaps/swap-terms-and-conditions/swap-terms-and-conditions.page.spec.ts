import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { IonicStorageService } from 'src/app/shared/services/ionic-storage/ionic-storage.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { defaultSwapsUrls } from '../swaps-routing.module';
import { SwapTermsAndConditionsPage } from './swap-terms-and-conditions.page';
import { LINKS } from 'src/app/config/static-links';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';

describe('SwapTermsAndConditionsPage', () => {
  let component: SwapTermsAndConditionsPage;
  let fixture: ComponentFixture<SwapTermsAndConditionsPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<SwapTermsAndConditionsPage>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let storageServiceSpy: jasmine.SpyObj<IonicStorageService>;
  let browserServiceSpy: jasmine.SpyObj<BrowserService>;


  beforeEach(waitForAsync(() => {
    fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      storageServiceSpy = jasmine.createSpyObj('IonicStorageService', {
        set: Promise.resolve(),
      });
      browserServiceSpy = jasmine.createSpyObj('BrowserService', {
        open: Promise.resolve(),
      });
    TestBed.configureTestingModule({
      declarations: [ SwapTermsAndConditionsPage, FakeTrackClickDirective ],
      imports: [IonicModule.forRoot(),TranslateModule.forRoot()],
      providers: [
        { provide: NavController, useValue: navControllerSpy },
        { provide: IonicStorageService, useValue: storageServiceSpy },
        { provide: BrowserService, useValue: browserServiceSpy }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SwapTermsAndConditionsPage);
    component = fixture.componentInstance;
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call appTrackEvent on trackService when ux_swap_terms_and_conditions is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_swap_terms_and_conditions');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should navigate and set storage when ux_swap_terms_and_conditions button is clicked', () => {
    fixture.debugElement.query(By.css('ion-button[name="ux_swap_terms_and_conditions"]')).nativeElement.click();
    fixture.detectChanges();
    expect(storageServiceSpy.set).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(defaultSwapsUrls.swapHome);
  });

  it('should navigate to back when Close Success button is clicked', () => {
    fixture.debugElement.query(By.css('ion-button[name="Close Success"]')).nativeElement.click();
    fixture.detectChanges();
    expect(navControllerSpy.back).toHaveBeenCalledTimes(1);
  });

  it('should activated ux_swap_terms_and_conditions button when checkbox is checked', async () => {
    fixture.debugElement
      .query(By.css("ion-checkbox[name='checkbox-condition']"))
      .triggerEventHandler('ionChange', { target: {} });
    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    const buttonEl = fixture.debugElement.query(By.css("ion-button[name='ux_swap_terms_and_conditions']"));
    expect(buttonEl.attributes['ng-reflect-disabled']).toBe('false');
  });

  it('should disabled button when checkbox is not checked', () => {
    const buttonEl = fixture.debugElement.query(By.css("ion-button[name='ux_swap_terms_and_conditions']"));
    expect(buttonEl.attributes['ng-reflect-disabled']).toBe('true');
  });

  it('should open browser in app when 1inch ToS is clicked', async () => {
    const labelEl = fixture.debugElement.query(By.css('ion-label[name="go_to_1inch_tos"]'));
    labelEl.nativeElement.click();
    expect(browserServiceSpy.open).toHaveBeenCalledWith({ url: LINKS.oneInchToS });
  });
});

