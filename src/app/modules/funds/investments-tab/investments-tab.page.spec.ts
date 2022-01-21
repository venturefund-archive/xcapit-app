import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { InvestmentsTabPage } from './investments-tab.page';

describe('InvestmentsTabPage', () => {
  let component: InvestmentsTabPage;
  let fixture: ComponentFixture<InvestmentsTabPage>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<InvestmentsTabPage>;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();

      TestBed.configureTestingModule({
        declarations: [InvestmentsTabPage, FakeTrackClickDirective],
        imports: [TranslateModule.forRoot(), IonicModule.forRoot()],
        providers: [{ provide: NavController, useValue: navControllerSpy }],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(InvestmentsTabPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to FAQs Page when How Investments Work Button clicked', () => {
    fixture.debugElement.query(By.css('ion-button[name="How Investments Work"]')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/support/options']);
  });

  it('should call trackEvent on trackService when How Investments Work Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'How Investments Work');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });
});
