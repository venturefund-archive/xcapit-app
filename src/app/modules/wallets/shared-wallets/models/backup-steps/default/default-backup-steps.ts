import { BackupStepsDataRepo } from '../../backup-steps-data-repo/backup-steps-data-repo';
import { BackupStep } from '../../backup-step/backup-step';

export class DefaultBackupSteps {
  constructor(private _dataRepo: BackupStepsDataRepo = new BackupStepsDataRepo()) {}

  warranty(): BackupStep[] {
    return this._dataRepo.warranty().map((rawStep) => new BackupStep(rawStep, true));
  }

  all(): BackupStep[] {
    return this._dataRepo.all().map((rawStep) => new BackupStep(rawStep, false));
  }
}
