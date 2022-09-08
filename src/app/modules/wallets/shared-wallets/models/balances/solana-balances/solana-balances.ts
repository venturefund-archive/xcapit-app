import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { environment } from 'src/environments/environment';
import { Coin } from '../../../interfaces/coin.interface';
import { Balances } from '../balances.interface';

export class SolanaBalances implements Balances {
  public readonly _connection: Connection;
  private readonly _publicKey: PublicKey;

  constructor(
    private readonly _address: string,
    private readonly _coins: Coin[],
    private readonly _baseUrl = environment.solanaApiUrl
  ) {
    this._connection = new Connection(this._baseUrl);
    this._publicKey = new PublicKey(this._address);
  }

  value(): Promise<any> {
    return Promise.all(this._coins.map((coin) => this.valueOf(coin)));
  }
  
  async valueOf(aCoin: Coin): Promise<any> {
    const balanceLamports = await this._connection.getBalance(this._publicKey);
    const balance = balanceLamports / LAMPORTS_PER_SOL;
    return Promise.resolve({
      balance,
      coin: aCoin,
    });
  }
}
