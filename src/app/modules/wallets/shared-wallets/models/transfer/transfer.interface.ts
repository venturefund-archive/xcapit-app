
import { RawToken } from "src/app/modules/swaps/shared-swaps/models/token-repo/token-repo";

export interface Transfer{
  fee: () => number;
  token: () => RawToken
}