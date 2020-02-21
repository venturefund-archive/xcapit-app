import { TestBed, inject } from '@angular/core/testing';

import { BeforeStepDataGuard } from './before-step-data.guard';
import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { FundDataStorageService } from '../../services/fund-data-storage/fund-data-storage.service';
import { RouterTestingModule } from '@angular/router/testing';
let fundDataStorageServiceMock;
let fundDataStorageService;

describe('BeforeStepDataGuard', () => {
  let beforeStepDataGuard: BeforeStepDataGuard;
  beforeEach(() => {
    fundDataStorageServiceMock = {
      canActivatePage: () => Promise.resolve(true)
    };
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [
        BeforeStepDataGuard,
        {
          provide: FundDataStorageService,
          useValue: fundDataStorageServiceMock
        }
      ]
    });
  });

  beforeEach(() => {
    beforeStepDataGuard = TestBed.get(BeforeStepDataGuard);
    fundDataStorageService = TestBed.get(FundDataStorageService);
  });

  it('should ...', () => {
    expect(BeforeStepDataGuard).toBeTruthy();
  });

  it('should be able to hit route when before data is valid', async done => {
    const spy = spyOn(fundDataStorageService, 'canActivatePage');
    spy.and.returnValue(Promise.resolve(true));
    beforeStepDataGuard
      .canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
      .then(result => {
        expect(result).toBeTruthy();
        done();
      });
  });

  it('should not be able to hit route when before data is invalid', async done => {
    const spy = spyOn(fundDataStorageService, 'canActivatePage');
    spy.and.returnValue(Promise.resolve(false));
    beforeStepDataGuard
      .canActivate({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
      .then(result => {
        expect(result).toBeFalsy();
        done();
      });
  });
});
