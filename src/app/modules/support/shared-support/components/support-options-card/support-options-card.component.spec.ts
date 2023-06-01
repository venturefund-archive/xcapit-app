import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { SUPPORT_OPTIONS } from '../../constants/support-options';

import { SupportOptionsCardComponent } from './support-options-card.component';
import { BrowserService } from 'src/app/shared/services/browser/browser.service';
import { By } from '@angular/platform-browser';

fdescribe('SupportOptionsCardComponent', () => {
  let component: SupportOptionsCardComponent;
  let fixture: ComponentFixture<SupportOptionsCardComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<SupportOptionsCardComponent>;
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
      declarations: [SupportOptionsCardComponent, FakeTrackClickDirective],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: NavController, useValue: navControllerSpy },
        { provide: BrowserService, useValue: browserServiceSpy },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SupportOptionsCardComponent);
    component = fixture.componentInstance;
    component.option = SUPPORT_OPTIONS[3];
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when Select clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Select');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should navigate to twoPi page on browser when link is clicked', async () => {
    component.ngOnInit();
    fixture.detectChanges();
    await Promise.all([fixture.whenRenderingDone(), fixture.whenStable()]);
    fixture.debugElement.query(By.css('.button ion-button')).nativeElement.click();
    expect(browserServiceSpy.open).toHaveBeenCalledOnceWith({ url: component.option.route });
  });
});
