import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { StopLossTakeProfitSummaryComponent } from './stop-loss-take-profit-summary.component';
import { By } from '@angular/platform-browser';
import { FakeTrackClickDirective } from '../../../../../../testing/fakes/track-click-directive.fake.spec';
import { FakeNavController } from '../../../../../../testing/fakes/nav-controller.fake.spec';
import { TrackClickDirectiveTestHelper } from '../../../../../../testing/track-click-directive-test.helper';
import { TranslateModule } from '@ngx-translate/core';

fdescribe('StopLossTakeProfitSummaryComponent', () => {
  let component: StopLossTakeProfitSummaryComponent;
  let fixture: ComponentFixture<StopLossTakeProfitSummaryComponent>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<StopLossTakeProfitSummaryComponent>;
  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();

      TestBed.configureTestingModule({
        declarations: [StopLossTakeProfitSummaryComponent, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [{ provide: NavController, useValue: navControllerSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(StopLossTakeProfitSummaryComponent);
      component = fixture.componentInstance;
      component.stopLoss = 10;
      component.takeProfit = 15;
      component.isTrailing = false;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to change stop loss on button click', () => {
    fixture.debugElement.query(By.css('ion-button[name="Change Stop Loss"]')).nativeElement.click();
    expect(navControllerSpy.navigateBack).toHaveBeenCalledOnceWith('funds/fund-stop-loss');
  });

  it('should call trackEvent on trackService when Change Stop Loss clicked', async () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Change Stop Loss');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should navigate to change take profit on button click', () => {
    fixture.debugElement.query(By.css('ion-button[name="Change Take Profit"]')).nativeElement.click();
    expect(navControllerSpy.navigateBack).toHaveBeenCalledOnceWith('funds/fund-take-profit');
  });

  it('should call trackEvent on trackService when Change Take Profit clicked', async () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Change Take Profit');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
