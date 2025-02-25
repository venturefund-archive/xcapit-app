import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { AppStorageService } from 'src/app/shared/services/app-storage/app-storage.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { ObjetiveDataService } from '../shared-financial-planner/services/objetive-data.service';

import { ObjetiveInfoPage } from './objetive-info.page';

const formData = {
  valid: {
    name: 'Travel Miami',
    category: 'travel',
    necessaryAmount: 10,
    income: '',
    expenses: '',
  },
  invalid: {
    name: '',
    category: 'travel',
    necessaryAmount: 10,
    income: '',
    expenses: '',
  },
  whiteSpaces: {
    name: '   ',
    category: 'travel',
    necessaryAmount: 10,
    income: '',
    expenses: '',
  } 
};

describe('ObjetiveInfoPage', () => {
  let component: ObjetiveInfoPage;
  let fixture: ComponentFixture<ObjetiveInfoPage>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let objetiveDataServiceSpy: jasmine.SpyObj<ObjetiveDataService>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<ObjetiveInfoPage>;
  let appStorageServiceSpy: jasmine.SpyObj<AppStorageService>;
  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      objetiveDataServiceSpy = jasmine.createSpyObj(
        'ObjetiveDataService',
        {},
        {
          income: 500,
          expenses: 200,
        }
      );

      appStorageServiceSpy = jasmine.createSpyObj('AppStorageService', {
        set: Promise.resolve(),
        get: { name: 'Miami', category: 'travel', necessaryAmount: 1000, income: 600, expenses: 300 },
      });

      TestBed.configureTestingModule({
        declarations: [ObjetiveInfoPage, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot(), ReactiveFormsModule],
        providers: [
          { provide: NavController, useValue: navControllerSpy },
          { provide: ObjetiveDataService, useValue: objetiveDataServiceSpy },
          { provide: AppStorageService, useValue: appStorageServiceSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(ObjetiveInfoPage);
      component = fixture.componentInstance;
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call appTrackEvent on trackService when ux_financial_planner_see_strategies is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_financial_planner_see_strategies');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should initialize form on init with previous page information', async () => {
    appStorageServiceSpy.get.and.resolveTo();
    await component.ionViewWillEnter();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.form.value).toEqual({
      income: 500,
      expenses: 200,
      name: '',
      category: 'other',
      necessaryAmount: '',
    });
  });

  it('should initialize form on init with previous page information and storage data when a goal is set', async () => {
    await component.ionViewWillEnter();
    fixture.detectChanges();
    expect(component.form.value).toEqual({
      income: 500,
      expenses: 200,
      name: 'Miami',
      category: 'travel',
      necessaryAmount: 1000,
    });
  });

  it('should render filter tab component', async () => {
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    const tabEl = fixture.debugElement.query(By.css('app-filter-tab'));
    expect(tabEl).toBeTruthy();
  });

  it('should not navigate to next page and not set storage when button is clicked and invalid form', () => {
    component.form.patchValue(formData.invalid);
    fixture.debugElement.query(By.css('ion-button[name="ux_financial_planner_see_strategies"]')).nativeElement.click();
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(0);
    expect(appStorageServiceSpy.set).toHaveBeenCalledTimes(0);
  });

  it('should navigate to next page and set storage when button is clicked and valid form', () => {
    component.form.patchValue(formData.valid);
    component.saving = 9;
    fixture.debugElement.query(By.css('ion-button[name="ux_financial_planner_see_strategies"]')).nativeElement.click();
    fixture.detectChanges();
    expect(appStorageServiceSpy.set).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/financial-planner/result-objetive']);
  });

  it('should navigate to success page if saving is greather than necessary amount when button is clicked and valid form', () => {
    component.form.patchValue(formData.valid);
    component.saving = 100;
    fixture.debugElement.query(By.css('ion-button[name="ux_financial_planner_see_strategies"]')).nativeElement.click();
    fixture.detectChanges();
    expect(appStorageServiceSpy.set).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith(['/financial-planner/success-objetive']);
  });

  it('should not navigate to next page and not set storage when button is clicked and name is only whitespaces', () => {
    component.form.patchValue(formData.whiteSpaces);
    fixture.debugElement.query(By.css('ion-button[name="ux_financial_planner_see_strategies"]')).nativeElement.click();
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(0);
    expect(appStorageServiceSpy.set).toHaveBeenCalledTimes(0);
  });
});
