import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterPage } from './register.page';
import { ApiUsuariosService } from '../shared-usuarios/services/api-usuarios/api-usuarios.service';
import { AuthFormComponent } from '../shared-usuarios/components/auth-form/auth-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';

describe('RegisterPage', () => {
  let component: RegisterPage;
  let fixture: ComponentFixture<RegisterPage>;
  let apiUsuariosMock: any;

  beforeEach(async(() => {
    apiUsuariosMock = {
      crud: {
        create: (data: any) => of(data)
      }
    };
    TestBed.configureTestingModule({
      declarations: [ RegisterPage, AuthFormComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        ReactiveFormsModule,
        IonicModule
      ],
      providers: [
        { provide: ApiUsuariosService, useValue: apiUsuariosMock }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call success from regiterUser', () => {
    const spy = spyOn(component, 'success');
    component.registerUser(null);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should reset form on success', () => {
    const spy = spyOn(component.registerForm.form, 'reset');
    component.success();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
