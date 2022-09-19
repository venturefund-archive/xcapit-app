import { BiometricAuth } from '../biometric-auth.interface';
import { SimpleSubject, Subscribable } from '../../simple-subject/simple-subject';
import { of } from 'rxjs';

export class FakeBiometricAuth implements BiometricAuth {
  private readonly _onNeedPass: SimpleSubject = new SimpleSubject();

  constructor(
    private readonly availableReturn: Promise<boolean> = Promise.resolve(true),
    private readonly enabledReturn: Promise<boolean> = Promise.resolve(true),
    private readonly verifiedReturn: Promise<boolean> = Promise.resolve(true),
    private readonly onReturn: Promise<void> = Promise.resolve(),
    private readonly passwordReturn: Promise<string> = Promise.resolve('fakePass')
  ) {}

  available(): Promise<boolean> {
    return this.availableReturn;
  }

  enabled(): Promise<boolean> {
    return this.enabledReturn;
  }

  off(): Promise<void> {
    return Promise.resolve();
  }

  async on(): Promise<void> {
    await this._onNeedPass.notify();
    return this.onReturn;
  }

  onNeedPass(): Subscribable {
    return this._onNeedPass;
  }

  verified(): Promise<boolean> {
    return this.verifiedReturn;
  }

  password(): Promise<string> {
    return this.passwordReturn;
  }
}
