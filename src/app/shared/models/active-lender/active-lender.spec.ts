import { ActiveLender } from './active-lender';
import { FakeAppStorage } from '../../services/app-storage/app-storage.service';
import { FakeLenders } from '../lenders/fake/fake-lenders';
import { FakeLender } from '../lender/fake/fake-lender';


describe('ActiveLender', () => {
  let activeLender: ActiveLender;
  const aLenderName = 'aLenderName';
  const aFakeLender = new FakeLender();

  beforeEach(() => {
    activeLender = new ActiveLender(
      new FakeAppStorage(),
      new FakeLenders(aFakeLender)
    );
  });

  it('new', () => {
    expect(activeLender).toBeTruthy();
  });

  it('save', async () => {
    await activeLender.save(aLenderName);

    expect(await activeLender.name()).toEqual(aLenderName);
  });

  it('value', async () => {
    expect(await activeLender.value()).toEqual(aFakeLender);
  });
});
