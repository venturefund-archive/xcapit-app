import { Provider } from '@ethersproject/abstract-provider';
import { BigNumber, Contract, Signer, VoidSigner, Wallet } from 'ethers';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { ERC20Contract } from '../erc20-contract/erc20-contract.model';
import { ERC20Provider } from '../erc20-provider/erc20-provider.interface';

const abi = JSON.stringify([
  {
    inputs: [
      {
        internalType: 'string',
        name: 'name_',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'symbol_',
        type: 'string',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
]);

const coin = {
  id: 5,
  name: 'UNI - Uniswap',
  logoRoute: 'assets/img/coins/UNI.svg',
  last: true,
  value: 'UNI',
  network: 'ERC20',
  chainId: 42,
  rpc: 'http://testrpc.text/ ',
  moonpayCode: 'uni',
  contract: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
  abi: abi,
  decimals: 18,
} as Coin;

describe('ERC20Contract', () => {
  let erc20Contract: ERC20Contract;
  let erc20ProviderSpy: jasmine.SpyObj<ERC20Provider>;
  let providerSpy: jasmine.SpyObj<Provider>;
  beforeEach(() => {
    providerSpy = jasmine.createSpyObj(
      'Provider',
      {},
      {
        _isProvider: true,
      }
    );
    erc20ProviderSpy = jasmine.createSpyObj('ERC20Provider', {
      value: providerSpy,
      coin: coin,
    });
    erc20Contract = ERC20Contract.create(erc20ProviderSpy);
  });

  it('should create', () => {
    expect(erc20Contract).toBeTruthy();
  });

  it('should create a contract without signer', () => {
    const contract = erc20Contract.value();
    expect(contract.signer).toBeInstanceOf(VoidSigner);
    expect(contract.address).toEqual(coin.contract);
    expect(contract).toBeInstanceOf(Contract);
  });

  it('should create a contract with signer', () => {
    const wallet = Wallet.fromMnemonic(
      'clever brain critic belt soldier daring own luxury begin plate orange banana',
      "m/44'/80001'/0'/0/0"
    );
    const contract = new ERC20Contract(erc20ProviderSpy, wallet).value();
    expect(contract.signer).toBeInstanceOf(Signer);
    expect(contract.address).toEqual(coin.contract);
    expect(contract).toBeInstanceOf(Contract);
  });

  it('should call getGasPrice on getGasPrice',  async () => {
    const provider = jasmine.createSpyObj('Provider', { value: {} });
    const connectedSignerSpy = jasmine.createSpyObj('Signer', { getGasPrice: Promise.resolve(BigNumber.from(1)), connect: {} });
    const signerSpy = jasmine.createSpyObj('Signer', { getGasPrice: Promise.resolve(BigNumber.from(1)), connect: connectedSignerSpy });
    const erc20Contract = new ERC20Contract(provider, signerSpy);
    await erc20Contract.getGasPrice();
    expect(connectedSignerSpy.getGasPrice).toHaveBeenCalledTimes(1);
  });
});
