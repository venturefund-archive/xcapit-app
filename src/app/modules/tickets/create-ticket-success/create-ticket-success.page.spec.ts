import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { convertToParamMap, ActivatedRoute } from '@angular/router';
import { CreateTicketSuccessPage } from './create-ticket-success.page';
import { SUCCESS_TYPES } from 'src/app/shared/components/success-content/success-types.constant';

describe('CreateTicketSuccessPage', () => {
  let component: CreateTicketSuccessPage;
  let fixture: ComponentFixture<CreateTicketSuccessPage>;
  let activatedRouteSpy: any;

  beforeEach(
    waitForAsync(() => {
      activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', ['params']);
      activatedRouteSpy.snapshot = {
        paramMap: convertToParamMap({
          isEmailValidation: 'true',
        }),
      };
      TestBed.configureTestingModule({
        declarations: [CreateTicketSuccessPage],
        imports: [IonicModule],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [{ provide: ActivatedRoute, useValue: activatedRouteSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(CreateTicketSuccessPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('CreateTicketSuccessPage with route params', () => {
    beforeEach(() => {
      activatedRouteSpy.snapshot = {
        paramMap: convertToParamMap({
          isEmailValidation: 'true',
        }),
      };
    });

    it('unauth should be false with route params', () => {
      component.ngOnInit();
      expect(component.unauth).toEqual(true);
    });

    it('data should be equal to SUCCESS_TYPES.ticket_email_validation_create', () => {
      component.ngOnInit();
      expect(component.data).toEqual(SUCCESS_TYPES.ticket_email_validation_create);
    });
  });

  describe('CreateTicketSuccessPage without route params', () => {
    beforeEach(() => {
      activatedRouteSpy.snapshot = {
        paramMap: convertToParamMap({}),
      };
    });

    it('unauth should be false with route params', () => {
      component.ngOnInit();
      expect(component.unauth).toEqual(false);
    });

    it('data should be equal to SUCCESS_TYPES.generic_ticket_create', () => {
      component.ngOnInit();
      expect(component.data).toEqual(SUCCESS_TYPES.generic_ticket_create);
    });
  });
});
