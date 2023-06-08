import { TestBed } from "@angular/core/testing";
import BalanceModalInjectable from "./balance-modal.injectable";


fdescribe('BalanceModalInjectable', ()=>{

  let service: BalanceModalInjectable;

  beforeEach(()=>{
    service = TestBed.inject(BalanceModalInjectable);
  })

  it('create',()=>{
    expect(service.create()).toBeInstanceOf(BalanceModalInjectable);
  })
})