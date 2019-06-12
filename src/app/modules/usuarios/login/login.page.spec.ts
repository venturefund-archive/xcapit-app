import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPage } from './login.page';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ApiUsuariosService } from '../shared-usuarios/services/api-usuarios/api-usuarios.service';
import { AuthFormComponent } from '../shared-usuarios/components/auth-form/auth-form.component';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('LoginPage', () => {
  let component: LoginPage;
  let fixture: ComponentFixture<LoginPage>;
  let apiUsuariosSpy: any;

  beforeEach(async(() => {
    apiUsuariosSpy = jasmine.createSpyObj('ApiUsuariosService', ['login']);
    apiUsuariosSpy.login.and.returnValue(of({}));
    TestBed.configureTestingModule({
      declarations: [ LoginPage, AuthFormComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        RouterTestingModule.withRoutes([]),
        ReactiveFormsModule,
        IonicModule
      ],
      providers: [
        { provide: ApiUsuariosService, useValue: apiUsuariosSpy }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call success from loginUser', () => {
    const spy = spyOn(component, 'success');
    component.loginUser(null);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should reset form on success', () => {
    const spy = spyOn(component.loginForm.form, 'reset');
    component.success();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
