import { RawBackupOption } from '../../constants/backup-options';

export class BackupStep {
  private backupStepCopy: RawBackupOption;
  constructor(private _aRawBackupStep: RawBackupOption, private _warrantyStep: boolean) {
    this.backupStepCopy = structuredClone(this._aRawBackupStep);
  }

  complete(): void {
    this.backupStepCopy.completed = true;
  }

  enable(): void {
    this.backupStepCopy.disabled = false;
  }

  json(): RawBackupOption {
    if (this._warrantyStep) {
      this.backupStepCopy.title = 'wallets.success_creation.backup_options.option_2.warranty_title';
      this.backupStepCopy.subtitle = 'wallets.success_creation.backup_options.option_2.warranty_subtitle';
    }
    return structuredClone(this.backupStepCopy);
  }
}
