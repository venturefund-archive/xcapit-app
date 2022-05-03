import { BigNumber, constants, VoidSigner, Wallet } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { DefaultERC20Token } from 'src/app/modules/defi-investments/shared-defi-investments/models/erc20-token/default-erc20-token.model';
import { TEST_ERC20_COINS } from '../../constants/coins.test';
import { Coin } from '../../interfaces/coin.interface';
import { ERC20TokenSend } from './erc20-token-send.model';
import { NetworkConfig } from '../network-config/network-config';

describe('ERC20TokenSend', () => {
  let transfer: ERC20TokenSend;
  let erc20TokenSpy: jasmine.SpyObj<DefaultERC20Token>;
  let zeroAddress: string;
  let usdtCoin: Coin;
  let networkConfigSpy: jasmine.SpyObj<NetworkConfig>;

  beforeEach(() => {
    usdtCoin = JSON.parse(JSON.stringify(TEST_ERC20_COINS[2]));
    zeroAddress = constants.AddressZero;

    erc20TokenSpy = jasmine.createSpyObj('ERC20Token', {
      transfer: Promise.resolve({}),
      transferFee: Promise.resolve(BigNumber.from(3)),
      getGasPrice: Promise.resolve(BigNumber.from(2)),
      balanceOf: Promise.resolve(BigNumber.from('500000')),
    });

    networkConfigSpy = jasmine.createSpyObj('NetworkConfig', {
      value: Promise.resolve({ gasPrice: '100000000' }),
    });
    transfer = new ERC20TokenSend(
      zeroAddress,
      '1.0',
      erc20TokenSpy,
      usdtCoin,
      false,
      networkConfigSpy
    );
  });

  it('should create', () => {
    expect(transfer).toBeTruthy();
  });

  it('should call token transfer on send', async () => {
    await transfer.send();
    expect(erc20TokenSpy.transfer).toHaveBeenCalledOnceWith(zeroAddress, parseUnits('1', usdtCoin.decimals), {
      gasPrice: '100000000',
    });
  });

  it('should create an instance of ERC20TokenSend with no wallet on create', () => {
    const send = ERC20TokenSend.create(
      zeroAddress,
      '1.0',
      usdtCoin,
      new VoidSigner(zeroAddress),
      networkConfigSpy
    );
    expect(send).toBeInstanceOf(ERC20TokenSend);
    expect(send.canSignTx).toBeFalse();
  });

  it('should create an instance of ERC20TokenSend with wallet on create', () => {
    const wallet = Wallet.createRandom();
    const send = ERC20TokenSend.create(zeroAddress, '1.0', usdtCoin, wallet, networkConfigSpy);
    expect(send).toBeInstanceOf(ERC20TokenSend);
    expect(send.canSignTx).toBeTrue();
  });

});
