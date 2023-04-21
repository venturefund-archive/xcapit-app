import { Blockchain } from 'src/app/modules/swaps/shared-swaps/models/blockchain/blockchain';
import { FakeConnection } from 'src/app/modules/swaps/shared-swaps/models/fakes/fake-connection';
import { rawSolanaData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-blockchains-data';
import { rawSAMOData, rawSOLData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-tokens-data';
import { SolanaToken } from 'src/app/modules/swaps/shared-swaps/models/token/solana/solana-token';
import { Token } from 'src/app/modules/swaps/shared-swaps/models/token/token';
import { solanaAddresses } from '../../fixtures/raw-address-data';
import { SolanaSend } from '../solana-send/solana-send';
import { SolanaSendTxsOf } from './solana-send-txs-of';
import { FakeWallet } from '../../../../swaps/shared-swaps/models/wallet/fake/fake-wallet';


describe('SolanaSendTxsOf', () => {
  const amount = '2';
  const aToken = new SolanaToken(rawSAMOData);
  const aNativeToken = new SolanaToken(rawSOLData);
  const aBlockchain = new Blockchain(rawSolanaData);
  const testToAddress = solanaAddresses[0];
  const testWalletAddress = solanaAddresses[1];
  const _solanaSendTxs = (_aToken: Token = aToken, _connection = new FakeConnection()): SolanaSendTxsOf => {
    return new SolanaSendTxsOf(
      new SolanaSend(amount, _aToken, testToAddress),
      new FakeWallet(Promise.resolve(false), null, testWalletAddress),
      aBlockchain,
      _connection
    );
  };

  it('new', () => {
    expect(_solanaSendTxs()).toBeTruthy();
  });

  it('blockchain transaction for native send', async () => {
    const solanaSendTxs = _solanaSendTxs(aNativeToken);

    expect((await solanaSendTxs.blockchainTxs()).length).toEqual(1);
  });

  it('single blockchain transaction for no native send', async () => {
    const solanaSendTxs = _solanaSendTxs(aToken, new FakeConnection());

    expect((await solanaSendTxs.blockchainTxs()).length).toEqual(1);
  });

  it('multiple blockchain transactions for no native send', async () => {
    const solanaSendTxs = _solanaSendTxs(aToken, new FakeConnection([]));

    expect((await solanaSendTxs.blockchainTxs()).length).toEqual(2);
  });
});
