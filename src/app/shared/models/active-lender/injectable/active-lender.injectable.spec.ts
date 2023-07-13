import { ActiveLenderInjectable } from './active-lender.injectable';
import { LendersInjectable } from '../../lenders/injectable/lenders.injectable';


describe('ActiveLenderInjectable', () => {
  let activeLenderInjectable: ActiveLenderInjectable;
  let lendersInjectableSpy: jasmine.SpyObj<LendersInjectable>;

  beforeEach(()=>{
    lendersInjectableSpy = jasmine.createSpyObj('LendersInjectable', {
      create: null
    })

    activeLenderInjectable = new ActiveLenderInjectable(null, lendersInjectableSpy);

  })

  it('new', () => {
    expect(activeLenderInjectable).toBeTruthy();
  });

  it('create', () => {
    expect(activeLenderInjectable.create()).toBeTruthy();
  });
});
