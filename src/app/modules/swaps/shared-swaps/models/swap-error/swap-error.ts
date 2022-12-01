export type RawError = 'swap_not_ok' | 'swap_not_ok_blockchain';
 
 export class SwapError{
    
    constructor(private readonly _anError: any){
    }

    private is1inchError() {
        return this._anError.url.includes('1inch');
    }
    
    type(): RawError{
        return this.is1inchError() ? 'swap_not_ok' : 'swap_not_ok_blockchain'; 
    }
}