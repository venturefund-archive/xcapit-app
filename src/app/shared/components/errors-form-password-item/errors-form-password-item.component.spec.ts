import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
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
    component.control =  new FormControl('',[Validators.minLength(6)])
    fixture.detectChanges();
  }));

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render validation error properly', () => {
    component.control.setValue('ff123');
    fixture.detectChanges();
    const iconEl = fixture.debugElement.query(By.css('ion-icon[name="ux-info-circle-outline"]'));
    const labelEl = fixture.debugElement.query(By.css('ion-label.password-error-item__description'));
    expect(iconEl).toBeTruthy();
    expect(labelEl.attributes['ng-reflect-color']).toEqual('warningdark');
    expect(labelEl.nativeElement.innerHTML).toContain('Se requieren mínimo 6 caracteres');
  });

  it('should render validation success properly', () => {
    component.control.setValue('fff123');
    fixture.detectChanges();
    const iconEl = fixture.debugElement.query(By.css('ion-icon[name="ux-checked-circle-outline"]'));
    const labelEl = fixture.debugElement.query(By.css('ion-label.password-error-item__description'));
    expect(iconEl).toBeTruthy();
    expect(labelEl.attributes['ng-reflect-color']).toEqual('successdark');
    expect(labelEl.nativeElement.innerHTML).toContain('Se requieren mínimo 6 caracteres');
  });

});
