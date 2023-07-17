import { LastVersionInjectable } from './last-version.injectable';


describe('LastVersionInjectable', () => {

  const appVersionInjectableSpy = jasmine.createSpyObj('AppVersionInjectable', { create: null });

  it('create', () => {
    expect(new LastVersionInjectable(appVersionInjectableSpy, null, null).create()).toBeTruthy();
  });
});
