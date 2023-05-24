import { GDRIVE_ERRORS } from '../../constants/gdrive-errors.constant';

export class GoogleDriveError {
  constructor(private readonly _googleDriveError: any, private readonly _googleDriveErrors = GDRIVE_ERRORS) {}

  public value(): string {
    return this._googleDriveErrors.has(this._error())
      ? this._googleDriveErrors.get(this._error())
      : this._googleDriveErrors.get('generic');
  }

  private _error(): string {
    try {
      let result = this._googleDriveError.type;
      if (typeof result !== 'string') {
        result = this._googleDriveError.error.error.status;
      }
      return result;
    } catch {
      return 'generic';
    }
  }
}
