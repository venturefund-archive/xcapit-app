import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';

import { StartInvestingComponent } from './start-investing.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FakeNavController } from '../../../../../../testing/fakes/nav-controller.fake.spec';
import { TrackClickDirectiveTestHelper } from '../../../../../../testing/track-click-directive-test.helper';
import { FakeTrackClickDirective } from '../../../../../../testing/fakes/track-click-directive.fake.spec';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('StartInvestingComponent', () => {
  let component: StartInvestingComponent;
  let fixture: ComponentFixture<StartInvestingComponent>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<StartInvestingComponent>;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();

      TestBed.configureTestingModule({
        declarations: [StartInvestingComponent, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [TranslateService, { provide: NavController, useValue: navControllerSpy }],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(StartInvestingComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go to Coming Soon Page when user clicks Start Investing Button', () => {
    fixture.debugElement.query(By.css('ion-button[name="Start Investing Button"]')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['tabs/investments/defi']);
  });

  it('should call trackEvent on trackService when Start Investing Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Start Investing Button');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
