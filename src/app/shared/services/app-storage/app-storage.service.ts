import {Injectable} from '@angular/core';
import {Plugins} from '@capacitor/core';

@Injectable({
    providedIn: 'root'
})
export class AppStorageService {

    constructor() {
    }

    storage = Plugins.Storage;

    static securedJSONParse(value: any) {
        let fixedValue;
        try {
            fixedValue = JSON.parse(value);
        } catch (e) {
            fixedValue = value;
        }
        return fixedValue;
    }

    public async get(key: string): Promise<any> {
        return AppStorageService.securedJSONParse((await this.storage.get({key})).value);
    }

    public set(key, value): Promise<void> {
        const fixValue = typeof value === 'string' ? value : JSON.stringify(value);
        return this.storage.set({key, value: fixValue});
    }

    public remove(key: string): Promise<void> {
        return this.storage.remove({key});
    }
}
