import { Transfer } from "../transfer/transfer";

export class JSONTransfer {
    
}

fdescribe('JSONTransfer', ()=> {
    it ('new', ()=>{
        expect(new JSONTransfer(new Transfer())).toBeTruthy();
    });
});