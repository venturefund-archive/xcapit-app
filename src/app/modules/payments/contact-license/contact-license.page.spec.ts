import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { of, Subject } from 'rxjs';
import { TrackClickDirectiveTestHelper } from 'src/testing/track-click-directive-test.helper';
import { navControllerMock } from 'src/testing/spies/nav-controller-mock.spec';
import { ApiTicketsService } from '../../tickets/shared-tickets/services/api-tickets.service';

import { ContactLicensePage } from './contact-license.page';
import { TrackClickDirective } from 'src/app/shared/directives/track-click/track-click.directive';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

const formData = {
  valid: {
    email: 'example@email.com',
    subject: 'Subject',
    message: 'Message',
    category_code: 'Category',
  },
  invalid: {
    email: '',
    subject: '',
    message: '',
    category_code: '',
  },
};

describe('ContactLicensePage', () => {
  let component: ContactLicensePage;
  let fixture: ComponentFixture<ContactLicensePage>;
  let apiTicketsMock: any;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<ContactLicensePage>;
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
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
      TestBed.configureTestingModule({
        declarations: [ContactLicensePage, TrackClickDirective],
        imports: [
          HttpClientTestingModule,
          TranslateModule.forRoot(),
          RouterTestingModule,
          ReactiveFormsModule,
          IonicModule,
        ],
        providers: [
          TrackClickDirective,
          { provide: NavController, useValue: navControllerSpy },
          { provide: ActivatedRoute, useValue: activatedRouteMock },
          { provide: ApiTicketsService, useValue: apiTicketsMock },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      const router = TestBed.inject(Router);
      const currentNavigation = router.getCurrentNavigation();
      spyOn(router, 'getCurrentNavigation').and.returnValue({
        ...currentNavigation,
      });
      fixture = TestBed.createComponent(ContactLicensePage);
      component = fixture.componentInstance;
      trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
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
    const el = trackClickDirectiveHelper.getByElementByName('ion-button', 'Submit');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spy = spyOn(directive, 'clickEvent').and.returnValue(null);
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
