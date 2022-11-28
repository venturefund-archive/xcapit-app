import { rawSAMOData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-tokens-data';
import { SolanaToken } from 'src/app/modules/swaps/shared-swaps/models/token/solana/solana-token';
import { SolanaNoNativeSend } from './solana-no-native-send';


fdescribe('SolanaNoNativeSend', () => {
  let noNativeSend: SolanaNoNativeSend;
  const amount = '2';
  const numberWeiAmount = 2000000000;
  const token = new SolanaToken(rawSAMOData);
  const testToAddress = 'HVGoaJgWW9TEu19avGRPjc2KvmReUYwxXib7NmwQqm4F';

  beforeEach(() => {
    noNativeSend = new SolanaNoNativeSend(amount, token, testToAddress);
  });

  it('new', () => {
    expect(noNativeSend).toBeTruthy();
  });

  it('weiAmount', () => {
    expect(noNativeSend.weiAmount().value().toNumber()).toEqual(numberWeiAmount);
  });

  it('token', () => {
    expect(noNativeSend.token()).toEqual(token);
  });

  it('to address', () => {
    expect(noNativeSend.toAddress()).toEqual(testToAddress);
  });
});
