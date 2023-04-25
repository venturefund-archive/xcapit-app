import { NullRequestMessage } from './null-request-message';

describe('NullRequestMessage', () => {
  let nullRequestMessage: NullRequestMessage;
  beforeEach(() => {
    nullRequestMessage = new NullRequestMessage();
  });

  it('new', () => {
    expect(nullRequestMessage).toBeTruthy();
  });

  it('value', () => {
    expect(nullRequestMessage.value()).toBeUndefined();
  });
});
