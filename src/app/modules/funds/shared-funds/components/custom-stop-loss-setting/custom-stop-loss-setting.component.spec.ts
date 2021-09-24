import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import exp from 'constants';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { CustomStopLossSettingComponent } from './custom-stop-loss-setting.component';

const formData = {
  valid: {
    valueSL: 15,
  },
  invalid: {
    valueSL: 'test',
  },
};

describe('CustomStopLossSettingComponent', () => {
  let component: CustomStopLossSettingComponent;
  let fixture: ComponentFixture<CustomStopLossSettingComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<CustomStopLossSettingComponent>;
  let fakeModalController: FakeModalController;
  let modalControllerSpy: any;

  beforeEach(
    waitForAsync(() => {
      fakeModalController = new FakeModalController();
      modalControllerSpy = fakeModalController.createSpy();
      TestBed.configureTestingModule({
        declarations: [CustomStopLossSettingComponent, TrackClickDirective],
        imports: [IonicModule.forRoot(), ReactiveFormsModule, HttpClientTestingModule, TranslateModule.forRoot()],
        providers: [TrackClickDirective, { provide: ModalController, useValue: modalControllerSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(CustomStopLossSettingComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call trackEvent on trackService when Cancel Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Cancel');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Confirm Button clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Confirm');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should close modal when cancel button is clicked', async () => {
    fixture.debugElement.query(By.css("ion-button[name='Cancel']")).nativeElement.click();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(1);
  });

  it('should call handleSubmit when confirm button is clicked and modal dissmis if form is valid', async () => {
    fixture.debugElement.query(By.css("ion-button[name='Confirm']")).nativeElement.click();
    const spy = spyOn(component, 'handleSubmit');
    component.form.patchValue(formData.valid);
    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(modalControllerSpy.dismiss).toHaveBeenCalledWith(25, 'valueSL');
  });

  it('should call getTypeModal, setModalValues and patch value on ngOnInit', () => {
    const spyGetTypeModal = spyOn(component, 'getTypeModal');
    const spySetModalValues = spyOn(component, 'setModalValues');
    const spyForm = spyOn(component.form, 'patchValue');
    component.valueSL = 1;
    component.ngOnInit();
    fixture.detectChanges();
    expect(spyGetTypeModal).toHaveBeenCalledTimes(1);
    expect(spySetModalValues).toHaveBeenCalledTimes(1);
    expect(spyForm).toHaveBeenCalledTimes(1);
  });
});
