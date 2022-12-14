import { DefaultCapacitorApp } from '../default/default-capacitor-app';
import { CapacitorAppInjectable } from './capacitor-app.injectable';

describe('CapacitorAppInjectable', () => {
  it('create', () => {
    expect(new CapacitorAppInjectable().create()).toBeInstanceOf(DefaultCapacitorApp);
  });
});
