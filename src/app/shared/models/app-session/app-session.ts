import { FakeAppStorage } from "../../services/app-storage/app-storage.service";
import { IonicStorageService } from "../../services/ionic-storage/ionic-storage.service";


//AppSession
export class AppSession {
    private readonly _storageKey: string = '_xcp_app_session_created_time';

    constructor(private readonly storage: IonicStorageService | FakeAppStorage){}

    public save(): void{
        this.storage.set(this._storageKey, new Date().valueOf());
    }

    public async valid() : Promise<boolean>{
        return await this._timeActive() < 2;        
    }

    private _storageValue(): Promise<any>{
        return this.storage.get(this._storageKey)
    }

    private async _timeActive(): Promise<number>{
        return Math.abs(new Date().valueOf() - await this._storageValue()) / (1000 * 60)        
    }
}