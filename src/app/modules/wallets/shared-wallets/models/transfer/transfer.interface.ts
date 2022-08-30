import { RawToken } from 'src/app/modules/swaps/shared-swaps/models/token-repo/token-repo';
import { RawTransfer } from '../../types/raw-transfer.type';

export interface Transfer {
  fee: () => number;
  type: () => 'IN' | 'OUT';
  token: () => RawToken;
  raw: () => RawTransfer;
}
