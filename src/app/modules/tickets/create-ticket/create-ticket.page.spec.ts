import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { TrackClickUnauthDirective } from 'src/app/shared/directives/track-click-unauth/track-click-unauth.directive';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { TrackClickUnauthDirectiveTestHelper } from 'src/testing/track-click-unauth-directive-test.helper';
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

describe('CreateTicketPage', () => {
  let component: CreateTicketPage;
  let fixture: ComponentFixture<CreateTicketPage>;
  let apiTicketsMock: any;
  let trackClickUnauthDirectiveHelper: TrackClickUnauthDirectiveTestHelper<CreateTicketPage>;

  beforeEach(
    waitForAsync(() => {
      apiTicketsMock = {
        crud: jasmine.createSpyObj('CRUD', ['create']),
      };
      apiTicketsMock.crud.create.and.returnValue(of({}));

      TestBed.configureTestingModule({
        declarations: [
          DummyComponent,
          CreateTicketPage,
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
          { provide: ApiTicketsService, useValue: apiTicketsMock },
        ],
      }).compileComponents();

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
