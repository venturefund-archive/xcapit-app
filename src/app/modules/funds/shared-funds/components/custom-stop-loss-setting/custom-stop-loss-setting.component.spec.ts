import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { FakeTrackClickDirective } from 'src/testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { CustomStopLossSettingComponent } from './custom-stop-loss-setting.component';

const formData = {
  valid: {
    valueSL: 15,
  },
  invalid: {
    valueSL: '',
  },
};

const types = {
  sl: {
    title: 'Test',
    message: 'test',
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
        declarations: [CustomStopLossSettingComponent, FakeTrackClickDirective],
        imports: [IonicModule.forRoot(), ReactiveFormsModule, HttpClientTestingModule, TranslateModule.forRoot()],
        providers: [{ provide: ModalController, useValue: modalControllerSpy }],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
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

  it('should dissmis modal when confirm button is clicked and set value if form is valid', async () => {
    component.form.patchValue(formData.valid);
    fixture.debugElement.query(By.css("ion-button[name='Confirm']")).nativeElement.click();
    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
    fixture.detectChanges();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledWith(15, 'valueSL');
  });

  it('should dissmis modal when confirm button is clicked and not set value if form is invalid', async () => {
    component.form.patchValue(formData.invalid);
    fixture.debugElement.query(By.css("ion-button[name='Confirm']")).nativeElement.click();
    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
    fixture.detectChanges();
    expect(modalControllerSpy.dismiss).toHaveBeenCalledTimes(0);
  });

  it('should call getTypeModal, setModalValues and if there is valueSL patch value on form on ngOnInit', () => {
    component.typeModal = types.sl;
    component.valueSL = 1;
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.form.value.valueSL).toEqual(1);
    expect(types.sl.title).toEqual('Test');
    expect(types.sl.message).toEqual('test');
  });

  it('should call getTypeModal, setModalValues and if there is not valueSL not patch value on form on ngOnInit', () => {
    component.typeModal = types.sl;
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.valueSL).toEqual(undefined);
    expect(types.sl.title).toEqual('Test');
    expect(types.sl.message).toEqual('test');
  });
});
