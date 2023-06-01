import { rawBackupStep } from '../../fixtures/raw-backup-step';
import { BackupStep } from './backup-step';

fdescribe('BackupStep', () => {
  let backupStep: BackupStep;
  beforeEach(() => {
    backupStep = new BackupStep(rawBackupStep);
  });

  it('new', () => {
    expect(backupStep).toBeTruthy();
  });

  it('complete', () => {
    backupStep.complete();
    expect(backupStep.json().completed).toEqual(true);
  });

  it('enable', () => {
    backupStep.enable();
    expect(backupStep.json().disabled).toEqual(false);
  });
});
