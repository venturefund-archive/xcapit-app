import { RawBackupOption } from '../../constants/backup-options';

export class BackupStep {
  constructor(private _aRawBackupStep: RawBackupOption) {}

  complete(): void {
    this._aRawBackupStep.completed = true;
  }

  enable(): void {
    this._aRawBackupStep.disabled = false;
  }

  json(): RawBackupOption {
    return structuredClone(this._aRawBackupStep);
  }
}
