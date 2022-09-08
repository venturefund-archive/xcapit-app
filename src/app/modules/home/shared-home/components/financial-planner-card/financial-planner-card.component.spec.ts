import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { FinancialPlannerCardComponent } from './financial-planner-card.component';
import { By } from '@angular/platform-browser';
import { FakeNavController } from '../../../../../../testing/fakes/nav-controller.fake.spec';
import { TranslateModule } from '@ngx-translate/core';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';

describe('FinancialPlannerCardComponent', () => {
  let component: FinancialPlannerCardComponent;
  let fixture: ComponentFixture<FinancialPlannerCardComponent>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<FinancialPlannerCardComponent>;


  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();

      TestBed.configureTestingModule({
        declarations: [FinancialPlannerCardComponent, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [{ provide: NavController, useValue: navControllerSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(FinancialPlannerCardComponent);
      component = fixture.componentInstance;
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly', () => {
    const titleEl = fixture.debugElement.query(By.css('div.fpc__content__body__title'));
    const descriptionEl = fixture.debugElement.query(By.css('div.fpc__content__body__description'));
    expect(titleEl.nativeElement.innerHTML).toContain('home.shared.financial_planner_card.title');
    expect(descriptionEl.nativeElement.innerHTML).toContain('home.shared.financial_planner_card.description');
  });

  it('should navigate to financial planner when card is clicked', () => {
    fixture.debugElement.query(By.css('div.fpc')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/financial-planner/information');
  });

  it('should call appTrackEvent on trackService when ux_go_to_planer is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('div', 'ux_go_to_planer');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
