import { DefaultModalFactory, Modals } from './default-modal-factory';

describe('DefaultModalFactory', () => {
  let defaultModalFactory: DefaultModalFactory;

  beforeEach(() => {
    defaultModalFactory = new DefaultModalFactory(null, null);
  });

  it('new', () => {
    expect(defaultModalFactory).toBeTruthy();
  });

  it('oneBy', () => {
    expect(defaultModalFactory.oneBy(Modals.GENERAL_WITH_BUTTON, [])).toBeTruthy();
  });
});
