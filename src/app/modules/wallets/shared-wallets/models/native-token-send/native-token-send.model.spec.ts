import { BigNumber, constants, VoidSigner, Wallet } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { TEST_ERC20_COINS } from '../../constants/coins.test';
import { Coin } from '../../interfaces/coin.interface';
import { NativeToken } from '../native-token/native-token.model';
import { NativeTokenSend } from './native-token-send.model';
import { NetworkConfig } from '../network-config/network-config';

describe('NativeTokenTransfer', () => {
  let transfer: NativeTokenSend;
  let nativeTokenSpy: jasmine.SpyObj<NativeToken>;
  let zeroAddress: string;
  let ethCoin: Coin;
  let networkConfigSpy: jasmine.SpyObj<NetworkConfig>;

  beforeEach(() => {
    ethCoin = JSON.parse(JSON.stringify(TEST_ERC20_COINS[0]));
    zeroAddress = constants.AddressZero;

    nativeTokenSpy = jasmine.createSpyObj('ERC20Token', {
      transfer: Promise.resolve({}),
      transferFee: Promise.resolve(BigNumber.from(2)),
      getGasPrice: Promise.resolve(BigNumber.from(3)),
    });
    networkConfigSpy = jasmine.createSpyObj('NetworkConfig', {
      value: Promise.resolve({ gasPrice: '100000000' }),
    });

    transfer = new NativeTokenSend(zeroAddress, '1.0', nativeTokenSpy, ethCoin, false, networkConfigSpy);
  });

  it('should create', () => {
    expect(transfer).toBeTruthy();
  });

  it('should call token transfer on send', async () => {
    await transfer.send();
    expect(nativeTokenSpy.transfer).toHaveBeenCalledOnceWith(zeroAddress, parseEther('1'), { gasPrice: '100000000' });
  });

  it('should create an instance of NativeTokenSend with no wallet on create', () => {
    const send = NativeTokenSend.create(
      zeroAddress,
      '1.0',
      ethCoin,
      new VoidSigner(zeroAddress),
      networkConfigSpy
    );
    expect(send).toBeInstanceOf(NativeTokenSend);
    expect(send.canSignTx).toBeFalse();
  });

  it('should create an instance of NativeTokenSend with wallet on create', () => {
    const wallet = Wallet.createRandom();
    const send = NativeTokenSend.create(zeroAddress, '1.0', ethCoin, wallet, networkConfigSpy);
    expect(send).toBeInstanceOf(NativeTokenSend);
    expect(send.canSignTx).toBeTrue();
  });
});
