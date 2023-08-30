import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AmountOf } from 'src/app/modules/wallets/shared-wallets/models/blockchain-tx/amount-of/amount-of';
import { BlockchainRepo } from 'src/app/modules/swaps/shared-swaps/models/blockchain-repo/blockchain-repo';
import { DefaultBlockchains } from 'src/app/modules/swaps/shared-swaps/models/blockchains/blockchains';
import { BlockchainsFactory } from 'src/app/modules/swaps/shared-swaps/models/blockchains/factory/blockchains.factory';
import { rawBlockchainsData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-blockchains-data';
import { rawETHData, rawMATICData, rawSAMOData, rawSOLData, rawTokensData, rawUSDCData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-tokens-data';
import { GasStationOfFactory } from 'src/app/modules/swaps/shared-swaps/models/gas-station-of/factory/gas-station-of.factory';
import { DefaultToken } from 'src/app/modules/swaps/shared-swaps/models/token/token';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { NONPROD_COINS } from '../../constants/coins.nonprod';
import { PROD_COINS } from '../../constants/coins.prod';
import { ApiWalletService } from './api-wallet.service';


describe('ApiWalletService', () => {

  const weiGasPriceTestValue = '100000000000';
  const blockchains = new DefaultBlockchains(new BlockchainRepo(rawBlockchainsData));
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
  let service: ApiWalletService;
  let customHttpServiceSpy: jasmine.SpyObj<CustomHttpService>;
  let gasStationOfFactorySpy: jasmine.SpyObj<GasStationOfFactory>;
  let blockchainsFactorySpy: jasmine.SpyObj<BlockchainsFactory>;

  beforeEach(() => {
    blockchainsFactorySpy = jasmine.createSpyObj('BlockchainsFactory', {
      create: blockchains,
    });

    gasStationOfFactorySpy = jasmine.createSpyObj('GasStationOfFactory', {
      create: {
        price: () => ({
          standard: () => Promise.resolve(new AmountOf(weiGasPriceTestValue, new DefaultToken(rawETHData))),
        }),
      },
    });

    customHttpServiceSpy = jasmine.createSpyObj('CustomHttpService', {
      post: of({}),
      get: of({}),
      put: of({}),
    });
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: CustomHttpService, useValue: customHttpServiceSpy },
        { provide: GasStationOfFactory, useValue: gasStationOfFactorySpy },
        { provide: BlockchainsFactory, useValue: blockchainsFactorySpy },
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

  it('should get networks on getNetworks', () => {
    const networks = service.getNetworks();
    expect(new Set(networks)).toEqual(new Set(['ERC20', 'RSK', 'BSC_BEP20', 'MATIC', 'SOLANA']));
  });

  it('should get new networks on getWalletNewNetworks', () => {
    const encryptedWalletTest = {
      addresses: {
        MATIC: 'testAddress',
        RSK: 'testAddress',
      },
    };
    const networks = service.getWalletNewNetworks(encryptedWalletTest);
    expect(new Set(networks)).toEqual(new Set(['ERC20', 'BSC_BEP20', 'SOLANA']));
  });

  it('should get gas price', async () => {
    expect(await service.getGasPrice()).toEqual(weiGasPriceTestValue);
  });

  describe('with getCoins Fixed', () => {

    beforeEach(() => {
      spyOn(service, 'getCoins').and.returnValue(rawTokensData);
    });

    it('should get ERC20 coins on getCoinsFromNetwork', () => {
      const blockchainName = 'ERC20';
      const tokens = service.getCoinsFromNetwork(blockchainName).filter(token => token.network === blockchainName);

      expect(tokens.length).toBeGreaterThan(0);
    });

    it('should get coin by coin and network on getCoin', () => {
      expect(service.getCoin('USDC', 'MATIC')).toEqual(rawUSDCData);
    });

    it('should get native token from network on getNativeTokenFromNetwork', () => {
      expect(service.getNativeTokenFromNetwork('SOLANA')).toEqual(rawSOLData);
    });

    it('should get one networks from coin on getNetworks', () => {
      expect(service.getNetworks('SAMO')).toEqual(['SOLANA']);
    });

    it('should get native and investable coins on getInitialTokens', () => {
      expect(service.getInitialTokens()).toContain(rawUSDCData);
      expect(service.getInitialTokens()).toContain(rawMATICData);
    })
  });
});
