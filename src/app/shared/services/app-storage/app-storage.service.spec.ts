import {TestBed} from '@angular/core/testing';

import {AppStorageService} from './app-storage.service';
import {mockStoragePlugin} from '../../../../testing/spies/storage-plugin-mock.spec';


describe('AppStorageService', () => {
    let service: AppStorageService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(AppStorageService);
        service.storage = mockStoragePlugin;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return a string value', async () => {
        mockStoragePlugin.get = ({key}) => Promise.resolve({value: 'topo'});
        const expectedValue = await mockStoragePlugin.get({key: 'key1'});

        const result = await service.get('key1');

        expect(result).toEqual(expectedValue.value);
    });

    it('should return a object value', async () => {
        mockStoragePlugin.get = ({key}) => Promise.resolve(
            { value: JSON.stringify({key1: 'topo'}) }
        );
        const expectedValue = JSON.parse((await mockStoragePlugin.get({key: 'key1'})).value);

        const result = await service.get('key1');

        expect(result).toEqual(expectedValue);
    });

    it('should set a object value', async () => {
        const spy = spyOn(service.storage, 'set');

        const result = await service.set('oneKey', {p1: 'asd', p2: 'asd'});

        expect(result);
        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should set a string value', async () => {
        const spy = spyOn(service.storage, 'set');

        await service.set('oneKey', 'asdf');

        expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should remove a value', async () => {
        const spy = spyOn(service.storage, 'remove');

        await service.remove('oneKey');

        expect(spy).toHaveBeenCalledTimes(1);
    });
});
