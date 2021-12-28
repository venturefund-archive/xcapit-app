import { TestBed } from '@angular/core/testing';
import { WalletTransactionsService } from './wallet-transactions.service';
import { WalletEncryptionService } from '../wallet-encryption/wallet-encryption.service';
import { BlockchainProviderService } from '../blockchain-provider/blockchain-provider.service';
import { Coin } from '../../interfaces/coin.interface';
import { BigNumber, ethers } from 'ethers';
import { Storage } from '@ionic/storage';
import { StorageService } from '../storage-wallets/storage-wallets.service';
import { of } from 'rxjs';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { FakeConnectedWallet } from '../../../../../../testing/fakes/wallet.fake.spec';
import { EthersService } from '../ethers/ethers.service';
import { FakeEthersService } from '../../../../../../testing/fakes/ethers.fake.spec';

const ETH: Coin = {
  id: 1,
  name: 'ETH - Ethereum',
  logoRoute: 'assets/img/coins/ETH.svg',
  last: false,
  value: 'ETH',
  network: 'ERC20',
  chainId: 42,
  rpc: 'testRpc',
  native: true,
};

const USDT: Coin = {
  id: 3,
  name: 'USDT - Tether',
  logoRoute: 'assets/img/coins/USDT.svg',
  last: false,
  value: 'USDT',
  network: 'ERC20',
  chainId: 42,
  rpc: 'testRPC',
  contract: 'testContract',
  abi: null,
  decimals: 6,
};

const LINK: Coin = {
  id: 3,
  name: 'LINK - Chainlink',
  logoRoute: '../../assets/img/coins/LINK.svg',
  last: false,
  value: 'LINK',
  network: '',
  chainId: 42,
  rpc: '',
  contract: 'testContractAddress',
  decimals: 18,
  abi: JSON.parse(JSON.stringify({ test: 'abi' })),
};

const testSummaryDatas = {
  notNativeTokenSend: {
    balanceLessThanFee: {
      currency: USDT,
      address: 'testAddress',
      amount: 1,
      referenceAmount: 1,
      network: 'ERC20',
      balanceNativeToken: 1,
    },
    balanceGreaterThanFee: {
      currency: USDT,
      address: 'testAddress',
      amount: 1,
      referenceAmount: 1,
      network: 'ERC20',
      balanceNativeToken: 6,
    },
    balanceZero: {
      currency: USDT,
      address: 'testAddress',
      amount: 1,
      referenceAmount: 1,
      network: 'ERC20',
      balanceNativeToken: 0,
    },
    feeUndefinedWithBalanceGreaterThanZero: {
      currency: USDT,
      address: 'testAddress',
      amount: 1,
      referenceAmount: 1,
      network: 'ERC20',
      balanceNativeToken: 1,
    },
    feeUndefinedWithBalanceZero: {
      currency: USDT,
      address: 'testAddress',
      amount: 1,
      referenceAmount: 1,
      network: 'ERC20',
      balanceNativeToken: 0,
    },
  },
  nativeTokenSend: {
    balanceGreaterThanAmountLessThanFee: {
      currency: ETH,
      address: 'testAddress',
      amount: 1,
      referenceAmount: 3000,
      network: 'ERC20',
      balanceNativeToken: 2,
    },
    balanceGreaterThanAmountPlusFee: {
      currency: ETH,
      address: 'testAddress',
      amount: 1,
      referenceAmount: 3000,
      network: 'ERC20',
      balanceNativeToken: 7,
    },
    balanceZero: {
      currency: ETH,
      address: 'testAddress',
      amount: 1,
      referenceAmount: 3000,
      network: 'ERC20',
      balanceNativeToken: 0,
    },
    balanceLessThanFeeAndLessThanAmount: {
      currency: ETH,
      address: 'testAddress',
      amount: 2,
      referenceAmount: 6000,
      network: 'ERC20',
      balanceNativeToken: 1,
    },
    balanceLessThanAmountPlusFee: {
      currency: ETH,
      address: 'testAddress',
      amount: 10,
      referenceAmount: 30000,
      network: 'ERC20',
      balanceNativeToken: 11,
    },
  },
};

const testAddresses = { ETH_TEST: 'testAddress' };

const alchemyTransaction1 = {
  result: {
    transfers: [
      {
        asset: 'ETH',
        blockNum: '0xafafaa',
        category: 'external',
        erc721TokenId: null,
        from: '0x7c0c6bb31987b86f8e2879e17b65c6761f14bec9',
        hash: '0xf07807604443ccf3d533ba3ddb17163537f853e6be128a3f39854a37b9cdb1fe',
        rawContract: {
          address: null,
          decimal: '0x12',
          value: '0x35ef7aa21505800',
        },
        to: '0x9cbb2b28df12a6f520cfd4a97b8c89f89ee10c59',
        value: 0.24290374,
      },
    ],
  },
};

