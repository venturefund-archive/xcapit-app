import { SimpleSubject, Subscribable } from '../../simple-subject/simple-subject';
import { IonicStorageService } from '../../../services/ionic-storage/ionic-storage.service';
import { NativeBiometric, NativeBiometricPlugin } from 'capacitor-native-biometric';
import { FakeNativeBiometricPlugin } from '../../native-biometric-plugin/fake-native-biometric-plugin';
import { BiometricAuth } from '../biometric-auth.interface';
import { LoginToken } from '../../../../modules/users/shared-users/models/login-token/login-token';
import { Password } from 'src/app/modules/swaps/shared-swaps/models/password/password';
import { throwError } from 'rxjs';

export class DefaultBiometricAuth implements BiometricAuth {
  private readonly _onNeedPass: SimpleSubject = new SimpleSubject();
  private readonly _aKey: string = 'biometricAuth';

  constructor(
    private readonly _aStorage: IonicStorageService,
    private readonly _verifyOptions = {},
    private readonly _aPlugin: NativeBiometricPlugin | FakeNativeBiometricPlugin = NativeBiometric
  ) {}

  public available(): Promise<boolean> {
    return this._aPlugin.isAvailable().then((res) => res.isAvailable);
  }

  public enabled(): Promise<boolean> {
    return this._aStorage.get(this._aKey).then((res) => !!res);
  }

  public async on(): Promise<void> {
    const password: Password = await this._onNeedPass.notify();
    if (await new LoginToken(password, this._aStorage).valid()) {
      return Promise.all([this._savePassword(password.value()), this._saveStorage()]).then(() => undefined);
    } else {
      throw Error('invalid');
    }
  }

  public off(): Promise<void> {
    return Promise.all([this._removePassword(), this._removeStorage()]).then(() => undefined);
  }

  public verified(): Promise<boolean> {
    return this._aPlugin.verifyIdentity(this._verifyOptions);
  }

  public onNeedPass(): Subscribable {
    return this._onNeedPass;
  }

  private _saveStorage() {
    return this._aStorage.set(this._aKey, true);
  }

  private _savePassword(password: string): Promise<void> {
    return this._aPlugin.setCredentials({
      username: 'xcapit',
      password: password,
      server: this._aKey,
    });
  }

  private _removeStorage() {
    return this._aStorage.remove(this._aKey);
  }

  private _removePassword() {
    return this._aPlugin.deleteCredentials({
      server: this._aKey,
    });
  }
}
