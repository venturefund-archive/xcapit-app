import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { LINKS } from 'src/app/config/static-links';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';

import { AccountRecoveryPage } from './account-recovery.page';

describe('AccountRecoveryPage', () => {
  let component: AccountRecoveryPage;
  let fixture: ComponentFixture<AccountRecoveryPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<AccountRecoveryPage>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let browserServiceSpy: jasmine.SpyObj<BrowserService>;

  beforeEach(waitForAsync(() => {
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();

    browserServiceSpy = jasmine.createSpyObj('BrowserService', {
      open: Promise.resolve(),
    });

    TestBed.configureTestingModule({
      declarations: [AccountRecoveryPage, FakeTrackClickDirective],
      providers: [
        { provide: NavController, useValue: navControllerSpy },
        { provide: BrowserService, useValue: browserServiceSpy },
      ],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountRecoveryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open browser in app when go_to_privacy_policy is clicked', async () => {
    const labelEl = fixture.debugElement.query(By.css('ion-button[name="go_to_privacy_policy"]'));
    const directive = trackClickDirectiveHelper.getDirective(labelEl);
    const spy = spyOn(directive, 'clickEvent');

    labelEl.nativeElement.click();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(browserServiceSpy.open).toHaveBeenCalledWith({ url: LINKS.xcapitPrivacyPolicy });
  });

  it('should render properly', () => {
    const helpItemCardsEl = fixture.debugElement.queryAll(By.css('app-help-item-card'));
    const informationAlertEl = fixture.debugElement.query(By.css('div.ar__content__alert app-information-alert'));

    expect(helpItemCardsEl.length).toEqual(2);
    expect(informationAlertEl).toBeTruthy();
  });

  it('should call trackEvent on trackService when ux_go_to_help clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_go_to_help');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');

    el.nativeElement.click();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/support/options');
  });
});
