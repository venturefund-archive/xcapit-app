import { RawToken } from "src/app/modules/swaps/shared-swaps/models/token-repo/token-repo";

export class Transfers{
    constructor(private readonly _aToken: RawToken){
        
    }

}


fdescribe('Transfers', ()=>{
    let aToken: jasmine.SpyObj<RawToken>;

    beforeEach (()=>{
        aToken = jasmine.createSpyObj('RawToken', {}, { native: true, value: 'MATIC' });
    })

    it('new', ()=>{
        expect(new Transfers(aToken)).toBeTruthy();
    })
})