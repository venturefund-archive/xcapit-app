import { DefaultBackupSteps } from './default-backup-steps';

describe('DefaultBackupSteps', () => {
  let defaultBackupSteps: DefaultBackupSteps;

  beforeEach(() => {
    defaultBackupSteps = new DefaultBackupSteps();
  });

  it('new', () => {
    expect(defaultBackupSteps).toBeTruthy();
  });

  it('warranty', () => {
    const warranty = defaultBackupSteps.warranty();
    expect(warranty.length).toEqual(1);
    expect(warranty[0].json().order).toEqual('1');
  });

  it('all', () => {
    const all = defaultBackupSteps.all();
    expect(all.length).toEqual(2);
    expect(all[0].json().order).toEqual('1');
    expect(all[1].json().order).toEqual('2');
  });

});
