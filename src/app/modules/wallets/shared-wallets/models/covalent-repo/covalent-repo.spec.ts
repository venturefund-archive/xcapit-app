import { FakeHttpClient } from "src/testing/fakes/fake-http.spec"

export class CovalentRepo{}

fdescribe('CovalentRepo',()=>{
    it('new ',()=>{
        expect(new CovalentRepo(new FakeHttpClient())).toBeTruthy()
    })
})