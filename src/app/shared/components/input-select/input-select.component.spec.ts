import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UntypedFormControl, UntypedFormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { SelectStyleDirective } from '../../directives/select-style/select-style.directive';

import { InputSelectComponent } from './input-select.component';
const data = [
  { key: 'test', value: 'testValue', image: 'assets/test_image.svg', icon: 'icon.png' },
  { key: 'test2', value: 'testValue2', image: 'assets/test_image.svg', icon: 'icon.png' },
];
describe('InputSelectComponent', () => {
  let component: InputSelectComponent;
  let fixture: ComponentFixture<InputSelectComponent>;
  let fakeModalController: FakeModalController;
  let modalControllerSpy: any;

  let abstractControlMock: any;
  let controlContainerMock: UntypedFormGroup;
  let formGroupDirectiveMock: FormGroupDirective;

  beforeEach(
    waitForAsync(() => {
      controlContainerMock = new UntypedFormGroup({
        testControl: new UntypedFormControl(),
      });
      formGroupDirectiveMock = new FormGroupDirective([], []);
      formGroupDirectiveMock.form = controlContainerMock;
      fakeModalController = new FakeModalController();
      modalControllerSpy = fakeModalController.createSpy();
      abstractControlMock = { subscribe: () => Promise.resolve('') };

      TestBed.configureTestingModule({
        declarations: [InputSelectComponent, SelectStyleDirective],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot(), ReactiveFormsModule],
        providers: [
          { provide: ModalController, useValue: modalControllerSpy },
          { provide: FormGroupDirective, useValue: formGroupDirectiveMock },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(InputSelectComponent);
      component = fixture.componentInstance;
      component.controlName = 'testControl';
      component.data = data;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not patch form value on close modal', () => {
    fixture.debugElement.query(By.css('ion-item.uxselect__item')).nativeElement.click();
    const labelEl = fixture.debugElement.query(By.css('ion-label.uxselect__label'));
    expect(labelEl).toBeNull();
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should be rendered properly without translations when translated is false', async () => {
    component.key = 'key';
    component.valueKey = 'value';
    component.imageKey = 'image';
    component.iconKey = 'icon';
    component.control.patchValue(data[0]);
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    const labelEl = fixture.debugElement.query(By.css('ion-label.uxselect__label'));
    expect(labelEl.nativeElement.innerHTML).toContain('testValue');
    const imageEl = fixture.debugElement.query(By.css('img.uxselect__item__logo'));
    expect(imageEl.attributes.src).toBe('assets/test_image.svg');
    const iconEl = fixture.debugElement.query(By.css('ion-icon.uxselect__item__logo'));
    expect(iconEl.attributes['ng-reflect-name']).toBe('icon.png');
  });

  it('should be rendered properly with translations when translated is true', async () => {
    component.key = 'key';
    component.valueKey = 'value';
    component.control.patchValue(data[0]);
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    const labelEl = fixture.debugElement.query(By.css('ion-label.uxselect__label'));
    expect(labelEl.nativeElement.innerHTML).toContain('testValue');
  });

  it('should select option when modal closes', async () => {
    component.key = 'key';
    component.valueKey = 'value';
    fakeModalController.modifyReturns({}, { data: data[0], role: 'selected' });
    fixture.debugElement.query(By.css('ion-item.uxselect__item')).nativeElement.click();
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    const labelEl = fixture.debugElement.query(By.css('ion-label.uxselect__label'));
    expect(labelEl.nativeElement.innerHTML).toContain('testValue');
  });

  it('should be rendered properly with placeholder', async () => {
    component.placeholder = 'Test Placeholder';
    fixture.detectChanges();
    await fixture.whenRenderingDone();
    const placeholderEl = fixture.debugElement.query(By.css('ion-label.uxselect__item__placeholder'));
    expect(placeholderEl.nativeElement.innerHTML).toContain('Test Placeholder');
  });

  it('should not allow multiple modals opening', async () => {
    fixture.debugElement.query(By.css('ion-item.uxselect__item')).nativeElement.click();
    fixture.detectChanges();
    expect(fixture.debugElement.nativeElement.querySelector('ion-item.uxselect__item').disabled).toBeTruthy();
  });
});
