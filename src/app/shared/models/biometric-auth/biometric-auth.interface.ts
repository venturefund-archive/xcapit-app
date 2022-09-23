import { Subscribable } from '../simple-subject/simple-subject';

export interface BiometricAuth {
  available: () => Promise<boolean>;

  enabled: () => Promise<boolean>;

  on: () => Promise<void>;

  off: () => Promise<void>;

  verified: () => Promise<boolean>;

  onNeedPass: () => Subscribable;
}
