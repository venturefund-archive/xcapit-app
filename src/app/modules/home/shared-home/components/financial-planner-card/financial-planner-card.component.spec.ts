import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { FinancialPlannerCardComponent } from './financial-planner-card.component';
import { By } from '@angular/platform-browser';
import { FakeNavController } from '../../../../../../testing/fakes/nav-controller.fake.spec';
import { TranslateModule } from '@ngx-translate/core';

describe('FinancialPlannerCardComponent', () => {
  let component: FinancialPlannerCardComponent;
  let fixture: ComponentFixture<FinancialPlannerCardComponent>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();

      TestBed.configureTestingModule({
        declarations: [FinancialPlannerCardComponent],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [{ provide: NavController, useValue: navControllerSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(FinancialPlannerCardComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly', () => {
    const titleEl = fixture.debugElement.query(By.css('ion-text.fpc__content__body__title'));
    const descriptionEl = fixture.debugElement.query(By.css('ion-text.fpc__content__body__description'));
    expect(titleEl.nativeElement.innerHTML).toContain('home.shared.financial_planner_card.title');
    expect(descriptionEl.nativeElement.innerHTML).toContain('home.shared.financial_planner_card.description');
  });

  it('should navigate to financial planner when card is clicked', () => {
    fixture.debugElement.query(By.css('div.fpc')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/financial-planner/information');
  });
});
