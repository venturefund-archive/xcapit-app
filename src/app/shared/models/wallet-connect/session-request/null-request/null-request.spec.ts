import { RequestMethod } from '../../request-method/request-method';
import { NullRequest } from './null-request';
import { RawSessionRequest } from '../raw-session-request.type';

describe('NullRequest', () => {
  it('new', () => {
    expect(new NullRequest()).toBeTruthy();
  });

  it('raw', () => {
    expect(new NullRequest().raw()).toEqual({} as RawSessionRequest);
  });

  it('method', () => {
    expect(new NullRequest().method()).toEqual({} as RequestMethod);
  });

  it('approve', () => {
    expect(new NullRequest().approve()).toBeUndefined();
  });

  it('reject', () => {
    expect(new NullRequest().reject()).toBeUndefined();
  });
});
