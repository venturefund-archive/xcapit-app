import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailValidationPage } from './email-validation.page';
import { RouterTestingModule } from '@angular/router/testing';
import { ApiUsuariosService } from '../shared-usuarios/services/api-usuarios/api-usuarios.service';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

describe('EmailValidationPage', () => {
  let component: EmailValidationPage;
  let fixture: ComponentFixture<EmailValidationPage>;
  let apiUsuariosSpy: any;
  let apiUsuariosService: ApiUsuariosService;

  beforeEach(async(() => {
    apiUsuariosSpy = jasmine.createSpyObj('ApiUsuariosService', ['sendEmailValidation', 'emailValidation']);
    apiUsuariosSpy.sendEmailValidation.and.returnValue(of({}));
    TestBed.configureTestingModule({
      declarations: [ EmailValidationPage ],
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule.withRoutes([])
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: ApiUsuariosService, useValue: apiUsuariosSpy }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailValidationPage);
    apiUsuariosService = TestBed.inject(ApiUsuariosService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call sendEmailvalidation when have token, uidb64 and isValidEmail = false', () => {
    component.emailValidationToken = 'asdfsdfa';
    component.uidb64 = 'asdfsdfa';
    component.isValidEmail = false;
    component.sendEmailValidation();
    expect(apiUsuariosService.sendEmailValidation).toHaveBeenCalledTimes(1);
  });

  it('should not call sendEmailvalidation when have not token or uidb64 and isValidEmail = false', () => {
    component.emailValidationToken = '';
    component.isValidEmail = false;
    component.sendEmailValidation();
    expect(apiUsuariosService.sendEmailValidation).toHaveBeenCalledTimes(0);
  });
});
