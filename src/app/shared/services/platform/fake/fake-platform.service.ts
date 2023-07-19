import { PlatformService } from "../platform-service.interface";


export class FakePlatformService implements PlatformService {

  constructor(private _isNativeReturn: boolean = false) {}

  isWeb(): boolean {
    throw new Error("Method not implemented.");
  }
  platform(): string {
    throw new Error("Method not implemented.");
  }

  isNative(): boolean {
    return this._isNativeReturn;
  }
}
