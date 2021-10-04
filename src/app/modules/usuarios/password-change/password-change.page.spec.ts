import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { PasswordChangePage } from './password-change.page';
import { IonicModule, NavController } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ApiUsuariosService } from '../shared-usuarios/services/api-usuarios/api-usuarios.service';
import { AuthService } from '../shared-usuarios/services/auth/auth.service';
import { PasswordChangeFormComponent } from '../shared-usuarios/components/password-change-form/password-change-form.component';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastService } from '../../../shared/services/toast/toast.service';
import { navControllerMock } from '../../../../testing/spies/nav-controller-mock.spec';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';

const formData = {
  valid: {
    actual_password: 'asdf',
    password: 'asdfF1',
    repeat_password: 'asdfF1',
  },
  invalid: {
    actual_password: 'fdaas',
    password: 'dsfaaa',
    repeat_password: 'dsfaa',
  },
};

describe('PasswordChangePage', () => {
  let component: PasswordChangePage;
  let fixture: ComponentFixture<PasswordChangePage>;
  let apiUsuariosServiceSpy: any;
  let authServiceSpy: any;
  let navControllerSpy: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<PasswordChangePage>;
  let toastServiceSpy: any;

  beforeEach(
    waitForAsync(() => {
      toastServiceSpy = jasmine.createSpyObj('ToastService', ['showToast']);
      apiUsuariosServiceSpy = jasmine.createSpyObj('ApiUsuariosService', ['changePassword']);
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
      navControllerSpy.navigateBack.and.returnValue(of({}).toPromise());
      authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);
      authServiceSpy.logout.and.returnValue(of({}).toPromise());
      TestBed.configureTestingModule({
        declarations: [PasswordChangePage, PasswordChangeFormComponent, FakeTrackClickDirective],
        imports: [
          HttpClientTestingModule,
          IonicModule,
          ReactiveFormsModule,
          TranslateModule.forRoot(),
          RouterTestingModule.withRoutes([]),
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          { provide: ApiUsuariosService, useValue: apiUsuariosServiceSpy },
          { provide: AuthService, useValue: authServiceSpy },
          { provide: NavController, useValue: navControllerSpy },
          { provide: ToastService, useValue: toastServiceSpy },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordChangePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call success from handleSubmit', () => {
    apiUsuariosServiceSpy.changePassword.and.returnValue(of({}));
    const spy = spyOn(component, 'success');
    component.handleSubmit(null);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call changePassword from handleSubmit', () => {
    apiUsuariosServiceSpy.changePassword.and.returnValue(of({}));
    component.handleSubmit(null);
    expect(apiUsuariosServiceSpy.changePassword).toHaveBeenCalledTimes(1);
  });

  it('should reset form on success', async () => {
    const spy = spyOn(component.formComponent.form, 'reset');
    await component.success();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call navigateBack with ["/users/login"] and { replaceUrl: true }, on navController when from success', async () => {
    await component.success();
    expect(navControllerSpy.navigateBack).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateBack).toHaveBeenCalledWith(['/users/login'], { replaceUrl: true });
  });

  it('should call trackEvent on trackService when Change Password button clicked', () => {
    fixture.detectChanges();
    component.formComponent.form.patchValue(formData.valid);
    fixture.detectChanges();
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Change Password');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
