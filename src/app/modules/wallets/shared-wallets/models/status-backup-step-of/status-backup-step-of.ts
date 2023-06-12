import { BackupStep } from '../backup-step/backup-step';
import { RawBackupOption } from '../../constants/backup-options';

export class StatusBackupStepOf {
  constructor(
    private _statusBackupSteps: BackupStep[],
    private _walletBackup: boolean,
    private _protectedWallet: boolean
  ) {}

  private _value(): BackupStep[] {
    if (this._walletBackup && this._statusBackupSteps.length === 1) {
      this._statusBackupSteps[0].complete();
    } else if (this._walletBackup && this._statusBackupSteps.length > 1) {
      this._statusBackupSteps[0].complete();
      this._statusBackupSteps[1].enable();
    }
    if (this._protectedWallet) {
      this._statusBackupSteps[1].complete();
    }
    return this._statusBackupSteps;
  }

  json(): RawBackupOption[] {
    return this._value().map((step) => step.json());
  }
}
