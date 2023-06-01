import { BackupStep } from '../backup-step/backup-step';
import { rawBackupStep, rawBackupStep2 } from '../../fixtures/raw-backup-step';
import { StatusBackupStepOf } from './status-backup-step-of';

fdescribe('StatusBackupStepOf', () => {
  let statusBackupStepOf: StatusBackupStepOf;

  beforeEach(() => {
    statusBackupStepOf = new StatusBackupStepOf(
      [new BackupStep(rawBackupStep), new BackupStep(rawBackupStep2)],
      true,
      true
    );
  });

  it('new', () => {
    expect(statusBackupStepOf).toBeTruthy();
  });

  it('json with backup and protected', () => {
    const tplStatusBackup = statusBackupStepOf.json();
    expect(tplStatusBackup[0].completed).toBeTrue();
    expect(tplStatusBackup[0].disabled).toBeFalse();
    expect(tplStatusBackup[1].completed).toBeTrue();
    expect(tplStatusBackup[1].disabled).toBeTrue();
  });

  it('json without backup nor protected wallet', () => {
    statusBackupStepOf = new StatusBackupStepOf(
      [new BackupStep(rawBackupStep), new BackupStep(rawBackupStep2)],
      false,
      false
    );
    console.log(statusBackupStepOf.json());
    const tplStatusBackup = statusBackupStepOf.json();
    expect(tplStatusBackup[0].completed).toBeFalse();
    expect(tplStatusBackup[0].disabled).toBeFalse();
    expect(tplStatusBackup[1].completed).toBeFalse();
    expect(tplStatusBackup[1].disabled).toBeTrue();
  });

  it('json with backup but no protected wallet', () => {
    statusBackupStepOf = new StatusBackupStepOf(
      [new BackupStep(rawBackupStep), new BackupStep(rawBackupStep2)],
      true,
      false
    );
    console.log(statusBackupStepOf.json());
    const tplStatusBackup = statusBackupStepOf.json();
    expect(tplStatusBackup[0].completed).toBeFalse();
    expect(tplStatusBackup[0].disabled).toBeFalse();
    expect(tplStatusBackup[1].completed).toBeFalse();
    expect(tplStatusBackup[1].disabled).toBeTrue();
  });
});
