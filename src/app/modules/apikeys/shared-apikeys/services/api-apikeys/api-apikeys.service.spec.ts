import { TestBed } from '@angular/core/testing';
import { ApiApikeysService } from './api-apikeys.service';
import { CrudService } from 'src/app/shared/services/crud/crud.service';
import { of } from 'rxjs';
import { CustomHttpService } from '../../../../../shared/services/custom-http/custom-http.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';

describe('ApiApikeysService', () => {
  let apiApikeysService: ApiApikeysService;
  let crudSpy: any;
  let customHttpServiceSpy: any;

  beforeEach(() => {
    crudSpy = jasmine.createSpyObj('CrudService', ['getEndpoints']);
    customHttpServiceSpy = jasmine.createSpyObj('CustomHttpService', {
      post: of({}),
      get: of({}),
      original: { patch: of({}) },
      put: of({}),
      delete: of({})
    });
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TranslateModule.forRoot()],
      providers: [
        { provide: CrudService, useValue: crudSpy },
      ],
    });
    apiApikeysService = TestBed.inject(ApiApikeysService);
    customHttpServiceSpy = TestBed.inject(CustomHttpService);
  });

  it('should be created', () => {
    expect(apiApikeysService).toBeTruthy();
  });

  it('should be call get on http when getByFundName', () => {
    apiApikeysService.getByFundName('test').subscribe(() => {
      expect(customHttpServiceSpy.get).toHaveBeenCalledTimes(1);
    });
  });

  it('it should call get on http when getAll', () => {
    apiApikeysService.getAll().subscribe(() => {
      expect(customHttpServiceSpy.get).toHaveBeenCalledTimes(1);
    });
  });

  it('it should call post on http when create', () => {
    apiApikeysService.create({}).subscribe(() => {
      expect(customHttpServiceSpy.post).toHaveBeenCalledTimes(1);
    });
  });

  it('it should call patch on http when update', () => {
    apiApikeysService.update({}, 1).subscribe(() => {
      expect(customHttpServiceSpy.patch).toHaveBeenCalledTimes(1);
    });
  });

  it('it should call delete on http when delete', () => {
    apiApikeysService.delete(1).subscribe(() => {
      expect(customHttpServiceSpy.delete).toHaveBeenCalledTimes(1);
    });
  });
});
