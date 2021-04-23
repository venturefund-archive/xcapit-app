import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { SuccessRegisterPage } from './success-register.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DummyComponent } from 'src/testing/dummy.component.spec';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { navControllerMock } from 'src/testing/spies/nav-controller-mock.spec';

const extras = {
  extras: {
    state: {
      email: 'test@test.com'
    }
  }
}

describe('SuccessRegisterPage', () => {
  let component: SuccessRegisterPage;
  let fixture: ComponentFixture<SuccessRegisterPage>;
  let activatedRouteMock: any;
  let navControllerSpy: any;

  beforeEach(
    waitForAsync(() => {
      activatedRouteMock = {
        queryParams: new Subject()
      };
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);

      TestBed.configureTestingModule({
        declarations: [SuccessRegisterPage, DummyComponent],
        imports: [
          IonicModule,
          RouterTestingModule.withRoutes([
            { path: 'users/resend-verify-email', component: DummyComponent },
          ]),
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          { provide: ActivatedRoute, useValue: activatedRouteMock },
          { provide: NavController, useValue: navControllerSpy },
        ],
      }).compileComponents();

      var router = TestBed.inject(Router);
      var currentNavigation = router.getCurrentNavigation();
      spyOn(router, 'getCurrentNavigation').and.returnValue({...currentNavigation, ...extras});

      fixture = TestBed.createComponent(SuccessRegisterPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call navigateForward on resendVerificationEmail', () => {
    component.resendVerificationEmail();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledTimes(1);
  });

  it('should pass the user email on resendVerificationEmail', () => {
    activatedRouteMock.queryParams.next();
    component.resendVerificationEmail();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith(jasmine.any(Array), jasmine.objectContaining(extras.extras));
  });

  it ('should get the user email when created', () => {
    activatedRouteMock.queryParams.next();
    expect(component.email).toEqual(extras.extras.state.email);
  });
});
