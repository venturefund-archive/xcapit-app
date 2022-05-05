import { TwoPiContract } from './two-pi-contract.model';
import { Contract, Signer, VoidSigner, Wallet } from 'ethers';
import { Provider } from '@ethersproject/abstract-provider';
import { DefaultERC20Provider } from '../erc20-provider/erc20-provider.model';
import { Coin } from '../../../../wallets/shared-wallets/interfaces/coin.interface';

const contractAddress = '0xCB50fF1863cBBAd718d3A1eEEf403a95C58d3B16';

describe('TwoPiContract', () => {
  let wallet: Wallet;
  let providerSpy: jasmine.SpyObj<Provider>;
  let erc20ProviderSpy: jasmine.SpyObj<DefaultERC20Provider>;
  let coinSpy: jasmine.SpyObj<Coin>;

  beforeEach(() => {
    coinSpy = jasmine.createSpyObj('Coin', {}, { rpc: 'rpc.test.com' });
    wallet = Wallet.fromMnemonic(
      'clever brain critic belt soldier daring own luxury begin plate orange banana',
      "m/44'/80001'/0'/0/0"
    );
    providerSpy = jasmine.createSpyObj(
      'Provider',
      {},
      {
        _isProvider: true,
      }
    );
    erc20ProviderSpy = jasmine.createSpyObj('ERC20Provider', {
      value: providerSpy,
      coin: coinSpy,
    });
  });

  it('should create without wallet', () => {
    const twoPiContract = TwoPiContract.create(contractAddress, erc20ProviderSpy);
    expect(twoPiContract).toBeTruthy();
  });

  it('should create with wallet', () => {
    const twoPiContract = new TwoPiContract(contractAddress, erc20ProviderSpy, wallet, 'PREPROD');
    expect(twoPiContract).toBeTruthy();
  });

  it('should create a contract without signer', () => {
    const contract = TwoPiContract.create(contractAddress, erc20ProviderSpy).value();
    expect(contract.signer).toBeInstanceOf(VoidSigner);
    expect(contract.address).toEqual(contractAddress);
    expect(contract).toBeInstanceOf(Contract);
  });

  it('should create a contract with signer', () => {
    const contract = new TwoPiContract(contractAddress, erc20ProviderSpy, wallet, 'PRODUCCION').value();
    expect(contract.signer).toBeInstanceOf(Signer);
    expect(contract.address).toEqual(contractAddress);
    expect(contract).toBeInstanceOf(Contract);
  });
});
