import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { UxCardInfoRobotComponent } from './ux-card-info-robot.component';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';
import { BrowserService } from '../../services/browser/browser.service';

describe('UxCardInfoRobotComponent', () => {
  let component: UxCardInfoRobotComponent;
  let fixture: ComponentFixture<UxCardInfoRobotComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<UxCardInfoRobotComponent>;
  let browserServiceSpy: jasmine.SpyObj<BrowserService>;
  beforeEach(
    waitForAsync(() => {
      browserServiceSpy = jasmine.createSpyObj('BrowserService', { open: Promise.resolve() });
      TestBed.configureTestingModule({
        declarations: [UxCardInfoRobotComponent, FakeTrackClickDirective, DummyComponent],
        imports: [HttpClientTestingModule, TranslateModule.forRoot(), IonicModule],
        providers: [{ provide: BrowserService, useValue: browserServiceSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(UxCardInfoRobotComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call window.open when moreInfo is called', () => {
    component.moreInfo();
    expect(browserServiceSpy.open).toHaveBeenCalledOnceWith({ url: 'https://www.info.xcapit.com/' });
  });

  it('should call trackEvent on trackService when More Info button clicked', () => {
    spyOn(window, 'open');
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'More Info');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
