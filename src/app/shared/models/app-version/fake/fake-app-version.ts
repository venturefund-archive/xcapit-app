import { AppVersion } from '../app-version.interface';

export class FakeAppVersion implements AppVersion {
  constructor(
    private readonly currentResponse: Promise<string> = Promise.resolve(''),
    private readonly lastAvailableResponse: string = '',
    private readonly updatedResponse: Promise<boolean> = Promise.resolve(false)
  ) {}

  public current(): Promise<string> {
    return this.currentResponse;
  }

  public lastAvailable(): string {
    return this.lastAvailableResponse;
  }

  public async updated(): Promise<boolean> {
    return this.updatedResponse;
  }
}
