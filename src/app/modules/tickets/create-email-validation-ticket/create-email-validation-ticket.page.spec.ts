import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Navigation, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { of, Subject } from 'rxjs';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { navControllerMock } from 'src/testing/spies/nav-controller-mock.spec';
import { ApiTicketsService } from '../shared-tickets/services/api-tickets.service';
import { CreateEmailValidationTicketPage } from './create-email-validation-ticket.page';
import { TrackClickDirectiveTestHelper } from '../../../../testing/track-click-directive-test.helper';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';

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
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<CreateEmailValidationTicketPage>;
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
        declarations: [DummyComponent, CreateEmailValidationTicketPage, FakeTrackClickDirective],
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
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
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
