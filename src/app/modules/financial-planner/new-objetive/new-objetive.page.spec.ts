import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.spec';
import { ObjetiveDataService } from '../shared-financial-planner/services/objetive-data.service';
import { FormBuilder, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { NewObjetivePage } from './new-objetive.page';
import { By } from '@angular/platform-browser';
import { ToastService } from 'src/app/shared/services/toast/toast.service';

const formData = {
  valid: {
    income: 500,
    expenses: 200,
  },
  invalid: {
    income: '',
    expenses: '',
  },
};

describe('NewObjetivePage', () => {
  let component: NewObjetivePage;
  let fixture: ComponentFixture<NewObjetivePage>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<NewObjetivePage>;
  let controlContainerMock: FormGroup;
  let formGroupDirectiveMock: FormGroupDirective;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let objetiveDataServiceSpy: jasmine.SpyObj<ObjetiveDataService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;

  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      objetiveDataServiceSpy = jasmine.createSpyObj('ObjetiveDataService', {
        income: 500,
        expenses: 200,
      });
      controlContainerMock = new FormBuilder().group({
        income: ['', []],
        expenses: ['', []],
      });
      formGroupDirectiveMock = new FormGroupDirective([], []);
      formGroupDirectiveMock.form = controlContainerMock;
      toastServiceSpy = jasmine.createSpyObj('ToastService', {
        showWarningToast: Promise.resolve(),
      });
      TestBed.configureTestingModule({
        declarations: [NewObjetivePage, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot(), ReactiveFormsModule],
        providers: [
          { provide: NavController, useValue: navControllerSpy },
          { provide: ObjetiveDataService, useValue: objetiveDataServiceSpy },
          { provide: FormGroupDirective, useValue: formGroupDirectiveMock },
          { provide: ToastService, useValue: toastServiceSpy },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(NewObjetivePage);
      component = fixture.componentInstance;
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call appTrackEvent on trackService when ux_financial_planner_continue is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'ux_financial_planner_continue');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should navigate to objetive info page and save objetive data when button is clicked and form is valid', () => {
    component.form.patchValue(formData.valid);
    fixture.debugElement.query(By.css('ion-button[name="ux_financial_planner_continue"]')).nativeElement.click();
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/financial-planner/objetive-info');
    expect(component.form.value.income).toEqual(500);
    expect(component.form.value.expenses).toEqual(200);
  });

  it('should not navigate to objetive info page and not save objetive data when button is clicked and form is invalid', () => {
    component.form.patchValue(formData.invalid);
    fixture.debugElement.query(By.css('ion-button[name="ux_financial_planner_continue"]')).nativeElement.click();
    fixture.detectChanges();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(0);
    expect(component.form.value.income).toEqual('');
    expect(component.form.value.expenses).toEqual('');
  });

  it('should patch data on form on ngOnInit', () => {
    objetiveDataServiceSpy.income = 500;
    objetiveDataServiceSpy.expenses = 200;
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.form.value.income).toEqual(500);
    expect(component.form.value.expenses).toEqual(200);
  });

  it('should show warning toast when button is clicked and the expenses are greather than income', () => {
    component.form.patchValue({ income: 200, expenses: 300 });
    fixture.debugElement.query(By.css('ion-button[name="ux_financial_planner_continue"]')).nativeElement.click();
    component.ngOnInit();
    fixture.detectChanges();
    expect(toastServiceSpy.showWarningToast).toHaveBeenCalledTimes(1);
  });

  it('should not show warning toast when button is clicked and the expenses are less than income', () => {
    component.form.patchValue({ income: 400, expenses: 300 });
    fixture.debugElement.query(By.css('ion-button[name="ux_financial_planner_continue"]')).nativeElement.click();
    component.ngOnInit();
    fixture.detectChanges();
    expect(toastServiceSpy.showWarningToast).toHaveBeenCalledTimes(0);
  });
});