const alchemyTransaction2 = {
  result: {
    transfers: [
      {
        asset: 'USDT',
        blockNum: '0xafafad',
        category: 'external',
        erc721TokenId: null,
        from: '0x9cbb2b28df12a6f520cfd4a97b8c89f89ee10c59',
        hash: '0xf07807604443ccf3d533ba3ddb17163537f853e6be128a3f39854a37b9fffff',
        rawContract: {
          address: null,
          decimal: '0x12',
          value: '0x35ef7aa21505800',
        },
        to: '0x7c0c6bb31987b86f8e2879e17b65c6761f14bec9',
        value: 0.24290374,
      },
    ],
  },
};

const testStructure = [
  {
    asset: 'USDT',
    blockNumber: '0xafafad',
    erc721: null,
    from: '0x9cbb2b28df12a6f520cfd4a97b8c89f89ee10c59',
    hash: '0xf07807604443ccf3d533ba3ddb17163537f853e6be128a3f39854a37b9fffff',
    icon: 'assets/img/wallet-transactions/sended.svg',
    rawContract: false,
    swap: {
      amountOut: null,
      amountIn: null,
      currencyIn: '',
      currencyOut: '',
    },
    to: '0x7c0c6bb31987b86f8e2879e17b65c6761f14bec9',
    type: 'sended',
    value: 0.24290374,
  },
  {
    asset: 'ETH',
    blockNumber: '0xafafaa',
    erc721: null,
    from: '0x7c0c6bb31987b86f8e2879e17b65c6761f14bec9',
    hash: '0xf07807604443ccf3d533ba3ddb17163537f853e6be128a3f39854a37b9cdb1fe',
    icon: 'assets/img/wallet-transactions/received.svg',
    rawContract: false,
    swap: {
      amountOut: null,
      amountIn: null,
      currencyIn: '',
      currencyOut: '',
    },
    to: '0x9cbb2b28df12a6f520cfd4a97b8c89f89ee10c59',
    type: 'received',
    value: 0.24290374,
  },
];

