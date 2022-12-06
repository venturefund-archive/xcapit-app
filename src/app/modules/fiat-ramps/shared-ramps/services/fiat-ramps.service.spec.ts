import { TestBed } from '@angular/core/testing';
import { FiatRampsService } from './fiat-ramps.service';
import { of } from 'rxjs';
import { CustomHttpService } from '../../../../shared/services/custom-http/custom-http.service';
import { rawProvidersData } from '../fixtures/raw-providers-data';
import { ProvidersFactory } from '../models/providers/factory/providers.factory';
import { Providers } from '../models/providers/providers.interface';

describe('FiatRampsService', () => {
  let fiatRampsService: FiatRampsService;
  let customHttpServiceSpy: jasmine.SpyObj<CustomHttpService>;
  let providersFactorySpy: jasmine.SpyObj<ProvidersFactory>;
  let providersSpy: jasmine.SpyObj<Providers>;

  beforeEach(() => {
    customHttpServiceSpy = jasmine.createSpyObj('CustomHttpService', {
      post: of({}),
      get: of({}),
      put: of({}),
    });

    providersSpy = jasmine.createSpyObj('Providers', {
      all: rawProvidersData,
      byAlias: rawProvidersData.find((provider) => provider.alias === 'PX'),
    });

    providersFactorySpy = jasmine.createSpyObj('ProvidersFactory', {
      create: providersSpy,
    });

    TestBed.configureTestingModule({
      providers: [
        { provide: CustomHttpService, useValue: customHttpServiceSpy },
        { provide: ProvidersFactory, useValue: providersFactorySpy },
      ],
    });
    fiatRampsService = TestBed.inject(FiatRampsService);
    fiatRampsService.setProvider(`${rawProvidersData[1].id}`);
  });

  it('should be created', () => {
    expect(fiatRampsService).toBeTruthy();
  });

  it('should call get on http when getQuotations', () => {
    fiatRampsService.getQuotations().subscribe(() => {
      expect(customHttpServiceSpy.get).toHaveBeenCalledTimes(1);
    });
  });

  it('should call get on http when getUserWallets', () => {
    fiatRampsService.getUserWallets('ETH').subscribe(() => {
      expect(customHttpServiceSpy.get).toHaveBeenCalledTimes(1);
    });
  });

  it('should call post on http when getOrCreateUser', () => {
    fiatRampsService.getOrCreateUser({}).subscribe(() => {
      expect(customHttpServiceSpy.post).toHaveBeenCalledTimes(1);
    });
  });

  it('should call post on http when registerUserInfo', () => {
    fiatRampsService.registerUserInfo({}).subscribe(() => {
      expect(customHttpServiceSpy.post).toHaveBeenCalledTimes(1);
    });
  });

  it('should call post on http when registerUserBank', () => {
    fiatRampsService.registerUserBank({}).subscribe(() => {
      expect(customHttpServiceSpy.post).toHaveBeenCalledTimes(1);
    });
  });

  it('should call post on http when registerUserImages', () => {
    fiatRampsService.registerUserImages({}).subscribe(() => {
      expect(customHttpServiceSpy.post).toHaveBeenCalledTimes(1);
    });
  });

  it('should call post on http when createOperation', () => {
    fiatRampsService.createOperation({}).subscribe(() => {
      expect(customHttpServiceSpy.post).toHaveBeenCalledTimes(1);
    });
  });

  it('should call post on http when confirmOperation', () => {
    fiatRampsService.confirmOperation(0, {}).subscribe(() => {
      expect(customHttpServiceSpy.post).toHaveBeenCalledTimes(1);
    });
  });

  it('should call get on http when userHasOperations', () => {
    fiatRampsService.userHasOperations().subscribe(() => {
      expect(customHttpServiceSpy.get).toHaveBeenCalledTimes(1);
    });
  });

  it('should call post on http when getLink', () => {
    fiatRampsService.getLink(0).subscribe(() => {
      expect(customHttpServiceSpy.post).toHaveBeenCalledTimes(1);
    });
  });

  it('should call get on http when getUserOperations', () => {
    fiatRampsService.getUserOperations({ email: 'test@test.com' }).subscribe(() => {
      expect(customHttpServiceSpy.post).toHaveBeenCalledTimes(1);
    });
  });

  it('should call get on http when getUserSingleOperation', () => {
    fiatRampsService.getUserSingleOperation(0, { email: 'test@test.com' }).subscribe(() => {
      expect(customHttpServiceSpy.post).toHaveBeenCalledTimes(1);
    });
  });

  it('should call post on http when getMoonpayRedirectLink', () => {
    fiatRampsService.getMoonpayRedirectLink('0x0000', 'eth', 'usd', 50).subscribe(() => {
      expect(customHttpServiceSpy.post).toHaveBeenCalledTimes(1);
    });
  });

  it('should return Kripton provider on getProvider when id is 1', () => {
    const provider = fiatRampsService.getProvider(1);
    expect(provider.alias).toEqual('kripton');
  });

  it('should call get on http when getDirectaExchangeRate', () => {
    fiatRampsService.getDirectaExchangeRate('ARS', 'USDC', 1).subscribe(() => {
      expect(customHttpServiceSpy.get).toHaveBeenCalledTimes(1);
    });
  });

  it('should call get on http when getMoonpayQuotation', () => {
    fiatRampsService.getMoonpayQuotation('USDC_polygon').subscribe(() => {
      expect(customHttpServiceSpy.get).toHaveBeenCalledTimes(1);
    });
  });

  it('should call post on http when getKriptonAccessToken', () => {
    fiatRampsService.getKriptonAccessToken({ email: 'test@test.com' }).subscribe(() => {
      expect(customHttpServiceSpy.post).toHaveBeenCalledTimes(1);
    });
  });

  it('should call post on http when kriptonLogin', () => {
    fiatRampsService.kriptonLogin({ email: 'test@test.com', token: '123456' }).subscribe(() => {
      expect(customHttpServiceSpy.post).toHaveBeenCalledTimes(1);
    });
  });
});
