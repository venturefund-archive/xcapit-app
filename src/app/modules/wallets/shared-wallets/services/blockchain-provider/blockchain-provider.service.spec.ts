import { TestBed } from '@angular/core/testing';
import { BlockchainProviderService } from './blockchain-provider.service';
import { BigNumber, ethers } from 'ethers';
import { Coin } from '../../interfaces/coin.interface';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TransactionRequest } from '@ethersproject/abstract-provider';
import { ApiWalletService } from '../api-wallet/api-wallet.service';

const tokenAbi: any = [
  {
    contractAbi: true,
  },
];

const testCoins: Coin[] = [
  {
    id: 1,
    name: 'coinTest',
    logoRoute: '../../assets/img/coins/ETH.svg',
    last: false,
    value: 'ETH',
    network: 'ERC20',
    chainId: 42,
    rpc: 'http://testrpc.test',
    native: true,
  },
  {
    id: 2,
    name: 'coinTest2',
    logoRoute: '../../assets/img/coins/USDT.svg',
    last: false,
    value: 'USDT',
    network: 'ERC20',
    chainId: 42,
    rpc: 'http://testrpc.test',
    contract: '0x00000000000000',
    abi: tokenAbi,
    decimals: 6,
  },
];

const testTx: ethers.utils.Deferrable<TransactionRequest>[] = [
  {
    to: 'testAddress',
    value: ethers.utils.parseEther('1'),
  },
  {
    to: 'testAddress',
    data: 'testData',
  },
];

describe('BlockchainProviderService', () => {
  let service: BlockchainProviderService;
  let providerMock;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  beforeEach(() => {
    providerMock = {
      getBalance: (): Promise<BigNumber> => Promise.resolve(BigNumber.from('0xfffffffffffffff')),
      balanceOf: (): Promise<BigNumber> => Promise.resolve(BigNumber.from('0x000000000000F4240')),
    };

    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
      getCoins: testCoins,
    });
    TestBed.configureTestingModule({
      providers: [{ provide: ApiWalletService, useValue: apiWalletServiceSpy }],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(BlockchainProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a new provider when createProvider() is called', () => {
    service.createProvider = () => providerMock;

    const provider = service.createProvider('rpc');

    expect(provider.getBalance).toEqual(providerMock.getBalance);
  });

  it('should return a new contract when createContract() is called', () => {
    service.createContract = () => providerMock;

    const contract = service.createContract('contract', 'abi', 'provider');

    expect(contract.balanceOf).toEqual(providerMock.balanceOf);
  });

  [
    {
      coinValue: 'ETH',
      contract: undefined,
      abi: undefined,
      decimals: 18,
    },
    {
      coinValue: 'USDT',
      contract: '0x00000000000000',
      abi: tokenAbi,
      decimals: 6,
    },
  ].forEach((data) => {
    it(`should returns contract: ${data.contract},  abi: ${JSON.stringify(data.abi)} and decimals: ${
      data.decimals
    } for ${data.coinValue} when getProvider() is called`, async () => {
      service.createProvider = () => providerMock;
      service.createContract = () => providerMock;
      const response = await service.getProvider(data.coinValue);

      expect(response.contract).toBe(data.contract);
      expect(response.abi).toEqual(data.abi);
      expect(response.decimals).toEqual(data.decimals);
    });
  });

  [
    {
      coinValue: 'ETH',
      balance: '1.152921504606846975',
    },
    {
      coinValue: 'USDT',
      balance: '1.0',
    },
  ].forEach((data) => {
    it(`should obtain ${data.coinValue} balance and format output when formattedBalanceOf() is called`, async () => {
      service.createProvider = () => providerMock;
      service.createContract = () => providerMock;

      const response = await service.getFormattedBalanceOf('testAddress', data.coinValue);

      expect(response).toEqual(data.balance);
    });
  });

  it('should calculate the fee for native token on estimateFee', async () => {
    const gas = 2;
    const gasPrice = 10;
    const providerSpy = jasmine.createSpyObj('Provider', {
      estimateGas: BigNumber.from(gas),
      getGasPrice: BigNumber.from(gasPrice),
    });
    spyOn(service, 'getProvider').and.returnValue(Promise.resolve({ provider: providerSpy }));
    const expectedFee = BigNumber.from(gas * gasPrice);
    const estimatedFee = await service.estimateFee(testTx[0], testCoins[0]);
    expect(estimatedFee).toEqual(expectedFee);
  });

  it('should calculate the fee for not native token on estimateFee', async () => {
    const gas = 2;
    const gasPrice = 10;
    const providerSpy = jasmine.createSpyObj('Provider', {
      estimateGas: BigNumber.from(gas),
      getGasPrice: BigNumber.from(gasPrice),
    });
    spyOn(service, 'getProvider').and.returnValue(Promise.resolve({ provider: providerSpy }));
    const expectedFee = BigNumber.from(gas * gasPrice);
    const estimatedFee = await service.estimateFee(testTx[1], testCoins[0]);
    expect(estimatedFee).toEqual(expectedFee);
  });

  it('should retun zero fee when estimateGas fails to calculate the fee for tokens', async () => {
    const gasPrice = 10;
    const providerSpy = jasmine.createSpyObj('Provider', {
      estimateGas: Promise.reject(),
      getGasPrice: BigNumber.from(gasPrice),
    });
    spyOn(service, 'getProvider').and.returnValue(Promise.resolve({ provider: providerSpy }));
    const estimatedFee = await service.estimateFee(testTx[1], testCoins[1]);
    expect(estimatedFee).toEqual(BigNumber.from(0));
  });
});
