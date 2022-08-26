import { HttpClient } from "@angular/common/http"
import { FakeHttpClient } from "src/testing/fakes/fake-http.spec"

export class CovalentRepo{
constructor (private readonly _http: HttpClient | FakeHttpClient) {}

}

fdescribe('CovalentRepo',()=>{
    it('new' ,()=>{
        expect(new CovalentRepo(new FakeHttpClient())).toBeTruthy()
    });

    it('transfersOf',()=>{
        expect(new CovalentRepo(new FakeHttpClient()).transfersOf()).toBeTruthy()
    });
})
