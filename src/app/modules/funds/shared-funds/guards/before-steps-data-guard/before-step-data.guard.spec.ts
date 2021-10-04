import { TestBed } from '@angular/core/testing';

import { BeforeStepDataGuard } from './before-step-data.guard';
import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { FundDataStorageService } from '../../services/fund-data-storage/fund-data-storage.service';
import { RouterTestingModule } from '@angular/router/testing';
import { DummyComponent } from '../../../../../../testing/dummy.component.spec';

let fundDataStorageServiceMock;
let fundDataStorageService;

describe('BeforeStepDataGuard', () => {
  let beforeStepDataGuard: BeforeStepDataGuard;
  beforeEach(() => {
    fundDataStorageServiceMock = {
      canActivatePage: () => Promise.resolve(true),
    };
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'funds/fund-name', component: DummyComponent }])],
      providers: [
        BeforeStepDataGuard,
        {
          provide: FundDataStorageService,
          useValue: fundDataStorageServiceMock,
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
