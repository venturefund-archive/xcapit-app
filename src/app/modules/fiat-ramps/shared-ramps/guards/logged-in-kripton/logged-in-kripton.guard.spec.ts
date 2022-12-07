import { TestBed } from '@angular/core/testing';
import { NavController } from '@ionic/angular';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { KriptonUserInjectable } from '../../models/kripton-user/injectable/kripton-user.injectable';
import { KriptonUser } from '../../models/kripton-user/kripton-user';
import { LoggedInKriptonGuard } from './logged-in-kripton.guard';

describe('LoggedInKriptonGuard', () => {
  let guard: LoggedInKriptonGuard;
  let kriptonUserSpy: jasmine.SpyObj<KriptonUser>;
  let kriptonUserInjectableSpy: jasmine.SpyObj<KriptonUserInjectable>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let fakeNavController: FakeNavController;

  beforeEach(() => {
    fakeNavController = new FakeNavController();
    navControllerSpy = fakeNavController.createSpy();
    kriptonUserSpy = jasmine.createSpyObj('KriptonUser', {
      isLogged: Promise.resolve(true),
    });
    kriptonUserInjectableSpy = jasmine.createSpyObj('KriptonUserInjectable', {
      create: kriptonUserSpy,
    });
    TestBed.configureTestingModule({
      providers: [
        { provide: KriptonUserInjectable, useValue: kriptonUserInjectableSpy },
        { provide: NavController, useValue: navControllerSpy },
      ],
    });
    guard = TestBed.inject(LoggedInKriptonGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access if user is logged in Kripton', async () => {
    const result = await guard.canActivate();
    expect(result).toBeTrue();
  });

  it('should deny access and redirect to user-email if user is not logged in Kripton', async () => {
    kriptonUserSpy.isLogged.and.resolveTo(false);
    const result = await guard.canActivate();
    expect(result).toBeFalse();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledWith('/fiat-ramps/user-email');
  });
});
