import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorsFormItemComponent } from './errors-form-item.component';
import { FormGroupDirective, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ItemFormError } from '../../models/item-form-error';
import { TranslateModule } from '@ngx-translate/core';
import { CustomValidatorErrors } from '../../validators/custom-validator-errors';
import { By } from '@angular/platform-browser';

describe('ErrorsFormItemComponent', () => {
  let component: ErrorsFormItemComponent;
  let fixture: ComponentFixture<ErrorsFormItemComponent>;
  let formGroupDirectiveMock: any;
  let controlContainerMock: any;

  beforeEach(waitForAsync(() => {
    controlContainerMock = new UntypedFormGroup({
      testControl: new UntypedFormControl(),
    });
    formGroupDirectiveMock = new FormGroupDirective([], []);
    formGroupDirectiveMock.form = controlContainerMock;

    TestBed.configureTestingModule({
      declarations: [ ErrorsFormItemComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: FormGroupDirective, useValue: formGroupDirectiveMock }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorsFormItemComponent);
    component = fixture.componentInstance;
    component.controlName = 'testControl';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set errors', () => {
    const errors: ItemFormError[] = [
      {
        name: 'minlength',
        text: 'Se requieren mínimo 6 caracteres',
        rules: []
      }
    ];
    component.errors = [...errors];
    component.ngOnInit();
    expect(component.errors.length).toBeGreaterThan(1);
  });

  it('should invalid prop have a false value when control is null', () => {
    component.control = null;
    fixture.detectChanges();
    expect(component.control).toBeFalsy();
    expect(component.invalid).toBeFalsy();
  });

  it('should valid prop have a false value when control is null', () => {
    component.control = null;
    fixture.detectChanges();
    expect(component.control).toBeFalsy();
    expect(component.valid).toBeFalsy();
  });

  it('should show new style errors', () => {
    component.newStyle = true;
    component.control.setErrors(CustomValidatorErrors.walletIncorrectPassword);
    component.control.markAsTouched();
    fixture.detectChanges();
    const errorIconEl = fixture.debugElement.query(By.css('ion-icon'));
    const textEl = fixture.debugElement.query(By.css('p.ux-font-text-xxs'));
    expect(errorIconEl).toBeTruthy();
    expect(textEl).toBeTruthy();
  });

  it('should show old style errors', () => {
    component.newStyle = false;
    component.control.setErrors(CustomValidatorErrors.walletIncorrectPassword);
    component.control.markAsTouched();
    fixture.detectChanges();
    const errorIconEl = fixture.debugElement.query(By.css('ion-icon'));
    const textEl = fixture.debugElement.query(By.css('p.ux-font-form-errors'));
    expect(errorIconEl).toBeFalsy();
    expect(textEl).toBeTruthy();
  });
});
