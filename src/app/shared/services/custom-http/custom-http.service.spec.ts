import { TestBed } from '@angular/core/testing';
import { CustomHttpService } from './custom-http.service';
import { LoadingService } from '../loading/loading.service';
import { XhrResponseHandlerService } from '../xhr-response-handler/xhr-response-handler.service';
import { HttpClient } from '@angular/common/http';
import { SubmitButtonService } from '../submit-button/submit-button.service';
import { of, throwError } from 'rxjs';

describe('CustomHttpService', () => {
  let service: CustomHttpService;
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;
  let xhrResponseHandlerServiceSpy: jasmine.SpyObj<XhrResponseHandlerService>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let submitButtonServiceSpy: jasmine.SpyObj<SubmitButtonService>;

  beforeEach(() => {
    loadingServiceSpy = jasmine.createSpyObj('LoadingService', {
      show: Promise.resolve(),
      dismiss: Promise.resolve(),
    });
    httpClientSpy = jasmine.createSpyObj('HttpClient', {
      get: of({}),
      post: of({}),
      put: of({}),
      delete: of({}),
    });
    submitButtonServiceSpy = jasmine.createSpyObj('SubmitButtonService', ['enabled', 'disabled']);
    xhrResponseHandlerServiceSpy = jasmine.createSpyObj('XhrResponseHandlerService', {
      error: (error) => {
        return Promise.resolve();
      },
    });
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: XhrResponseHandlerService, useValue: xhrResponseHandlerServiceSpy },
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: SubmitButtonService, useValue: submitButtonServiceSpy },
      ],
    });
    service = TestBed.inject(CustomHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be return HttpClient Object', () => {
    expect(service.original).toBeTruthy();
  });

  describe('GET', () => {
    it('should call http client and show loading when is called', async () => {
      await service.get('testUrl', {}, 'testError').toPromise();
      expect(loadingServiceSpy.show).toHaveBeenCalledTimes(1);
      expect(loadingServiceSpy.dismiss).toHaveBeenCalledTimes(1);
      expect(submitButtonServiceSpy.disabled).toHaveBeenCalledTimes(1);
      expect(submitButtonServiceSpy.enabled).toHaveBeenCalledTimes(1);
      expect(httpClientSpy.get).toHaveBeenCalledOnceWith('testUrl', {});
    });

    it('should call http client and not show loading when is called with loading false', async () => {
      await service.get('testUrl', {}, 'testError', false).toPromise();
      expect(loadingServiceSpy.show).toHaveBeenCalledTimes(0);
      expect(loadingServiceSpy.dismiss).toHaveBeenCalledTimes(0);
      expect(submitButtonServiceSpy.disabled).toHaveBeenCalledTimes(1);
      expect(submitButtonServiceSpy.enabled).toHaveBeenCalledTimes(1);
      expect(httpClientSpy.get).toHaveBeenCalledOnceWith('testUrl', {});
    });

    it('should handle error when is called', async () => {
      httpClientSpy.get.and.returnValue(throwError({ error: 'some error' }));
      await service.get('testUrl', {}, 'testError', false).toPromise();
      expect(httpClientSpy.get).toHaveBeenCalledOnceWith('testUrl', {});
      expect(xhrResponseHandlerServiceSpy.error).toHaveBeenCalledTimes(1);
    });
  });

  describe('POST', () => {
    it('should call http client and show loading when is called', async () => {
      await service.post('testUrl', {}, 'testError').toPromise();
      expect(loadingServiceSpy.show).toHaveBeenCalledTimes(1);
      expect(loadingServiceSpy.dismiss).toHaveBeenCalledTimes(1);
      expect(submitButtonServiceSpy.disabled).toHaveBeenCalledTimes(1);
      expect(submitButtonServiceSpy.enabled).toHaveBeenCalledTimes(1);
      expect(httpClientSpy.post).toHaveBeenCalledOnceWith('testUrl', {});
    });

    it('should call http client and not show loading when is called with loading false', async () => {
      await service.post('testUrl', {}, 'testError', false).toPromise();
      expect(loadingServiceSpy.show).toHaveBeenCalledTimes(0);
      expect(loadingServiceSpy.dismiss).toHaveBeenCalledTimes(0);
      expect(submitButtonServiceSpy.disabled).toHaveBeenCalledTimes(1);
      expect(submitButtonServiceSpy.enabled).toHaveBeenCalledTimes(1);
      expect(httpClientSpy.post).toHaveBeenCalledOnceWith('testUrl', {});
    });

    it('should handle error when is called', async () => {
      httpClientSpy.post.and.returnValue(throwError({ error: 'some error' }));
      await service.post('testUrl', {}, 'testError', false).toPromise();
      expect(httpClientSpy.post).toHaveBeenCalledOnceWith('testUrl', {});
      expect(xhrResponseHandlerServiceSpy.error).toHaveBeenCalledTimes(1);
    });
  });

  describe('PUT', () => {
    it('should call http client and show loading when is called', async () => {
      await service.put('testUrl', {}, 'testError').toPromise();
      expect(loadingServiceSpy.show).toHaveBeenCalledTimes(1);
      expect(loadingServiceSpy.dismiss).toHaveBeenCalledTimes(1);
      expect(submitButtonServiceSpy.disabled).toHaveBeenCalledTimes(1);
      expect(submitButtonServiceSpy.enabled).toHaveBeenCalledTimes(1);
      expect(httpClientSpy.put).toHaveBeenCalledOnceWith('testUrl', {});
    });

    it('should call http client and not show loading when is called with loading false', async () => {
      await service.put('testUrl', {}, 'testError', false).toPromise();
      expect(loadingServiceSpy.show).toHaveBeenCalledTimes(0);
      expect(loadingServiceSpy.dismiss).toHaveBeenCalledTimes(0);
      expect(submitButtonServiceSpy.disabled).toHaveBeenCalledTimes(1);
      expect(submitButtonServiceSpy.enabled).toHaveBeenCalledTimes(1);
      expect(httpClientSpy.put).toHaveBeenCalledOnceWith('testUrl', {});
    });

    it('should handle error when is called', async () => {
      httpClientSpy.put.and.returnValue(throwError({ error: 'some error' }));
      await service.put('testUrl', {}, 'testError', false).toPromise();
      expect(httpClientSpy.put).toHaveBeenCalledOnceWith('testUrl', {});
      expect(xhrResponseHandlerServiceSpy.error).toHaveBeenCalledTimes(1);
    });
  });

  describe('DELETE', () => {
    it('should call http client and show loading when is called', async () => {
      await service.delete('testUrl', 'testError').toPromise();
      expect(loadingServiceSpy.show).toHaveBeenCalledTimes(1);
      expect(loadingServiceSpy.dismiss).toHaveBeenCalledTimes(1);
      expect(submitButtonServiceSpy.disabled).toHaveBeenCalledTimes(1);
      expect(submitButtonServiceSpy.enabled).toHaveBeenCalledTimes(1);
      expect(httpClientSpy.delete).toHaveBeenCalledOnceWith('testUrl');
    });

    it('should call http client and not show loading when is called with loading false', async () => {
      await service.delete('testUrl', 'testError', false).toPromise();
      expect(loadingServiceSpy.show).toHaveBeenCalledTimes(0);
      expect(loadingServiceSpy.dismiss).toHaveBeenCalledTimes(0);
      expect(submitButtonServiceSpy.disabled).toHaveBeenCalledTimes(1);
      expect(submitButtonServiceSpy.enabled).toHaveBeenCalledTimes(1);
      expect(httpClientSpy.delete).toHaveBeenCalledOnceWith('testUrl');
    });

    it('should handle error when is called', async () => {
      httpClientSpy.delete.and.returnValue(throwError({ error: 'some error' }));
      await service.delete('testUrl', 'testError', false).toPromise();
      expect(httpClientSpy.delete).toHaveBeenCalledOnceWith('testUrl');
      expect(xhrResponseHandlerServiceSpy.error).toHaveBeenCalledTimes(1);
    });
  });
});
