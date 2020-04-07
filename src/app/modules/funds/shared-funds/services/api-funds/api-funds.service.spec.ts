import { TestBed } from '@angular/core/testing';

import { ApiFundsService } from './api-funds.service';
import { CrudService } from 'src/app/shared/services/crud/crud.service';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { JwtHelperService } from '@auth0/angular-jwt';

describe('ApiFundsService', () => {
  let crudSpy: any;
  let customHttpServiceSpy: any;
  let apiFundsService: ApiFundsService;
  let storageSpy: any;
  let jwtHelperServiceSpy: any;
  let service: ApiFundsService;

  beforeEach(() => {
    storageSpy = jasmine.createSpyObj('Storage', ['get', 'set', 'remove']);
    jwtHelperServiceSpy = jasmine.createSpyObj('JwtHelperService', [
      'isTokenExpired'
    ]);
    crudSpy = jasmine.createSpyObj('CrudService', ['getEndpoints']);
    customHttpServiceSpy = jasmine.createSpyObj('CustomHttpService', {
      post: of({}),
      get: of({}),
      put: of({})
    });

    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [
        { provide: CrudService, useValue: crudSpy },
        { provide: CustomHttpService, useValue: customHttpServiceSpy },
        { provide: Storage, useValue: storageSpy },
        { provide: JwtHelperService, useValue: jwtHelperServiceSpy }
      ]
    });
    customHttpServiceSpy = TestBed.get(CustomHttpService);
    apiFundsService = TestBed.get(ApiFundsService);
  });

  beforeEach(() => {
    service = TestBed.get(ApiFundsService);
  });

  it('should be created', () => {
    expect(apiFundsService).toBeTruthy();
  });

  it('should be call get on http when getSubscribedFunds', () => {
    service.getSubscribedFunds().subscribe(() => {
      expect(customHttpServiceSpy.get).toHaveBeenCalledTimes(1);
    });
  });

  it('should be call get on http when getStatus', () => {
    service.getPerformance('test').subscribe(() => {
      expect(customHttpServiceSpy.get).toHaveBeenCalledTimes(1);
    });
  });

  it('should be call get on http when getBalance', () => {
    service.getBalance('test', 'BTC').subscribe(() => {
      expect(customHttpServiceSpy.get).toHaveBeenCalledTimes(1);
    });
  });

  it('should be call get on http when getFundRuns', () => {
    service.getFundRuns('active', 'test').subscribe(() => {
      expect(customHttpServiceSpy.get).toHaveBeenCalledTimes(1);
    });
  });

  it('should be call put on http when changeFundCA', () => {
    service.changeFundCA('test', 'BTC').subscribe(() => {
      expect(customHttpServiceSpy.put).toHaveBeenCalledTimes(1);
    });
  });

  it('should be call put on http when changeFundCA', () => {
    service.changeFundCA('test', 'BTC').subscribe(() => {
      expect(customHttpServiceSpy.put).toHaveBeenCalledTimes(1);
    });
  });

  it('should be call put on http when pauseFundRuns', () => {
    service.pauseFundRuns('test').subscribe(() => {
      expect(customHttpServiceSpy.put).toHaveBeenCalledTimes(1);
    });
  });

  it('should be call put on http when resumeFundRuns', () => {
    service.resumeFundRuns('test').subscribe(() => {
      expect(customHttpServiceSpy.put).toHaveBeenCalledTimes(1);
    });
  });

  it('should be call put on http when finalizeFundRuns', () => {
    service.finalizeFundRuns('test').subscribe(() => {
      expect(customHttpServiceSpy.put).toHaveBeenCalledTimes(1);
    });
  });

  it('should be call post on http when renewFund', () => {
    service.renewFund('test').subscribe(() => {
      expect(customHttpServiceSpy.post).toHaveBeenCalledTimes(1);
    });
  });

  it('should be call get on http when isSubscribed', () => {
    service.isSubscribed('test').subscribe(() => {
      expect(customHttpServiceSpy.get).toHaveBeenCalledTimes(1);
    });
  });

  it('should be call get on http when getCommissions', () => {
    service.getCommissions().subscribe(() => {
      expect(customHttpServiceSpy.get).toHaveBeenCalledTimes(1);
    });
  });

  it('should be call get on http when isOwner', () => {
    service.isOwner('test').subscribe(() => {
      expect(customHttpServiceSpy.get).toHaveBeenCalledTimes(1);
    });
  });

  it('should be call get on http when getFundBalances', () => {
    service.getFundBalances('all').subscribe(() => {
      expect(customHttpServiceSpy.get).toHaveBeenCalledTimes(1);
    });
  });

  it('should be call get on http when getFundBalances', () => {
    service.getFundBalances('all').subscribe(() => {
      expect(customHttpServiceSpy.get).toHaveBeenCalledTimes(1);
    });
  });

  it('should be call get on http when getTotalBalance', () => {
    service.getTotalBalance('BTC').subscribe(() => {
      expect(customHttpServiceSpy.get).toHaveBeenCalledTimes(1);
    });
  });

  it('should be call get on http when getTotalBalance', () => {
    service.getTotalBalance('BTC').subscribe(() => {
      expect(customHttpServiceSpy.get).toHaveBeenCalledTimes(1);
    });
  });

  it('should be call get on http when count', () => {
    service.count().subscribe(() => {
      expect(customHttpServiceSpy.get).toHaveBeenCalledTimes(1);
    });
  });

  it('should be call get on http when getMetrics', () => {
    service.getMetrics('test').subscribe(() => {
      expect(customHttpServiceSpy.get).toHaveBeenCalledTimes(1);
    });
  });
});
