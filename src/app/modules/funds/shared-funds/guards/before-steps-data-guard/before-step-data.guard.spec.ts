import { TestBed } from '@angular/core/testing';

import { BeforeStepDataGuard } from './before-step-data.guard';
import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { FundDataStorageService } from '../../services/fund-data-storage/fund-data-storage.service';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { NavController } from '@ionic/angular';

let fundDataStorageServiceMock;
let fundDataStorageService;
let fakeNavController: FakeNavController;
let navControllerSpy: any;

describe('BeforeStepDataGuard', () => {
  fakeNavController = new FakeNavController({}, {}, {});
  navControllerSpy = fakeNavController.createSpy();
  let beforeStepDataGuard: BeforeStepDataGuard;
  beforeEach(() => {
    fundDataStorageServiceMock = {
      canActivatePage: () => Promise.resolve(true),
    };
    TestBed.configureTestingModule({
      providers: [
        BeforeStepDataGuard,
        {
          provide: FundDataStorageService,
          useValue: fundDataStorageServiceMock,
        },
        {
          provide: NavController,
          useValue: navControllerSpy,
        },
      ],
    });
  });

  beforeEach(() => {
    beforeStepDataGuard = TestBed.inject(BeforeStepDataGuard);
    fundDataStorageService = TestBed.inject(FundDataStorageService);
  });

  it('should create', () => {
    expect(BeforeStepDataGuard).toBeTruthy();
  });

  it('should be able to hit route when before data is valid', async () => {
    const spy = spyOn(fundDataStorageService, 'canActivatePage');
    spy.and.returnValue(Promise.resolve(true));
    await expectAsync(
      beforeStepDataGuard.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    ).toBeResolvedTo(true);
  });

  it('should not be able to hit route when before data is invalid', async () => {
    const spy = spyOn(fundDataStorageService, 'canActivatePage');
    spy.and.returnValue(Promise.resolve(false));
    await expectAsync(
      beforeStepDataGuard.canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    ).toBeResolvedTo(false);
  });
});
