import { GDRIVE_ERRORS } from '../../constants/gdrive-errors.constant';

export class GoogleDriveError {
  constructor(
    private readonly _googleDriveError: { error: any },
    private readonly _googleDriveErrors = GDRIVE_ERRORS
  ) {}

  public value(): string {
    return this._googleDriveErrors[this._error()];
  }

  private _error(): string {
    let result = this._googleDriveError.error;
    if (typeof result !== 'string') {
      result = result.error.status;
    }
    return result;
  }
}
