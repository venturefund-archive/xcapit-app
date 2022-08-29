import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Blockchains } from "../../blockchains/blockchains";
import { OneInchBlockchainsOf } from "../one-inch-blockchains-of";


@Injectable({ providedIn: 'root' })
export class OneInchBlockchainsOfFactory {

  create(blockchains: Blockchains, oneInchBlockchainsId: string[] = environment.ONE_INCH_DEFAULTS.blockchainsId) {
    return new OneInchBlockchainsOf(blockchains, oneInchBlockchainsId);
  }
}
