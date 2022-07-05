import { Injectable } from "@angular/core";
import { Dex } from "../../dex";
import { OneInchTokens } from "../one-inch-tokens";


@Injectable({ providedIn: 'root' })
export class OneInchTokensFactory {

  create(dex: Dex): OneInchTokens {
    return new OneInchTokens(dex);
  }
}
