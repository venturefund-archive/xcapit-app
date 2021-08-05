import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Navigation, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { of, Subject } from 'rxjs';
import { TrackClickUnauthDirective } from 'src/app/shared/directives/track-click-unauth/track-click-unauth.directive';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { navControllerMock } from 'src/testing/spies/nav-controller-mock.spec';
import { TrackClickUnauthDirectiveTestHelper } from 'src/testing/track-click-unauth-directive-test.helper';
import { AuthFormComponent } from '../../usuarios/shared-usuarios/components/auth-form/auth-form.component';
import { ApiTicketsService } from '../shared-tickets/services/api-tickets.service';

import { CreateEmailValidationTicketPage } from './create-email-validation-ticket.page';

const formData = {
  valid: {
    email: 'example@email.com',
    subject: 'Subject',
    message: 'Message',
    category_code: 'OTHERS',
  },
};

const extras = {
  extras: {
    state: {
      email: 'test@test.com',
    },
  },
};

describe('CreateEmailValidationTicketPage', () => {
  let component: CreateEmailValidationTicketPage;
  let fixture: ComponentFixture<CreateEmailValidationTicketPage>;
  let apiTicketsMock: any;
  let trackClickUnauthDirectiveHelper: TrackClickUnauthDirectiveTestHelper<CreateEmailValidationTicketPage>;
  let activatedRouteMock: any;
  let navControllerSpy: any;
  let currentNavigation: Navigation;
  let getCurrentNavigationSpy: any;

  beforeEach(
    waitForAsync(() => {
      apiTicketsMock = {
        crud: jasmine.createSpyObj('CRUD', ['create']),
      };
      apiTicketsMock.crud.create.and.returnValue(of({}));

      activatedRouteMock = {
        queryParams: new Subject(),
      };
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
      TestBed.configureTestingModule({
        declarations: [DummyComponent, CreateEmailValidationTicketPage, TrackClickUnauthDirective],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [
          HttpClientTestingModule,
          TranslateModule.forRoot(),
          RouterTestingModule.withRoutes([
            { path: 'users/login', component: DummyComponent },
            {
              path: 'tickets/create-ticket-success',
              component: DummyComponent,
            },
          ]),
          ReactiveFormsModule,
          IonicModule,
        ],
        providers: [
          TrackClickUnauthDirective,
          { provide: NavController, useValue: navControllerSpy },
          { provide: ActivatedRoute, useValue: activatedRouteMock },
          { provide: ApiTicketsService, useValue: apiTicketsMock },
        ],
      }).compileComponents();

      const router = TestBed.inject(Router);
      currentNavigation = router.getCurrentNavigation();
      getCurrentNavigationSpy = spyOn(router, 'getCurrentNavigation').and.returnValue({
        ...currentNavigation,
        ...extras,
      });

      fixture = TestBed.createComponent(CreateEmailValidationTicketPage);
      component = fixture.componentInstance;
      trackClickUnauthDirectiveHelper = new TrackClickUnauthDirectiveTestHelper(fixture);
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call success from handleSubmit', () => {
    apiTicketsMock.crud.create.and.returnValue(of({}));
    const spy = spyOn(component, 'success');
    component.handleSubmit(null);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call create on handleSubmit', () => {
    component.handleSubmit(formData.valid);
    expect(apiTicketsMock.crud.create).toHaveBeenCalledTimes(1);
  });

  it('should call navigateBack with ["/tickets/create/success"], on navController when from success', async () => {
    await component.success();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['/tickets/create/success', true]);
  });

  it('should call navigateBack with ["/users/login"], on navController when from success', () => {
    component.close();
    expect(navControllerSpy.navigateBack).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateBack).toHaveBeenCalledWith(['/users/login']);
  });

  it('should fill form with user email if redirected from resend verification email', () => {
    activatedRouteMock.queryParams.next();
    expect(component.userEmail).toEqual(extras.extras.state.email);
  });
});
