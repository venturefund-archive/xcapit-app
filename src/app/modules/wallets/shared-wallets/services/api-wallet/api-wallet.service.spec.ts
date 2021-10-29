import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CrudService } from 'src/app/shared/services/crud/crud.service';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { ApiWalletService } from './api-wallet.service';
const wallets = [
  {
    network: 'ERC20',
    address: 'testERC20Address',
  },
  {
    network: 'RSK',
    address: 'testRSKAddress',
  },
];
describe('ApiWalletService', () => {
  let service: ApiWalletService;
  let crudSpy;
  let customHttpServiceSpy: jasmine.SpyObj<CustomHttpService>;

  beforeEach(() => {
    crudSpy = jasmine.createSpyObj('CrudService', ['getEndpoints']);
    customHttpServiceSpy = jasmine.createSpyObj('CustomHttpService', {
      post: of({}),
      get: of({}),
      put: of({}),
    });
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: CrudService, useValue: crudSpy },
        { provide: CustomHttpService, useValue: customHttpServiceSpy },
      ],
    });
    service = TestBed.inject(ApiWalletService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call post on getPrices with coins', () => {
    service.getPrices([]).subscribe(() => {
      expect(customHttpServiceSpy.post).toHaveBeenCalledWith(jasmine.any(String), { bases: [] }, null, true);
    });
  });

  it('should call post on getPrices with coins and loading false', () => {
    service.getPrices([], false).subscribe(() => {
      expect(customHttpServiceSpy.post).toHaveBeenCalledWith(jasmine.any(String), { bases: [] }, null, false);
    });
  });

  it('should call post on saveWalletAddresses', () => {
    service.saveWalletAddresses(wallets).subscribe(() => {
      expect(customHttpServiceSpy.post).toHaveBeenCalledWith(jasmine.any(String), wallets);
    });
  });
});
