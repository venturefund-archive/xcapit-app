import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { AppStorageService } from 'src/app/shared/services/app-storage/app-storage.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { ResultObjetivePage } from './result-objetive.page';
import { By } from '@angular/platform-browser';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';

describe('ResultObjetivePage', () => {
  let component: ResultObjetivePage;
  let fixture: ComponentFixture<ResultObjetivePage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<ResultObjetivePage>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;
  let appStorageServiceSpy: jasmine.SpyObj<AppStorageService>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;
  
  const dataTest = {
    category: 'purchases',
    expenses: 700,
    income: 1000,
    name: 'Auto',
    necessaryAmount: 2500,
    icon: 'assets/img/financial-planner/categories/purchases.svg',
  };
  
  const productTest = {
    id: 'polygon_usdc',
    title: 'USDC',
    description: 'USD Coin',
    img: 'assets/img/coins/USDC.png',
    apy: 55.583791242926985,
    weeks: 0,
  };

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      fakeModalController = new FakeModalController();
      modalControllerSpy = fakeModalController.createSpy();
      appStorageServiceSpy = jasmine.createSpyObj('AppStorageService', {
        get: dataTest,
      });

      TestBed.configureTestingModule({
        declarations: [ResultObjetivePage, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot(), HttpClientTestingModule],
        providers: [
          { provide: NavController, useValue: navControllerSpy },
          { provide: AppStorageService, useValue: appStorageServiceSpy },
          { provide: ModalController, useValue: modalControllerSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(ResultObjetivePage);
      component = fixture.componentInstance;
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
      component.name = dataTest.name;
      component.necessaryAmount = dataTest.necessaryAmount;
      component.category = dataTest.category;
      component.icon = dataTest.icon;
      component.isOpen = false;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get data planner of storage', async () => {
    component.ionViewDidEnter();
    fixture.detectChanges();
    await Promise.all([fixture.whenStable(), fixture.whenRenderingDone()]);
    expect(component.data).toEqual(dataTest);
  });

  it('should calculate the savings and weeks of the savings section', () => {
    component.saving = dataTest.income - dataTest.expenses;
    component.weeks = Math.round(dataTest.necessaryAmount / (component.saving / 4));
    component.ionViewDidEnter();
    fixture.detectChanges();
    expect(component.saving).toEqual(300);
    expect(component.weeks).toEqual(33);
  });

  it('should calculate weeks of the invest section', () => {
    component.weeks = 33;
    productTest.weeks = Math.round(component.weeks / (1 * (1 + productTest.apy / 55)));
    component.ionViewDidEnter();
    fixture.detectChanges();
    expect(productTest.weeks).toEqual(16);
  });

  it('should navigate to home page when button ux_financial_planner_back_to_start is clicked', () => {
    fixture.debugElement.query(By.css('ion-button[name="ux_financial_planner_back_to_start"]')).nativeElement.click();
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/tabs/home']);
  });

  it('should call trackEvent on trackService when ux_financial_planner_back_to_start button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_financial_planner_back_to_start');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

});
