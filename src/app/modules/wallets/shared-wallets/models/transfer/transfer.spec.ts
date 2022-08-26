export class Transfer{
  constructor(){    
  }

public fee(){
  return true;
}

}

fdescribe('Transfer', () => {
  it('new', () => {
    expect(new Transfer()).toBeTruthy();
  });

  it('fee', ()=>{
    expect(new Transfer().fee()).toBeTruthy();
  })
});
