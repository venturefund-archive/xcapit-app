import { RequestMethod } from '../../request-method/request-method';
import { NullRequest } from './null-request';
import { RawSessionRequest } from '../raw-session-request.type';

describe('NullRequest', () => {
  it('new', () => {
    expect(new NullRequest()).toBeTruthy();
  });

  it('raw', () => {
    expect(new NullRequest().raw()).toEqual(undefined as RawSessionRequest);
  });

  it('method', () => {
    expect(new NullRequest().method()).toEqual(undefined as RequestMethod);
  });

  it('approve', async () => {
    await expectAsync(new NullRequest().approve()).toBeResolved();
  });

  it('reject', async () => {
    await expectAsync(new NullRequest().reject()).toBeResolved();
  });
});
