import { Transfers } from "../transfers";

@Injectable({ providedIn: 'root' })
export class TransfersFactory {
  public new(
  ): Transfers {
    return TwoPiInvestment.create(_anInvestmentProduct, _aSigner, _anApiWalletService);
  }
}
