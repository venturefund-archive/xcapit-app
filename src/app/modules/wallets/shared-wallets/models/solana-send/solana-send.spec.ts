import { rawSAMOData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-tokens-data';
import { SolanaToken } from 'src/app/modules/swaps/shared-swaps/models/token/solana/solana-token';
import { solanaAddresses } from '../../fixtures/raw-address-data';
import { SolanaSend } from './solana-send';


describe('SolanaSend', () => {
  let aSolanaSend: SolanaSend;
  const amount = '2';
  const numberWeiAmount = 2000000000;
  const token = new SolanaToken(rawSAMOData);
  const testToAddress = solanaAddresses[0];

  beforeEach(() => {
    aSolanaSend = new SolanaSend(amount, token, testToAddress);
  });

  it('new', () => {
    expect(aSolanaSend).toBeTruthy();
  });

  it('weiAmount', () => {
    expect(aSolanaSend.weiAmount().value().toNumber()).toEqual(numberWeiAmount);
  });

  it('token', () => {
    expect(aSolanaSend.token()).toEqual(token);
  });

  it('to address', () => {
    expect(aSolanaSend.toAddress()).toEqual(testToAddress);
  });
});
