import { BigNumber, constants } from 'ethers';
import { ERC20Token } from 'src/app/modules/defi-investments/shared-defi-investments/models/erc20-token/erc20-token.model';
import { ERC20TokenTransfer } from './erc20-token-transfer.model';

fdescribe('ERC20TokenTransfer', () => {
  let transfer: ERC20TokenTransfer;
  let erc20TokenSpy: jasmine.SpyObj<ERC20Token>;
  let zeroAddress: string;

  beforeEach(() => {
    zeroAddress = constants.AddressZero;

    erc20TokenSpy = jasmine.createSpyObj('ERC20Token', {
      transfer: Promise.resolve({}),
      transferFee: Promise.resolve(BigNumber.from(1)),
    });

    transfer = new ERC20TokenTransfer(zeroAddress, zeroAddress, { value: 1, token: 'USDT' }, erc20TokenSpy);
  });

  it('should create', () => {
    expect(transfer).toBeTruthy();
  });

  it('should call token transfer', async () => {
    await transfer.transfer();
    expect(erc20TokenSpy.transfer).toHaveBeenCalledOnceWith(zeroAddress, BigNumber.from(1));
  });

  it('should call token transferFee', async () => {
    await transfer.estimateFee();
    expect(erc20TokenSpy.transferFee).toHaveBeenCalledOnceWith(zeroAddress, BigNumber.from(1));
  });
});
