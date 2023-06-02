import { BackupStepsDataRepo } from './backup-steps-data-repo';

describe('BackupStepsDataRepo', () => {
  let backupStepsDataRepo: BackupStepsDataRepo;

  beforeEach(() => {
    backupStepsDataRepo = new BackupStepsDataRepo();
  });

  it('new', () => {
    expect(backupStepsDataRepo).toBeTruthy();
  });

  it('warranty', () => {
    const warranty = backupStepsDataRepo.warranty();
    expect(warranty.length).toEqual(1);
    expect(warranty[0].order).toEqual('1');
  });

  it('all', () => {
    const warranty = backupStepsDataRepo.all();
    expect(warranty.length).toEqual(2);
    expect(warranty[0].order).toEqual('1');
    expect(warranty[1].order).toEqual('2');
  });
});
