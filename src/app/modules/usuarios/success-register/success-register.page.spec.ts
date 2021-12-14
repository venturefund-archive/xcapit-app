import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { SuccessRegisterPage } from './success-register.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { By } from '@angular/platform-browser';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { FakeRouter } from 'src/testing/fakes/router.fake.spec';

const extras = {
  state: {
    email: 'test@test.com',
  },
};

describe('SuccessRegisterPage', () => {
  let component: SuccessRegisterPage;
  let fixture: ComponentFixture<SuccessRegisterPage>;
  let activatedRouteMock: any;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeRouter: FakeRouter;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(
    waitForAsync(() => {
      activatedRouteMock = {
        queryParams: new Subject(),
      };
      fakeNavController = new FakeNavController({}, {});
      navControllerSpy = fakeNavController.createSpy();

      fakeRouter = new FakeRouter(extras);
      routerSpy = fakeRouter.createSpy();

      TestBed.configureTestingModule({
        declarations: [SuccessRegisterPage],
        imports: [IonicModule],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          { provide: ActivatedRoute, useValue: activatedRouteMock },
          { provide: NavController, useValue: navControllerSpy },
          { provide: Router, useValue: routerSpy },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(SuccessRegisterPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to resend verification email when "I didnt received the email" is clicked', () => {
    activatedRouteMock.queryParams.next();
    fixture.debugElement.query(By.css('app-success-content')).triggerEventHandler('secondaryActionEvent', null);
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith([
      '/users/resend-verification-email',
      'test@test.com',
    ]);
  });

  it('should navigate back to register when there is no email to resend', () => {
    fakeRouter.modifyReturns();
    activatedRouteMock.queryParams.next();
    expect(navControllerSpy.navigateBack).toHaveBeenCalledTimes(1);
  });

  it('should get the user email when created', () => {
    activatedRouteMock.queryParams.next();
    expect(component.email).toEqual(extras.state.email);
  });
});
