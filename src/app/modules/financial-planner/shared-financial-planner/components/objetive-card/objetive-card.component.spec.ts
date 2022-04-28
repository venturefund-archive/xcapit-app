import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { ObjetiveCardComponent } from './objetive-card.component';

const dataTest = {
  category: 'purchases',
  expenses: 700,
  income: 1000,
  name: 'Auto',
  necessaryAmount: 2500,
};

describe('ObjetiveCardComponent', () => {
  let component: ObjetiveCardComponent;
  let fixture: ComponentFixture<ObjetiveCardComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<ObjetiveCardComponent>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();

      TestBed.configureTestingModule({
        declarations: [ObjetiveCardComponent, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [{ provide: NavController, useValue: navControllerSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(ObjetiveCardComponent);
      component = fixture.componentInstance;
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
      component.data = dataTest;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should capitalize the first letter of category', () => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.formattedCategory).toEqual('Purchases');
  });

  it('should set correct url icon on ngOnInit', () => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.icon).toEqual('assets/img/financial-planner/categories/purchases.svg');
  });

  it('should call trackEvent on trackService when ux_financial_planner_edit button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_financial_planner_edit');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should navigate to new objetive page when button ux_financial_planner_edit is clicked', () => {
    fixture.debugElement.query(By.css('ion-button[name="ux_financial_planner_edit"]')).nativeElement.click();
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['financial-planner/new-objetive']);
  });

  it('should render properly', () => {
    const iconEl = fixture.debugElement.query(By.css('div.body__icon'));
    const titleEl = fixture.debugElement.query(By.css('div.body__header__title'));
    const categoryEl = fixture.debugElement.query(By.css('div.body__header__category'));
    const textEl = fixture.debugElement.query(By.css('div.result__objetive'));
    const amountEl = fixture.debugElement.query(By.css('div.result__necessary-amount'));
    expect(iconEl.nativeElement.innerHTML).toBeTruthy();
    expect(titleEl.nativeElement.innerHTML).toContain(dataTest.name);
    expect(categoryEl.nativeElement.innerHTML).toContain(component.formattedCategory);
    expect(textEl.nativeElement.innerHTML).toContain('financial_planner.result_objetive.objetive');
    expect(amountEl.nativeElement.innerHTML).toContain(dataTest.necessaryAmount);
  });
});
