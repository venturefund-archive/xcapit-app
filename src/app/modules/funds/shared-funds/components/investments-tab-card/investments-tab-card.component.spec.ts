import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { InvestmentsTabCardComponent } from './investments-tab-card.component';

describe('InvestmentsTabCardComponent', () => {
  let component: InvestmentsTabCardComponent;
  let fixture: ComponentFixture<InvestmentsTabCardComponent>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<InvestmentsTabCardComponent>;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();

      TestBed.configureTestingModule({
        declarations: [InvestmentsTabCardComponent, FakeTrackClickDirective],
        imports: [TranslateModule.forRoot(), IonicModule.forRoot()],
        providers: [{ provide: NavController, useValue: navControllerSpy }],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(InvestmentsTabCardComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);

      component.optionName = 'test-option';
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to option page when Navigate to Option Button clicked', () => {
    component.ngOnInit();
    fixture.debugElement.query(By.css('ion-button[name="Navigate to Option"]')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/tabs/investments/test-option']);
  });

  it('should call trackEvent on trackService when Navigate to Option Button clicked', () => {
    component.ngOnInit();
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Navigate to Option');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });
});
