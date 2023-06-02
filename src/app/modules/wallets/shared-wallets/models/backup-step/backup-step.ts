import { RawBackupOption } from '../../constants/backup-options';

export class BackupStep {
  private backupStepCopy: RawBackupOption;
  constructor(private _aRawBackupStep: RawBackupOption) {
    this.backupStepCopy = structuredClone(this._aRawBackupStep);
  }

  complete(): void {
    this.backupStepCopy.completed = true;
  }

  enable(): void {
    this.backupStepCopy.disabled = false;
  }

  json(): RawBackupOption {
    return structuredClone(this.backupStepCopy);
  }
}
