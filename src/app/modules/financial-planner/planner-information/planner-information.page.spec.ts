import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';

import { PlannerInformationPage } from './planner-information.page';

describe('PlannerInformationPage', () => {
  let component: PlannerInformationPage;
  let fixture: ComponentFixture<PlannerInformationPage>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<PlannerInformationPage>;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      TestBed.configureTestingModule({
        declarations: [PlannerInformationPage, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [{ provide: NavController, useValue: navControllerSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(PlannerInformationPage);
      component = fixture.componentInstance;
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly', () => {
    const imgEl = fixture.debugElement.query(By.css('.fpi__content__img img'));
    expect(imgEl.attributes.src).toContain('assets/img/financial-planner/goal.svg');

    const titleEl = fixture.debugElement.query(By.css('.fpi__content__title ion-text'));
    expect(titleEl.nativeElement.innerHTML).toContain('financial_planner.planner_information.title');

    const [textItem1, textItem2, textItem3] = fixture.debugElement.queryAll(
      By.css('div.fpi__content__items__item ion-text')
    );

    expect(textItem1.nativeElement.innerHTML).toContain('financial_planner.planner_information.item_1');
    expect(textItem2.nativeElement.innerHTML).toContain('financial_planner.planner_information.item_2');
    expect(textItem3.nativeElement.innerHTML).toContain('financial_planner.planner_information.item_3');

    const [imgItem1, imgItem2, imgItem3] = fixture.debugElement.queryAll(By.css('div.fpi__content__items__item img'));

    expect(imgItem1.attributes.src).toContain('assets/img/financial-planner/item_1.svg');
    expect(imgItem2.attributes.src).toContain('assets/img/financial-planner/item_2.svg');
    expect(imgItem3.attributes.src).toContain('assets/img/financial-planner/item_3.svg');
  });

  it('should call appTrackEvent on trackService when go_to_planner is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'go_to_planner');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should navigate to planner when button is clicked', () => {
    fixture.debugElement.query(By.css('.fpi__button ion-button')).nativeElement.click();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('');
  });
});
