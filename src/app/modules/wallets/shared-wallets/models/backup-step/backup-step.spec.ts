import { rawBackupStep } from '../../fixtures/raw-backup-step';
import { BackupStep } from './backup-step';

describe('BackupStep', () => {
  let backupStep: BackupStep;
  beforeEach(() => {
    backupStep = new BackupStep(rawBackupStep, false);
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

  it('warranty step', () => {
    backupStep = new BackupStep(rawBackupStep, true);
    const tplStep = backupStep.json();
    expect(tplStep.title).toEqual('wallets.success_creation.backup_options.option_2.warranty_title');
    expect(tplStep.subtitle).toEqual('wallets.success_creation.backup_options.option_2.warranty_subtitle');
  });
});
