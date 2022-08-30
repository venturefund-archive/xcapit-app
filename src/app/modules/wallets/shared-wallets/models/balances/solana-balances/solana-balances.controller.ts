import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Coin } from "../../../interfaces/coin.interface";
import { SolanaBalances } from "./solana-balances";

@Injectable({ providedIn: 'root' })
export class SolanaBalancesController {
  public new(
    _address: string,
    _coins: Coin[],
    _baseUrl = environment.solanaApiUrl
  ): SolanaBalances {
    return new SolanaBalances(_address, _coins, _baseUrl);
  }
}