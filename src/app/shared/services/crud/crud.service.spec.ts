import { TestBed } from '@angular/core/testing';

import { CrudService } from './crud.service';
import { CustomHttpService } from '../custom-http/custom-http.service';
import { CRUD } from './crud';

describe('CrudService', () => {
  let customHttpServiceSpy: any;
  let service: CrudService;
  let endpoint: CRUD;
  beforeEach(() => {
    customHttpServiceSpy = jasmine.createSpyObj('CustomHttpService', ['get', 'post', 'put', 'delete']);
    TestBed.configureTestingModule({
      providers: [
        { provide: CustomHttpService, useValue: customHttpServiceSpy }
      ]
    });
    service = TestBed.inject(CrudService);
    endpoint = service.getEndpoints('usuarios');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be return a endpoint methods', () => {
    expect(endpoint.create).toBeTruthy();
    expect(endpoint.delete).toBeTruthy();
    expect(endpoint.get).toBeTruthy();
    expect(endpoint.getAll).toBeTruthy();
    expect(endpoint.update).toBeTruthy();
  });

  it('should call get on CustomHttpService from get', () => {
    endpoint.get(1);
    expect(customHttpServiceSpy.get).toHaveBeenCalledTimes(1);
  });

  it('should call get CustomHttpService from getAll', () => {
    endpoint.getAll();
    expect(customHttpServiceSpy.get).toHaveBeenCalledTimes(1);
  });

  it('should call post CustomHttpService from create', () => {
    endpoint.create({});
    expect(customHttpServiceSpy.post).toHaveBeenCalledTimes(1);
  });

  it('should call put CustomHttpService from update', () => {
    endpoint.update({}, 1);
    expect(customHttpServiceSpy.put).toHaveBeenCalledTimes(1);
  });

  it('should call delete CustomHttpService from delete', () => {
    endpoint.delete(1);
    expect(customHttpServiceSpy.delete).toHaveBeenCalledTimes(1);
  });
});
