import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { ErrorInvestmentPage } from './error-investment.page';

describe('ErrorInvestmentPage', () => {
  let component: ErrorInvestmentPage;
  let fixture: ComponentFixture<ErrorInvestmentPage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<ErrorInvestmentPage>;

  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      TestBed.configureTestingModule({
        declarations: [ErrorInvestmentPage, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [{ provide: NavController, useValue: navControllerSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(ErrorInvestmentPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);

    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when Close is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Close');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Try Again is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Try Again');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });

  it('should navigate to urlClose when Close is clicked', () => {
    const closeButton = fixture.debugElement.query(By.css("ion-button[name='Close']"));
    closeButton.nativeElement.click();
    expect(navControllerSpy.navigateBack).toHaveBeenCalledOnceWith(['tabs/home']);
  });

  it('should navigate to urlPage when Try Again is clicked', () => {
    const pageButton = fixture.debugElement.query(By.css("ion-button[name='Try Again']"));
    pageButton.nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['tabs/investments/defi'], {replaceUrl : true});
  });
});
