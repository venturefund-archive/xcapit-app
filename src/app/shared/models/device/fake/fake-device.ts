import { DeviceWrapper } from '../device-wrapper.interface';

export class FakeDevice implements DeviceWrapper {
  constructor(private readonly languageResponse: Promise<any> = Promise.resolve()) {}

  getLanguageCode(): Promise<any> {
    return this.languageResponse;
  }
}
