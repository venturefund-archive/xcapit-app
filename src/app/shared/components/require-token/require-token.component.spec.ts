import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RequireTokenComponent } from './require-token.component';
import { BrowserService } from '../../services/browser/browser.service';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from '../../../../testing/track-click-directive-test.spec';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';

describe('RequireTokenComponent', () => {
  let component: RequireTokenComponent;
  let fixture: ComponentFixture<RequireTokenComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<RequireTokenComponent>;
  let browserServiceSpy: jasmine.SpyObj<BrowserService>;

  beforeEach(waitForAsync(() => {
    browserServiceSpy = jasmine.createSpyObj('BrowserService', {
      open: Promise.resolve(),
    });
    TestBed.configureTestingModule({
      declarations: [RequireTokenComponent, FakeTrackClickDirective],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [{ provide: BrowserService, useValue: browserServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(RequireTokenComponent);
    component = fixture.componentInstance;
    component.buttonEventName = 'test_event_button_name';
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open browser when button clicked', fakeAsync(() => {
    fixture.debugElement.query(By.css('ion-button')).nativeElement.click();
    tick();
    expect(browserServiceSpy.open).toHaveBeenCalledTimes(1);
  }));

  it('should call trackEvent on trackService when Require token button clicked', () => {
    const el = fixture.debugElement.query(By.css('ion-button'));
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
