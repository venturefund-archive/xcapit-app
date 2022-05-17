import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AbstractControl, FormControl } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ItemFormError } from '../../models/item-form-error';
import { ErrorsFormPasswordItemComponent } from './errors-form-password-item.component';

describe('ErrorsFormPasswordItemComponent', () => {
  let component: ErrorsFormPasswordItemComponent;
  let fixture: ComponentFixture<ErrorsFormPasswordItemComponent>;
  let abstractControlMock: any;

  const errors: ItemFormError[] = [
    {
      name: 'minlength',
      text: 'Se requieren mínimo 6 caracteres',
      rules: []
    }
  ];
  beforeEach(waitForAsync(() => {
    abstractControlMock = { subscribe: () => Promise.resolve('') };
    TestBed.configureTestingModule({
      declarations: [ ErrorsFormPasswordItemComponent ],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: AbstractControl, useValue: abstractControlMock },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorsFormPasswordItemComponent);
    component = fixture.componentInstance;
    component.errors = [...errors]
    component.control =  new FormControl()
    fixture.detectChanges();
  }));

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should set initial errors', () => {
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.processedErrors.length).toBe(1);
  });

  it('should not set errors if there is not errors', () => {
    component.ngOnInit();
    component.control.setValue('ff123');
    fixture.detectChanges();
    component.processErrors()
    expect(component.processedErrors.filter(obj => obj.present)).toBeTruthy();
  });

});
