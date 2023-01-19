import { CovalentBalances } from './covalent-balances';
import { FakeHttpClient } from '../../../../../../../testing/fakes/fake-http.spec';
import { polygonResponse, solanaResponse } from '../../../fixtures/covalent-balances.fixture';
import {
  rawETHData,
  rawMATICData,
  rawSAMOData,
  rawSOLData,
  rawTokensData,
  rawUSDCData,
} from '../../../../../swaps/shared-swaps/models/fixtures/raw-tokens-data';
import { DefaultBlockchain } from '../../../../../swaps/shared-swaps/models/blockchain/blockchain';
import { rawPolygonData, rawSolanaData } from '../../../../../swaps/shared-swaps/models/fixtures/raw-blockchains-data';
import { BlockchainTokens } from '../../../../../swaps/shared-swaps/models/blockchain-tokens/blockchain-tokens';
import { TokenRepo } from '../../../../../swaps/shared-swaps/models/token-repo/token-repo';
import { DefaultTokens, Tokens } from '../../../../../swaps/shared-swaps/models/tokens/tokens';

describe('CovalentBalances', () => {
  let covalentBalances: CovalentBalances;
  let tokens: Tokens;

  beforeEach(() => {
    tokens = new BlockchainTokens(new DefaultBlockchain(rawPolygonData), new DefaultTokens(new TokenRepo(rawTokensData)));
    covalentBalances = new CovalentBalances('0x0001', tokens, new FakeHttpClient(polygonResponse), 'https:/test/');
  });

  it('should create', () => {
    expect(covalentBalances).toBeTruthy();
  });

  it('should create with default url', () => {
    covalentBalances = new CovalentBalances('0x0001', tokens, new FakeHttpClient(polygonResponse));
    expect(covalentBalances).toBeTruthy();
  });

  it('should get value for polygon tokens', async () => {
    expect(await covalentBalances.value()).toEqual([
      { coin: rawMATICData, balance: 1.6756807965451055 },
      { coin: rawUSDCData, balance: 0.2 },
    ]);
  });

  it('should get value for solana tokens', async () => {
    tokens = new BlockchainTokens(new DefaultBlockchain(rawSolanaData), new DefaultTokens(new TokenRepo(rawTokensData)));

    covalentBalances = new CovalentBalances('0x0001', tokens, new FakeHttpClient(solanaResponse), 'https:/test/');
    expect(await covalentBalances.value()).toEqual([
      { coin: rawSOLData, balance: 1.944182 },
      { coin: rawSAMOData, balance: 92.07568407 },
    ]);
  });

  it('should get value of a coin', async () => {
    expect(await covalentBalances.valueOf(rawMATICData)).toEqual({ coin: rawMATICData, balance: 1.6756807965451055 });
  });

  it('should get 0 if not balance', async () => {
    expect(await covalentBalances.valueOf(rawETHData)).toEqual({ coin: rawETHData, balance: 0 });
  });
});
