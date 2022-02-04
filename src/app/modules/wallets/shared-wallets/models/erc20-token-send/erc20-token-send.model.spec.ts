import { BigNumber, constants, Wallet } from 'ethers';
import { ERC20Token } from 'src/app/modules/defi-investments/shared-defi-investments/models/erc20-token/erc20-token.model';
import { TEST_ERC20_COINS } from '../../constants/coins.test';
import { Coin } from '../../interfaces/coin.interface';
import { ERC20TokenSend } from './erc20-token-send.model';

describe('ERC20TokenSend', () => {
  let transfer: ERC20TokenSend;
  let erc20TokenSpy: jasmine.SpyObj<ERC20Token>;
  let zeroAddress: string;
  let usdtCoin: Coin;

  beforeEach(() => {
    usdtCoin = JSON.parse(JSON.stringify(TEST_ERC20_COINS[2]));
    zeroAddress = constants.AddressZero;

    erc20TokenSpy = jasmine.createSpyObj('ERC20Token', {
      transfer: Promise.resolve({}),
      transferFee: Promise.resolve(BigNumber.from(1)),
    });

    transfer = new ERC20TokenSend(zeroAddress, zeroAddress, { value: 1, token: 'USDT' }, erc20TokenSpy, false);
  });

  it('should create', () => {
    expect(transfer).toBeTruthy();
  });

  it('should call token transfer on send', async () => {
    await transfer.send();
    expect(erc20TokenSpy.transfer).toHaveBeenCalledOnceWith(zeroAddress, BigNumber.from(1));
  });

  it('should call token transferFee on sendEstimateGas', async () => {
    await transfer.sendEstimateGas();
    expect(erc20TokenSpy.transferFee).toHaveBeenCalledOnceWith(zeroAddress, BigNumber.from(1));
  });

  it('should call token transferFee with amount zero on sendEstimateGasWithAmountZero', async () => {
    await transfer.sendEstimateGasWithAmountZero();
    expect(erc20TokenSpy.transferFee).toHaveBeenCalledOnceWith(zeroAddress, BigNumber.from(0));
  });

  it('should create an instance of ERC20TokenSend with no wallet on create', () => {
    const send =  ERC20TokenSend.create(zeroAddress, zeroAddress, 1, usdtCoin);
    expect(send).toBeInstanceOf(ERC20TokenSend);
    expect(send.canSignTx).toBeFalse();
  });

  it('should create an instance of ERC20TokenSend with wallet on create', () => {
    const wallet = Wallet.createRandom();
    const send =  ERC20TokenSend.create(zeroAddress, zeroAddress, 1, usdtCoin, wallet);
    expect(send).toBeInstanceOf(ERC20TokenSend);
    expect(send.canSignTx).toBeTrue();
  });
});
