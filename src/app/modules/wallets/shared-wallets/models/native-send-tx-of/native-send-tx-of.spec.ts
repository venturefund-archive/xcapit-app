
import { FakeWallet, Wallet } from "src/app/modules/swaps/shared-swaps/models/wallet/wallet";

export class NativeSendTxOf {
    constructor(
        private _wallet : Wallet,
        private _to : string,
        private _amount : number
    ){}
}

fdescribe('NativeSendTxOf', ()=>{
    it('new', ()=>{
        expect(new NativeSendTxOf(new FakeWallet(), '', 1)).toBeTruthy();
    })
})