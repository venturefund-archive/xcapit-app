import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';

import { HowCreateBinanceAccountPage } from './how-create-binance-account.page';

describe('HowCreateBinanceAccountPage', () => {
  let component: HowCreateBinanceAccountPage;
  let fixture: ComponentFixture<HowCreateBinanceAccountPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<HowCreateBinanceAccountPage>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: any;
  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController({});
      navControllerSpy = fakeNavController.createSpy();
      TestBed.configureTestingModule({
        declarations: [HowCreateBinanceAccountPage, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot(), HttpClientTestingModule],
        providers: [{ provide: NavController, useValue: navControllerSpy }],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(HowCreateBinanceAccountPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  beforeEach(() => {});
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when back to home is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Have A Binance Account');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });

  it('should call navigateForward in goToTutorialAPIKey ', () => {
    fixture.debugElement.query(By.css('ion-button[name="Have A Binance Account"]')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['/apikeys/tutorial/apikeys']);
  });
});
