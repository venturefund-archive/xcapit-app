import { TestBed } from '@angular/core/testing';
import { WalletTransactionsService } from './wallet-transactions.service';
import { WalletEncryptionService } from '../wallet-encryption/wallet-encryption.service';
import { BlockchainProviderService } from '../blockchain-provider/blockchain-provider.service';
import { Coin } from '../../interfaces/coin.interface';
import { BigNumber } from 'ethers';
import { Storage } from '@ionic/storage';
import { StorageService } from '../storage-wallets/storage-wallets.service';
import { of } from 'rxjs';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { FakeConnectedWallet } from '../../../../../../testing/fakes/wallet.fake.spec';
import { EthersService } from '../ethers/ethers.service';
import { FakeEthersService } from '../../../../../../testing/fakes/ethers.fake.spec';
import { FakeTokenSend } from 'src/testing/fakes/token-send.fake.spec';
import { FakeERC20Provider } from 'src/testing/fakes/erc20-provider.fake.spec';
import { parseEther, parseUnits } from 'ethers/lib/utils';
import { ERC20Contract } from 'src/app/modules/defi-investments/shared-defi-investments/models/erc20-contract/erc20-contract.model';
import { ApiWalletService } from '../api-wallet/api-wallet.service';
import { TokenSend } from '../../models/token-send/token-send.model';
import linkAbi from '../../constants/assets-abi-prod/link-abi-prod.json';

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
  abi: JSON.parse(JSON.stringify(linkAbi)),
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
class ERC20TokenMock {
  static balance = '0'; 
  static decimals = 18; 
  constructor(private readonly _aContract: ERC20Contract) {}

  approve() {}

  approveFee() {}

  transfer() {}

  transferFee() {}
  
  getGasPrice() {}

  balanceOf(address: string) {
      return parseUnits(ERC20TokenMock.balance, ERC20TokenMock.decimals);
  }
} 

