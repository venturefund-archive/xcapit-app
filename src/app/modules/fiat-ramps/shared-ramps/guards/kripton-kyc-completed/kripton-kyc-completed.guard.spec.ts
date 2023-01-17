import { TestBed } from '@angular/core/testing';
import { NavController } from '@ionic/angular';
import { KriptonUserInjectable } from '../../models/kripton-user/injectable/kripton-user.injectable';
import { KriptonKycCompletedGuard } from './kripton-kyc-completed.guard';
import { KriptonUser } from '../../models/kripton-user/kripton-user';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';

describe('KriptonKycCompleted', () => {
  let kriptonUserInjectableSpy: jasmine.SpyObj<KriptonUserInjectable>;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  let guard: KriptonKycCompletedGuard;
  let kriptonUserSpy: jasmine.SpyObj<KriptonUser>;

  beforeEach(() => {
    navControllerSpy = new FakeNavController().createSpy();
    kriptonUserSpy = jasmine.createSpyObj('KriptonUser', {
      userStatus: Promise.resolve('COMPLETE'),
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
    guard = TestBed.inject(KriptonKycCompletedGuard);
  });

  it('new', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow access if user status is complete', async () => {
    const result = await guard.canActivate();
    expect(result).toBeTrue();
  });

  it('should not allow access if user status is not complete', async () => {
    kriptonUserSpy.userStatus.and.resolveTo('USER_INFORMATION');
    const result = await guard.canActivate();
    expect(result).toBeFalse();
    expect(navControllerSpy.navigateForward).toHaveBeenCalledOnceWith('/fiat-ramps/user-register');
  });
});
