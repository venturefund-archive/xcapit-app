import { BACKUP_OPTIONS, RawBackupOption } from '../../constants/backup-options';

export class BackupStepsDataRepo {
  constructor(private _backupSteps: RawBackupOption[] = BACKUP_OPTIONS) {}

  warranty(): RawBackupOption[] {
    return structuredClone(this._backupSteps).filter((step) => step.order === '1');
  }

  all(): RawBackupOption[] {
    return structuredClone(this._backupSteps);
  }
}
