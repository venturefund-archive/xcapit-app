import { Subscribable } from '../simple-subject/simple-subject';
import { VerifyResult } from './verify-result.interface';

export interface BiometricAuth {
  password:() => Promise<string>;

  available: () => Promise<boolean>;

  enabled: () => Promise<boolean>;

  on: () => Promise<void>;

  off: () => Promise<void>;

  verified: () => Promise<VerifyResult>;

  onNeedPass: () => Subscribable;
}
