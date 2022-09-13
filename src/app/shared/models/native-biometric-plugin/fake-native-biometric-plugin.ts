import {
  BiometricOptions,
  IsAvailableOptions,
  NativeBiometricPlugin,
} from 'capacitor-native-biometric/dist/esm/definitions';

export class FakeNativeBiometricPlugin implements NativeBiometricPlugin {
  constructor(
    private readonly verifyReturn: Promise<boolean> = Promise.resolve(true),
    private readonly setCredentialsReturn: Promise<void> = Promise.resolve(),
    private readonly getCredentialsReturn: Promise<any> = Promise.resolve({}),
    private readonly deleteCredentialsReturn: Promise<void> = Promise.resolve(),
    private readonly isAvailableReturn: Promise<any> = Promise.resolve({ isAvailable: true })
  ) {}

  verifyIdentity(options?: BiometricOptions): Promise<any> {
    return this.verifyReturn;
  }

  setCredentials(options: any): Promise<any> {
    return this.setCredentialsReturn;
  }

  getCredentials(options: any): Promise<any> {
    return this.getCredentialsReturn;
  }

  deleteCredentials(options: any): Promise<any> {
    return this.deleteCredentialsReturn;
  }

  isAvailable(options?: IsAvailableOptions): Promise<any> {
    return this.isAvailableReturn;
  }
}