describe('WalletTransactionsService', () => {
  let service: WalletTransactionsService;
  let blockchainProviderServiceMock: any;
  let storageServiceMock: any;
  let storageService: StorageService;
  let storageSpy: any;
  let customHttpServiceSpy;
  let walletEncryptionServiceSpy: any;
  let connectedWalletSpy;
  let fakeConnectedWallet: FakeConnectedWallet;
  let ethersServiceSpy: any;
  let fakeEthersService: FakeEthersService;

  beforeEach(() => {
    fakeEthersService = new FakeEthersService();
    ethersServiceSpy = fakeEthersService.createSpy();
    fakeConnectedWallet = new FakeConnectedWallet();
    connectedWalletSpy = fakeConnectedWallet.createSpy();

    walletEncryptionServiceSpy = jasmine.createSpyObj('WalletEncryptionService', {
      getDecryptedWalletForCurrency: Promise.resolve({ connect: () => connectedWalletSpy }),
    });

    blockchainProviderServiceMock = {
      getProvider: () => Promise.resolve({ contract: {}, provider: {}, abi: LINK.abi }),
      estimateFee: (summaryData) => Promise.resolve(BigNumber.from('5000000000000000000')),
    };

    storageSpy = jasmine.createSpyObj('Storage', ['get', 'set']);

    storageServiceMock = {
      getWalletsAddresses: () => Promise.resolve(testAddresses),
    };

    customHttpServiceSpy = jasmine.createSpyObj('CustomHttpService', {
      post: of(),
    });
    TestBed.configureTestingModule({
      providers: [
        { provide: WalletEncryptionService, useValue: walletEncryptionServiceSpy },
        { provide: BlockchainProviderService, useValue: blockchainProviderServiceMock },
        { provide: Storage, useValue: storageSpy },
        { provide: StorageService, useValue: storageServiceMock },
        { provide: CustomHttpService, useValue: customHttpServiceSpy },
        { provide: EthersService, useValue: ethersServiceSpy },
      ],
    });
    service = TestBed.inject(WalletTransactionsService);
    storageService = TestBed.inject(StorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send native token transaction', async () => {
    await service.send('testPassword', '20', 'testAddress', ETH);
    expect(connectedWalletSpy.sendTransaction).toHaveBeenCalledOnceWith({
      to: 'testAddress',
      value: ethers.utils.parseEther('20'),
    });
    expect(walletEncryptionServiceSpy.getDecryptedWalletForCurrency).toHaveBeenCalledOnceWith('testPassword', ETH);
  });

  it('should send no native token transaction', async () => {
    await service.send('testPassword', '20', 'testAddress', LINK);
    expect(connectedWalletSpy.sendTransaction).not.toHaveBeenCalled();
    expect(ethersServiceSpy.newContract).toHaveBeenCalledOnceWith('testContractAddress', LINK.abi, connectedWalletSpy);
  });

  it('should not call loading when loading is false', async () => {
    await service.send('testPassword', '20', 'testAddress', ETH);
    expect(connectedWalletSpy.sendTransaction).toHaveBeenCalledOnceWith({
      to: 'testAddress',
      value: ethers.utils.parseEther('20'),
    });
  });

  it('should be return a mapped structure when mapResponse', () => {
    const mapResponse = service.mapResponse(alchemyTransaction1.result.transfers, 'received');

    expect(mapResponse).toEqual([testStructure[1]]);
  });

  it('should be return a merged structure when mergeTransactions', () => {
    const received = service.mapResponse(alchemyTransaction1.result.transfers, 'received');
    const sended = service.mapResponse(alchemyTransaction2.result.transfers, 'sended');

    const merged = service.mergeTransactions(received, sended);

    expect(merged).toEqual(testStructure);
  });

  it('should be return all transactions of an ethereum wallet when getAllTransactions', async () => {
    customHttpServiceSpy.post.and.returnValues(of(alchemyTransaction1), of(alchemyTransaction2));

    const allTransactions = await service.getAllTransactions();

    expect(allTransactions).toEqual(testStructure);
  });

  it('should not send if password was invalid', async () => {
    walletEncryptionServiceSpy.getDecryptedWalletForCurrency.and.throwError('invalid password');
    await expectAsync(service.send('wrongPassword', '20', 'testAddress', ETH)).toBeRejected();
    expect(connectedWalletSpy.sendTransaction).not.toHaveBeenCalled();
  });

  describe('when user sends not native token', () => {
    [
      {
        summaryData: testSummaryDatas.notNativeTokenSend.balanceGreaterThanFee,
        testCase: 'greater than fee',
        expectedResult: false,
      },
      {
        summaryData: testSummaryDatas.notNativeTokenSend.balanceLessThanFee,
        testCase: 'less than fee',
        expectedResult: true,
      },
      {
        summaryData: testSummaryDatas.notNativeTokenSend.balanceZero,
        testCase: 'zero',
        expectedResult: true,
      },
    ].forEach((t) => {
      it(`it should return ${t.expectedResult} if native token balance is ${t.testCase} on canNotAffordFee`, async () => {
        const hasNotEnoughNativeToken = await service.canNotAffordFee(t.summaryData);
        expect(hasNotEnoughNativeToken).toEqual(t.expectedResult);
      });
    });
  });

  describe('when user sends native token', () => {
    [
      {
        summaryData: testSummaryDatas.nativeTokenSend.balanceGreaterThanAmountLessThanFee,
        testCase: 'greater than the amount but less than the fee',
        expectedResult: true,
      },
      {
        summaryData: testSummaryDatas.nativeTokenSend.balanceGreaterThanAmountPlusFee,
        testCase: 'greater than the sum of the amount and the fee',
        expectedResult: false,
      },
      {
        summaryData: testSummaryDatas.nativeTokenSend.balanceZero,
        testCase: 'zero',
        expectedResult: true,
      },
      {
        summaryData: testSummaryDatas.nativeTokenSend.balanceLessThanFeeAndLessThanAmount,
        testCase: 'less than the fee and less than the amount to send',
        expectedResult: true,
      },
      {
        summaryData: testSummaryDatas.nativeTokenSend.balanceLessThanAmountPlusFee,
        testCase: 'is greater than both the fee and the amount but smaller than the sum',
        expectedResult: true,
      },
    ].forEach((t) => {
      it(`it should return ${t.expectedResult} if native token balance is ${t.testCase} on canNotAffordFee`, async () => {
        const hasNotEnoughNativeToken = await service.canNotAffordFee(t.summaryData);
        expect(hasNotEnoughNativeToken).toEqual(t.expectedResult);
      });
    });
  });

  it('should not call newContract on createRawTxFromSummaryData if token is native', async () => {
    await service.createRawTxFromSummaryData(testSummaryDatas.nativeTokenSend.balanceGreaterThanAmountPlusFee);
    expect(ethersServiceSpy.newContract).toHaveBeenCalledTimes(0);
  });

  it('should call newContract on createRawTxFromSummaryData if token is not native', async () => {
    await service.createRawTxFromSummaryData(testSummaryDatas.notNativeTokenSend.balanceGreaterThanFee);
    expect(ethersServiceSpy.newContract).toHaveBeenCalledTimes(1);
  });
});