describe('WalletTransactionsService', () => {
  let service: WalletTransactionsService;
  let storageServiceMock: any;
  let storageService: StorageService;
  let storageSpy: any;
  let customHttpServiceSpy;
  let walletEncryptionServiceSpy: any;
  let connectedWalletSpy;
  let fakeConnectedWallet: FakeConnectedWallet;
  let ethersServiceSpy: any;
  let fakeEthersService: FakeEthersService;
  let fakeErc20Provider: FakeERC20Provider;
  let erc20ProviderMockClass: any;
  let fakeTokenSend: FakeTokenSend;
  let tokenSendMockClass: any;
  let erc20TokenClass: any;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;

  beforeEach(() => {
    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
      getNativeTokenFromNetwork: ETH,
    });
    erc20TokenClass = ERC20TokenMock;

    fakeTokenSend = new FakeTokenSend();
    tokenSendMockClass = fakeTokenSend.createSpy('0.00012');
    fakeErc20Provider = new FakeERC20Provider();
    erc20ProviderMockClass = fakeErc20Provider.createSpy('1.0');

    fakeEthersService = new FakeEthersService();
    ethersServiceSpy = fakeEthersService.createSpy();
    fakeConnectedWallet = new FakeConnectedWallet();
    connectedWalletSpy = fakeConnectedWallet.createSpy();

    walletEncryptionServiceSpy = jasmine.createSpyObj('WalletEncryptionService', {
      getDecryptedWalletForCurrency: Promise.resolve({ connect: () => connectedWalletSpy }),
    });

    storageSpy = jasmine.createSpyObj('Storage', ['get', 'set']);

    storageServiceMock = {
      getWalletsAddresses: (network) => network ? Promise.resolve(testAddresses.ETH_TEST) : Promise.resolve(testAddresses),
    };

    customHttpServiceSpy = jasmine.createSpyObj('CustomHttpService', {
      post: of(),
    });
    TestBed.configureTestingModule({
      providers: [
        { provide: WalletEncryptionService, useValue: walletEncryptionServiceSpy },
        { provide: Storage, useValue: storageSpy },
        { provide: StorageService, useValue: storageServiceMock },
        { provide: CustomHttpService, useValue: customHttpServiceSpy },
        { provide: ApiWalletService, useValue: apiWalletServiceSpy },
      ],
    });
    service = TestBed.inject(WalletTransactionsService);
    storageService = TestBed.inject(StorageService);
    service.tokenSendClass = tokenSendMockClass;
    service.erc20ProviderClass = erc20ProviderMockClass;
    service.erc20TokenClass = erc20TokenClass;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send native token transaction', async () => {
    service.tokenSendClass = TokenSend;
    await service.send('testPassword', '20', 'testAddress', ETH);
    expect(connectedWalletSpy.sendTransaction).toHaveBeenCalledOnceWith({
      to: 'testAddress',
      value: parseEther('20'),
    });
    expect(walletEncryptionServiceSpy.getDecryptedWalletForCurrency).toHaveBeenCalledOnceWith('testPassword', ETH);
  });

  it('should call send with no native token transaction', async () => {
    await service.send('testPassword', '20', 'testAddress', LINK);
    expect(fakeTokenSend.spy.send).toHaveBeenCalledTimes(1);
  });

  it('should call send with native token transaction', async () => {
    await service.send('testPassword', '20', 'testAddress', ETH);
    expect(fakeTokenSend.spy.send).toHaveBeenCalledTimes(1);
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
    const fee = '0.00012';
    const amount = '1';

    const nativeBalances = [
      {
        name: 'native balance is zero',
        balance: '0',
        canAffordFees: false,
      },
      {
        name: 'native balance is less than fee',
        balance: '0.00002',
        canAffordFees: false,
      },
      {
        name: 'native balance is equal to fee',
        balance: '0.00012',
        canAffordFees: true,
      },
      {
        name: 'native balance greater than fee',
        balance: '0.01',
        canAffordFees: true,
      },
    ];

    const notNativeBalances = [
      {
        name: 'not native balance is zero',
        balance: '0',
        canAffordAmount: false,
      },
      {
        name: 'not native balance is less than amount',
        balance: '0.5',
        canAffordAmount: false,
      },
      {
        name: 'not native balance is equal to amount',
        balance: '1',
        canAffordAmount: true,
      },
      {
        name: 'not native balance greater than amount',
        balance: '10',
        canAffordAmount: true,
      },
    ];
    
    nativeBalances.forEach(nb => {
      notNativeBalances.forEach((nnb) => {
        it(`should return ${nb.canAffordFees && nnb.canAffordAmount} when ${nb.name} and ${nnb.name} on canAffordFee`, async () => {
          ERC20TokenMock.balance = nnb.balance;
          ERC20TokenMock.decimals = USDT.decimals;
          fakeTokenSend.modifyReturns(fee);
          fakeErc20Provider.modifyReturns(nb.balance);
          const canAffordFee = await service.canAffordSendTx('testAddress2', amount, USDT);
          expect(canAffordFee).toBe(nb.canAffordFees && nnb.canAffordAmount);
        });
      });
    });

    it('should return false when estimateFee throws an error on canAffordFee', async () => {
      fakeTokenSend.rejectPromises();
      const canAffordFee = await service.canAffordSendTx('testAddress2', amount, USDT);
      expect(canAffordFee).toBeFalse();
    });
  })

  describe('when user sends native token', () => {
    const fee = '0.00008';
    const amount = '0.003';
    it('should return false if user is trying to send more amount + fee than balance in wallet', async () => {
      fakeTokenSend.modifyReturns(fee);
      fakeErc20Provider.modifyReturns('0.00000001');
      const canAffordFee = await service.canAffordSendTx('testAddress2', amount, ETH);
      expect(canAffordFee).toBeFalse();
    });

    it('should return true if user is trying to send exactly amount + fee than balance in wallet', async () => {
      fakeTokenSend.modifyReturns(fee);
      fakeErc20Provider.modifyReturns('0.00308');
      const canAffordFee = await service.canAffordSendTx('testAddress2', amount, ETH);
      expect(canAffordFee).toBeTrue();
    });

    it('should return true if user is trying to send less amount + fee than balance in wallet', async () => {
      fakeTokenSend.modifyReturns(fee);
      fakeErc20Provider.modifyReturns('0.1');
      const canAffordFee = await service.canAffordSendTx('testAddress2', amount, ETH);
      expect(canAffordFee).toBeTrue();
    });
    
    it('should return false if user is trying to send with balance zero in wallet', async () => {
      fakeTokenSend.modifyReturns(fee);
      fakeErc20Provider.modifyReturns('0');
      const canAffordFee = await service.canAffordSendTx('testAddress2', amount, ETH);
      expect(canAffordFee).toBeFalse();
    });

    it('should return false if user can afford amount to send but not amount + fee', async () => {
      fakeTokenSend.modifyReturns(fee);
      fakeErc20Provider.modifyReturns('0.0030001');
      const canAffordFee = await service.canAffordSendTx('testAddress2', amount, ETH);
      expect(canAffordFee).toBeFalse();
    });

    it('should return false if user can afford fee to send but not amount + fee', async () => {
      fakeTokenSend.modifyReturns(fee);
      fakeErc20Provider.modifyReturns('0.00009');
      const canAffordFee = await service.canAffordSendTx('testAddress2', amount, ETH);
      expect(canAffordFee).toBeFalse();
    });

    it('should return false if wallet balance is equal to the amount to send', async () => {
      fakeTokenSend.modifyReturns(fee);
      fakeErc20Provider.modifyReturns(amount);
      const canAffordFee = await service.canAffordSendTx('testAddress2', amount, ETH);
      expect(canAffordFee).toBeFalse();
    });
    
    it('should return false if wallet balance is equal to the fee to send', async () => {
      fakeTokenSend.modifyReturns(fee);
      fakeErc20Provider.modifyReturns(fee);
      const canAffordFee = await service.canAffordSendTx('testAddress2', amount, ETH);
      expect(canAffordFee).toBeFalse();
    });
  });
});
