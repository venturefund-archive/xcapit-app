import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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

import { CreateTicketPage } from './create-ticket.page';

const formData = {
  valid: {
    email: 'example@email.com',
    subject: 'Subject',
    message: 'Message',
  },
  invalid: {
    email: '',
    subject: '',
    message: '',
  },
};

const extras = {
  extras: {
    state: {
      email: 'test@test.com',
    },
  },
};

describe('CreateTicketPage', () => {
  let component: CreateTicketPage;
  let fixture: ComponentFixture<CreateTicketPage>;
  let apiTicketsMock: any;
  let trackClickUnauthDirectiveHelper: TrackClickUnauthDirectiveTestHelper<CreateTicketPage>;
  let activatedRouteMock: any;
  let navControllerSpy: any;

  beforeEach(
    waitForAsync(() => {
      apiTicketsMock = {
        crud: jasmine.createSpyObj('CRUD', ['create']),
      };
      apiTicketsMock.crud.create.and.returnValue(of({}));

      activatedRouteMock = {
        queryParams: new Subject(),
      };
      navControllerSpy = jasmine.createSpyObj(
        'NavController',
        navControllerMock
      );
      TestBed.configureTestingModule({
        declarations: [
          DummyComponent,
          CreateTicketPage,
          AuthFormComponent,
          TrackClickUnauthDirective,
        ],
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

      var router = TestBed.inject(Router);
      var currentNavigation = router.getCurrentNavigation();
      spyOn(
        router,
        'getCurrentNavigation'
      ).and.returnValue({ ...currentNavigation, ...extras });

      fixture = TestBed.createComponent(CreateTicketPage);
      component = fixture.componentInstance;
      trackClickUnauthDirectiveHelper = new TrackClickUnauthDirectiveTestHelper(
        fixture
      );
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fill form with user email if redirected from resend verification email', () => {
    activatedRouteMock.queryParams.next();
    expect(component.form.value.email).toEqual(extras.extras.state.email);
  });

  it('should call createTicket on handleSubmit if formData valid', () => {
    const spy = spyOn(component, 'createTicket');
    component.form.patchValue(formData.valid);
    component.handleSubmit();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should not call createTicket on handleSubmit if formData invalid', () => {
    const spy = spyOn(component, 'createTicket');
    component.form.patchValue(formData.invalid);
    component.handleSubmit();
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should call create on createTicket', () => {
    component.createTicket();
    expect(apiTicketsMock.crud.create).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Submit button clicked', () => {
    const el = trackClickUnauthDirectiveHelper.getByElementByName(
      'ion-button',
      'Submit'
    );
    const directive = trackClickUnauthDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent').and.returnValue(null);
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call trackEvent on trackService when Cancel button clicked', () => {
    const el = trackClickUnauthDirectiveHelper.getByElementByName(
      'ion-button',
      'Cancel'
    );
    const directive = trackClickUnauthDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent').and.returnValue(null);
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
