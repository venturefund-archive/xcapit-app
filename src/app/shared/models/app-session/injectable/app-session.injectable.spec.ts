import { AppSession } from '../app-session';
import { AppSessionInjectable } from './app-session.injectable';

describe('AppSessionInjectable', () => {
  it('create', () => {
    expect(new AppSessionInjectable(null, null).create()).toBeInstanceOf(AppSession);
  });
});
