import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { navControllerMock } from 'src/testing/spies/nav-controller-mock.spec';
import { ApiTicketsService } from '../shared-tickets/services/api-tickets.service';
import { ApiUsuariosService } from '../../users/shared-users/services/api-usuarios/api-usuarios.service';
import { CreateSupportTicketPage } from './create-support-ticket.page';
import { FakeTrackClickDirective } from '../../../../testing/fakes/track-click-directive.fake.spec';
import { TrackClickDirectiveTestHelper } from '../../../../testing/track-click-directive-test.spec';

const formData = {
  valid: {
    email: 'example@email.com',
    subject: 'Subject',
    message: 'Message',
    category_code: 'OTHERS',
  },
};

const email = 'test@ŧest.com';

describe('CreateSupportTicketPage', () => {
  let component: CreateSupportTicketPage;
  let fixture: ComponentFixture<CreateSupportTicketPage>;
  let apiTicketsMock: any;
  let apiUsuariosServiceSpy: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<CreateSupportTicketPage>;
  let navControllerSpy: any;

  beforeEach(
    waitForAsync(() => {
      apiTicketsMock = {
        crud: jasmine.createSpyObj('CRUD', ['create']),
      };
      apiUsuariosServiceSpy = jasmine.createSpyObj('ApiUsuariosService', ['getUser']);
      apiTicketsMock.crud.create.and.returnValue(of({}));
      apiUsuariosServiceSpy.getUser.and.returnValue(of(email));
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
      TestBed.configureTestingModule({
        declarations: [DummyComponent, CreateSupportTicketPage, FakeTrackClickDirective],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [
          HttpClientTestingModule,
          TranslateModule.forRoot(),
          RouterTestingModule.withRoutes([
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
          { provide: ApiTicketsService, useValue: apiTicketsMock },
          { provide: ApiUsuariosService, useValue: apiUsuariosServiceSpy },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(CreateSupportTicketPage);
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

  it('should call getUserEmail on ionViewWillEnter', () => {
    const spy = spyOn(component, 'getUserEmail');
    component.ionViewWillEnter();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should call apiUsuarios.getUser on getUserEmail', () => {
    component.getUserEmail();
    expect(apiUsuariosServiceSpy.getUser).toHaveBeenCalledTimes(1);
  });

  it('should call create on handleSubmit', () => {
    component.handleSubmit(formData.valid);
    expect(apiTicketsMock.crud.create).toHaveBeenCalledTimes(1);
  });

  it('should call navigateBack with ["/tickets/create/success"], on navController when from success', () => {
    component.success();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(1);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(['tickets/create/success'], { replaceUrl: true });
  });
});