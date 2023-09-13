import { ActiveLender } from './active-lender';
import { FakeAppStorage } from '../../services/app-storage/app-storage.service';
import { FakeLenders } from '../lenders/fake/fake-lenders';
import { FakeLender } from '../lender/fake/fake-lender';


describe('ActiveLender', () => {
  let activeLender: ActiveLender;
  const anotherLenderName = 'anotherLenderName';
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
  
  it('new with null lenders', () => {
    expect( new ActiveLender(new FakeAppStorage())).toBeTruthy();
  });

  it('save', async () => {
    await activeLender.save(aLenderName);

    expect(await activeLender.name()).toEqual(aLenderName);
  });

  it('value', async () => {
    expect(await activeLender.value()).toEqual(aFakeLender);
  });

  it('from dynamic link', async () => {
    await activeLender.save(aLenderName, true);

    expect(await activeLender.fromDynamicLink()).toBeTrue();
  });

  it('from dynamic link default value', async () => {
    await activeLender.save(aLenderName);

    expect(await activeLender.fromDynamicLink()).toBeFalse();
  });

  it('initialSave when from dynamic link and lenderIsAlreadySet', async () => {
    await activeLender.save(anotherLenderName);
    await activeLender.initialSave(aLenderName, true);
    expect(await activeLender.name()).toEqual(aLenderName);
  })

  it('initialSave when not from dynamic link and lenderIsAlreadySet', async () => {
    await activeLender.save(anotherLenderName);
    await activeLender.initialSave(aLenderName);
    expect(await activeLender.name()).toEqual(anotherLenderName);
  })

  it('initialSave when not lenderIsAlreadySet', async () => {
    await activeLender.initialSave(aLenderName, false);
    expect(await activeLender.name()).toEqual(aLenderName);
  })
});
