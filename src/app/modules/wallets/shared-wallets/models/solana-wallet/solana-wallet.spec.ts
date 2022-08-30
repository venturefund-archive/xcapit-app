import { Keypair } from '@solana/web3.js';
import { SolanaWallet } from './solana-wallet';

const testSeed = Uint8Array.from([0, 50, 52, 103]);
const testWalletSolana: Keypair = { secretKey: 'testPrivate', publicKey: 'testPublic' } as unknown as Keypair;

describe('SolanaWallet', () => {
  let solanaWallet: SolanaWallet;
  let keypairSpy: jasmine.Spy;

  beforeEach(() => {
    keypairSpy = spyOn(Keypair, 'fromSeed').and.returnValue(testWalletSolana);
    solanaWallet = new SolanaWallet(testSeed);
  });

  it('new', () => {
    expect(solanaWallet).toBeTruthy();
    expect(solanaWallet.address).toBeDefined();
  });
  
  it('isSolana', ()=>{
    expect(solanaWallet.isSolana()).toBeTrue()
  })
});
