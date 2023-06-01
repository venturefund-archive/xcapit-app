import { DefaultBackupSteps } from './default-backup-steps';

fdescribe('DefaultBackupSteps', () => {
  let defaultBackupSteps: DefaultBackupSteps;

  beforeEach(() => {
    defaultBackupSteps = new DefaultBackupSteps();
  });

  it('new', () => {
    expect(defaultBackupSteps).toBeTruthy();
  });

  it('warranty', () => {
    const warranty = defaultBackupSteps.warranty();
    console.log(warranty);
    expect(warranty.length).toEqual(1);
    expect(warranty[0].json().order).toEqual('1');
  });
});
