import { BigNumber, Signer } from 'ethers';
import { DefaultERC20Provider } from 'src/app/modules/defi-investments/shared-defi-investments/models/erc20-provider/erc20-provider.model';
import { NativeToken } from './native-token.model';
import { Provider } from '@ethersproject/abstract-provider';


describe('NativeToken', () => {
  let token: NativeToken;
  let signerSpy: jasmine.SpyObj<Signer>;
  let erc20ProviderSpy: jasmine.SpyObj<DefaultERC20Provider>;
  let providerSpy: jasmine.SpyObj<Provider>;

  beforeEach(() => {
    signerSpy = jasmine.createSpyObj('Signer', {
      connect: undefined,
      estimateGas: Promise.resolve(BigNumber.from(10)),
      sendTransaction: Promise.resolve({}),
      getGasPrice: Promise.resolve(BigNumber.from(1)),
    });
    signerSpy.connect.and.returnValue(signerSpy);

    providerSpy = jasmine.createSpyObj(
      'Provider',
      { getGasPrice: Promise.resolve(BigNumber.from('10')) },
      {
        _isProvider: true,
      }
    );
    erc20ProviderSpy = jasmine.createSpyObj('ERC20Provider', {
      value: providerSpy,
    });
    token = new NativeToken(erc20ProviderSpy, signerSpy);
  });

  it('should create', () => {
    expect(token).toBeTruthy();
  });

  it('should call sendTransaction on transfer', async () => {
    await token.transfer('test', BigNumber.from(2), { gasPrice: '100000000' });
    expect(signerSpy.sendTransaction).toHaveBeenCalledOnceWith({
      to: 'test',
      value: BigNumber.from(2),
      gasPrice: '100000000',
    });
  });

  it('should call estimateGas on transferFee', async () => {
    await token.transferFee('test', BigNumber.from(2));
    expect(signerSpy.estimateGas).toHaveBeenCalledOnceWith({ to: 'test', value: BigNumber.from(2) });
  });

  it('should create with void signer', () => {
    expect(NativeToken.create(erc20ProviderSpy)).toBeTruthy();
  });
});
