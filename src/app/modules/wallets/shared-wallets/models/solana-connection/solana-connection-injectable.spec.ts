import { Blockchain } from 'src/app/modules/swaps/shared-swaps/models/blockchain/blockchain';
import { rawPolygonData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-blockchains-data';
import { SolanaConnectionInjectable } from './solana-connection-injectable';


describe('SolanaConnectionInjectable', () => {
  let connection: SolanaConnectionInjectable;
  const aBlockchain = new Blockchain(rawPolygonData);

  beforeEach(() => {
    connection = new SolanaConnectionInjectable();
  });

  it('new', () => {
    expect(connection).toBeTruthy();
  });

  it('create', () => {
    expect(connection.create(aBlockchain)).toBeTruthy();
  });
});
