import { BackupStep } from '../backup-step/backup-step';
import { RawBackupOption } from '../../constants/backup-options';

export class StatusBackupStepOf {
  constructor(
    private _statusBackupSteps: BackupStep[],
    private _walletBackup: boolean,
    private _protectedWallet: boolean
  ) {}

  value(): BackupStep[] {
    if (this._walletBackup && this._statusBackupSteps.length === 1) {
      this._statusBackupSteps[0].complete();
    } else if (this._walletBackup && this._statusBackupSteps.length === 1) {
      this._statusBackupSteps[0].complete();
      this._statusBackupSteps[1].enable();
    } else if (this._protectedWallet && this._statusBackupSteps.length > 1) {
      this._statusBackupSteps[1].complete();
    }
    return this._statusBackupSteps;
  }

  json(): RawBackupOption[] {
    return this.value().map((step) => step.json());
  }
}
