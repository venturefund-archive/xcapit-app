
import { FakeAppStorage } from "../../services/app-storage/app-storage.service";
import { AppSession } from "./app-session";



describe('AppSession', ()=>{
    let appSession: AppSession
    
    let fakeStorage: FakeAppStorage
    const aDate = 1234
    const storageKey = '_xcp_app_session_created_time'

    beforeEach(() => {
        fakeStorage= new FakeAppStorage()
        appSession = new AppSession(fakeStorage)
    })

    it('new ', () => {
        expect(appSession).toBeTruthy();
    });

    it('validate', async () => {
        fakeStorage.set(storageKey, new Date().valueOf())
        expect(await appSession.valid()).toBeTrue()
    });

    it('validate return false', async () => {
        fakeStorage.set(storageKey, aDate)
        expect(await appSession.valid()).toBeFalse()
    });

    it('save', async () => {  
        appSession.save()       
        expect(await fakeStorage.get(storageKey)).toBeTruthy()
    });
})