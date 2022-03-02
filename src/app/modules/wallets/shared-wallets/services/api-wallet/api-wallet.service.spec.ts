import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CrudService } from 'src/app/shared/services/crud/crud.service';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { NONPROD_COINS } from '../../constants/coins.nonprod';
import { PROD_COINS } from '../../constants/coins.prod';
import { TEST_COINS } from '../../constants/coins.test';
import { Coin } from '../../interfaces/coin.interface';
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

const testCoins: Coin[] = [
  {
    id: 5,
    name: 'UNI - Uniswap',
    logoRoute: 'assets/img/coins/UNI.svg',
    last: true,
    value: 'UNI',
    network: 'ERC20',
    chainId: 42,
    rpc: 'testRpc',
    contract: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
    abi: 'testAbi',
    decimals: 18,
  },
  {
    id: 6,
    name: 'RBTC - Smart Bitcoin',
    logoRoute: 'assets/img/coins/RBTC.png',
    last: false,
    value: 'RBTC',
    network: 'RSK',
    chainId: 31,
    rpc: 'testRpc',
    native: true,
  },
  {
    id: 5,
    name: 'UNI - Uniswap',
    logoRoute: 'assets/img/coins/UNI.svg',
    last: true,
    value: 'UNI',
    network: 'RSK',
    chainId: 42,
    rpc: 'testRpc',
    contract: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
    abi: 'testAbi',
    decimals: 18,
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

  it('should return prod coins when environment is production', () => {
    service.env = 'PRODUCCION';
    const coins = service.getCoins();
    expect(coins).toEqual(PROD_COINS);
  });

  it('should return nonprod coins when environment is not production', () => {
    service.env = 'PREPROD';
    const coins = service.getCoins();
    expect(coins).toEqual(NONPROD_COINS);
  });

  it('should call get on getNFTStatus with loading false', () => {
    service.getNFTStatus().subscribe(() => {
      expect(customHttpServiceSpy.get).toHaveBeenCalledWith(jasmine.any(String), undefined, undefined, false);
    });
  });

  it('should call post on createNFTRequest with loading false', () => {
    service.createNFTRequest().subscribe(() => {
      expect(customHttpServiceSpy.post).toHaveBeenCalledWith(jasmine.any(String), undefined, undefined, false);
    });
  });

  it('should call post on saveWalletAddresses', () => {
    service.saveWalletAddresses(wallets).subscribe(() => {
      expect(customHttpServiceSpy.post).toHaveBeenCalledWith(jasmine.any(String), wallets);
    });
  });

  it('should get ERC20 coins on getCoinsFromNetwork', () => {
    spyOn(service, 'getCoins').and.returnValue(testCoins);
    const coins = service.getCoinsFromNetwork('ERC20');
    expect(coins).toEqual([testCoins[0]]);
  });

  it('should get networks on getNetworks', () => {
    const networks = service.getNetworks();
    expect(new Set(networks)).toEqual(new Set(['ERC20', 'RSK', 'BSC_BEP20', 'MATIC']));
  });

  it('should get coin by coin on getCoin', () => {
    spyOn(service, 'getCoins').and.returnValue(testCoins);
    const coin = service.getCoin('RBTC');
    expect(coin).toEqual(testCoins[1]);
  });

  it('should get coin by coin and network on getCoin', () => {
    spyOn(service, 'getCoins').and.returnValue(testCoins);
    const coin = service.getCoin('RBTC', 'RSK');
    expect(coin).toEqual(testCoins[1]);
  });

  it('should get new networks on getWalletNewNetworks', () => {
    const encryptedWalletTest = {
      addresses: {
        MATIC: 'testAddress',
        RSK: 'testAddress',
      },
    };
    const networks = service.getWalletNewNetworks(encryptedWalletTest);
    expect(new Set(networks)).toEqual(new Set(['ERC20', 'BSC_BEP20']));
  });

  it('should get native token from network on getNativeTokenFromNetwork', () => {
    spyOn(service, 'getCoins').and.returnValue(testCoins);
    const coin = service.getNativeTokenFromNetwork('RSK');
    expect(coin.value).toEqual(testCoins[1].value);
  });

  it('should get gas price', () => {
    service.getGasPrice().subscribe(() => {
      expect(customHttpServiceSpy.get).toHaveBeenCalledTimes(1);
    });
  });

  it('should get multiple networks from coin on getNetworks', () => {
    spyOn(service, 'getCoins').and.returnValue(testCoins);
    const networks = service.getNetworks('UNI');
    expect(networks).toEqual(['ERC20', 'RSK']);
  });

  it('should get one networks from coin on getNetworks', () => {
    spyOn(service, 'getCoins').and.returnValue(testCoins);
    const networks = service.getNetworks('RBTC');
    expect(networks).toEqual(['RSK']);
  });
});
