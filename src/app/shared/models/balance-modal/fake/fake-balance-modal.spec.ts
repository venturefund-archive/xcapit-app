export class FakeBalanceModal {
}

fdescribe('FakeBalanceModal', () => {
  let fakeBalanceModal: BalanceModal;
  beforeEach(() => {
    fakeBalanceModal = new FakeBalanceModal();
  });

  it('new', () => {
    expect(fakeBalanceModal).toBeTruthy();
  });
});
