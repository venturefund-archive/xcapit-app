import { TestBed } from '@angular/core/testing';
import { WalletTransactionsService } from './wallet-transactions.service';
import { WalletEncryptionService } from '../wallet-encryption/wallet-encryption.service';
import { Coin } from '../../interfaces/coin.interface';
import { Storage } from '@ionic/storage-angular';
import { StorageService } from '../storage-wallets/storage-wallets.service';
import { of } from 'rxjs';
import { CustomHttpService } from 'src/app/shared/services/custom-http/custom-http.service';
import { FakeConnectedWallet } from '../../../../../../testing/fakes/wallet.fake.spec';
import { FakeTokenSend } from 'src/testing/fakes/token-send.fake.spec';
import { ApiWalletService } from '../api-wallet/api-wallet.service';
import linkAbi from '../../constants/assets-abi-prod/link-abi-prod.json';
import { Erc20ProviderInjectable } from 'src/app/modules/defi-investments/shared-defi-investments/models/erc20-provider/injectable/erc20-provider.injectable';
import { ERC20ContractInjectable } from 'src/app/modules/defi-investments/shared-defi-investments/models/erc20-contract/injectable/erc20-contract.injectable';
import { FakeProvider } from 'src/app/shared/models/provider/fake-provider.spec';
import { FakeContract } from 'src/app/modules/defi-investments/shared-defi-investments/models/fake-contract/fake-contract.model';
import { BigNumber } from 'ethers';
import { FakeERC20Provider } from 'src/app/modules/defi-investments/shared-defi-investments/models/erc20-provider/fake/fake-erc20-provider';
import { ERC20TokenInjectable } from 'src/app/modules/defi-investments/shared-defi-investments/models/erc20-token/injectable/erc20-token.injectable';
import { FakeERC20Token } from 'src/app/modules/defi-investments/shared-defi-investments/models/erc20-token/fake/fake-erc20-token';
import { NativeGasOfFactory } from 'src/app/shared/models/native-gas-of/factory/native-gas-of.factory';
import { GasFeeOfFactory } from 'src/app/shared/models/gas-fee-of/factory/gas-fee-of.factory';
import { NativeGasOf } from '../../../../../shared/models/native-gas-of/native-gas-of';
import { GasFeeOf } from 'src/app/shared/models/gas-fee-of/gas-fee-of.model';
import { BlockchainsFactory } from 'src/app/modules/swaps/shared-swaps/models/blockchains/factory/blockchains.factory';
import { GasStationOfFactory } from 'src/app/modules/swaps/shared-swaps/models/gas-station-of/factory/gas-station-of.factory';
import { AmountOf } from 'src/app/modules/wallets/shared-wallets/models/blockchain-tx/amount-of/amount-of';
import { DefaultToken } from 'src/app/modules/swaps/shared-swaps/models/token/token';
import { rawMATICData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-tokens-data';
import { DefaultBlockchains } from 'src/app/modules/swaps/shared-swaps/models/blockchains/default/default-blockchains';
import { BlockchainRepo } from 'src/app/modules/swaps/shared-swaps/models/blockchain-repo/blockchain-repo';
import { rawBlockchainsData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-blockchains-data';
import { PasswordErrorMsgs } from 'src/app/modules/swaps/shared-swaps/models/password/password-error-msgs';

const ETH: Coin = {
  id: 1,
  name: 'ETH - Ethereum',
  logoRoute: 'assets/img/coins/ETH.svg',
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

describe('WalletTransactionsService', () => {
  let service: WalletTransactionsService;
  let storageServiceMock: any;
  let storageSpy: any;
  let customHttpServiceSpy;
  let walletEncryptionServiceSpy: any;
  let connectedWalletSpy;
  let fakeConnectedWallet: FakeConnectedWallet;
  let fakeTokenSend: typeof FakeTokenSend;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>;
  let erc20ProviderInjectableSpy: jasmine.SpyObj<Erc20ProviderInjectable>;
  let erc20ContractInjectableSpy: jasmine.SpyObj<ERC20ContractInjectable>;
  let erc20TokenInjectableSpy: jasmine.SpyObj<ERC20TokenInjectable>;
  let gasFeeOfSpy: jasmine.SpyObj<GasFeeOf>;
  let gasFeeOfFactorySpy: jasmine.SpyObj<GasFeeOfFactory>;
  let nativeGasOfFactorySpy: jasmine.SpyObj<NativeGasOfFactory>;
  let nativeGasOfSpy: jasmine.SpyObj<NativeGasOf>;
  let modifyGetBalanceReturn: (balance: string) => void;
  let blockchainsFactorySpy: jasmine.SpyObj<BlockchainsFactory>;
  let gasStationOfFactorySpy: jasmine.SpyObj<GasStationOfFactory>;

  beforeEach(() => {
    modifyGetBalanceReturn = (balance: string): void => {
      erc20ProviderInjectableSpy.create.and.returnValue(new FakeERC20Provider(null, new FakeProvider(null, balance)));
    };

    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', {
      getNativeTokenFromNetwork: ETH,
    });
    fakeTokenSend = FakeTokenSend;

    fakeConnectedWallet = new FakeConnectedWallet();
    connectedWalletSpy = fakeConnectedWallet.createSpy();

    walletEncryptionServiceSpy = jasmine.createSpyObj('WalletEncryptionService', {
      getDecryptedWalletForCurrency: Promise.resolve({ connect: () => connectedWalletSpy }),
    });

    storageSpy = jasmine.createSpyObj('Storage', ['get', 'set']);

    storageServiceMock = {
      getWalletsAddresses: (network) =>
        network ? Promise.resolve(testAddresses.ETH_TEST) : Promise.resolve(testAddresses),
    };

    customHttpServiceSpy = jasmine.createSpyObj('CustomHttpService', {
      post: of(),
    });

    erc20ProviderInjectableSpy = jasmine.createSpyObj('ERC20ProviderInjectable', {
      create: new FakeERC20Provider(null, new FakeProvider('100000000')),
    });

    erc20ContractInjectableSpy = jasmine.createSpyObj('ERC20ContractInjectable', {
      create: jasmine.createSpyObj('ERC20Contract', {
        value: new FakeContract({ transfer: () => Promise.resolve(BigNumber.from('10')) }),
      }),
    });

    erc20TokenInjectableSpy = jasmine.createSpyObj('ERC20TokenInjectable', {
      create: new FakeERC20Token(Promise.resolve(BigNumber.from('1'))),
    });

    nativeGasOfSpy = jasmine.createSpyObj('NativeGasOf', {
      value: Promise.resolve(BigNumber.from('1000')),
    });

    nativeGasOfFactorySpy = jasmine.createSpyObj('NativeGasOfFactory', {
      create: nativeGasOfSpy,
    });

    gasFeeOfSpy = jasmine.createSpyObj('GasFeeOf', {
      value: Promise.resolve(BigNumber.from('1000')),
    });

    gasFeeOfFactorySpy = jasmine.createSpyObj('GasFeeOfFactory', {
      new: gasFeeOfSpy,
    });

    gasStationOfFactorySpy = jasmine.createSpyObj('GasStationOfFactory', {
      create: {
        price: () => ({
          standard: () => Promise.resolve(new AmountOf('100000000000', new DefaultToken(rawMATICData))),
        }),
      },
    });

    blockchainsFactorySpy = jasmine.createSpyObj('BlockchainsFactory', {
      create: new DefaultBlockchains(new BlockchainRepo(rawBlockchainsData)),
    });

    TestBed.configureTestingModule({
      providers: [
        { provide: WalletEncryptionService, useValue: walletEncryptionServiceSpy },
        { provide: Storage, useValue: storageSpy },
        { provide: StorageService, useValue: storageServiceMock },
        { provide: CustomHttpService, useValue: customHttpServiceSpy },
        { provide: ApiWalletService, useValue: apiWalletServiceSpy },
        { provide: Erc20ProviderInjectable, useValue: erc20ProviderInjectableSpy },
        { provide: ERC20ContractInjectable, useValue: erc20ContractInjectableSpy },
        { provide: ERC20TokenInjectable, useValue: erc20TokenInjectableSpy },
        { provide: GasFeeOfFactory, useValue: gasFeeOfFactorySpy },
        { provide: NativeGasOfFactory, useValue: nativeGasOfFactorySpy },
        { provide: BlockchainsFactory, useValue: blockchainsFactorySpy },
        { provide: GasStationOfFactory, useValue: gasStationOfFactorySpy },
      ],
    });
    service = TestBed.inject(WalletTransactionsService);
    service.tokenSendClass = fakeTokenSend;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send native token transaction', async () => {
    await service.send('testPassword', 20, 'testAddress', ETH);
    expect(walletEncryptionServiceSpy.getDecryptedWalletForCurrency).toHaveBeenCalledOnceWith('testPassword', ETH);
  });

  it('should call send with no native token transaction', async () => {
    await service.send('testPassword', 20, 'testAddress', LINK);
    expect(walletEncryptionServiceSpy.getDecryptedWalletForCurrency).toHaveBeenCalledTimes(1);
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
    walletEncryptionServiceSpy.getDecryptedWalletForCurrency.and.throwError(new PasswordErrorMsgs().invalid());
    await expectAsync(service.send('wrongPassword', 20, 'testAddress', ETH)).toBeRejected();
    expect(connectedWalletSpy.sendTransaction).not.toHaveBeenCalled();
  });

  it('should return false when balance is not enough to afford fee', async () => {
    expect(await service.canAffordSendFee('testAddress', 1, ETH)).toBeFalse();
  });

  it('should return true when balance is enough to afford fee', async () => {
    erc20ProviderInjectableSpy.create.and.returnValue(
      new FakeERC20Provider(null, new FakeProvider('100000000', '100000000000'))
    );
    expect(await service.canAffordSendFee('testAddress', 1, ETH)).toBeTrue();
  });

  it('should return false when estimateFee throws an error on canAffordFee', async () => {
    service.tokenSendClass = {
      create: () => ({
        value: () => ({
          sendEstimateFee: () => Promise.reject(),
        }),
      }),
    };
    const canAffordFee = await service.canAffordSendTx('testAddress2', 1, USDT);
    expect(canAffordFee).toBeFalse();
  });

  it('should return false if balance is not enough to afford transaction with native token', async () => {
    expect(await service.canAffordSendTx('testAddress', 1, ETH)).toBeFalse();
  });

  it('should return true if balance is enough to afford transaction with non-native-token', async () => {
    erc20ProviderInjectableSpy.create.and.returnValue(new FakeERC20Provider(null, new FakeProvider('1000', '1000')));

    expect(await service.canAffordSendTx('testAddress', 0.000001, USDT)).toBeTrue();
  });

  it('should return false if canAffordSendTx fails', async () => {
    spyOn(service, 'sendEstimatedFee').and.rejectWith();

    expect(await service.canAffordSendTx('testAddress', 1, ETH)).toBeFalse();
  });
});
