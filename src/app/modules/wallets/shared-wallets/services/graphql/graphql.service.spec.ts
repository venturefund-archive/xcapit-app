import { TestBed } from '@angular/core/testing';
import { GraphqlService } from './graphql.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { EnvService } from 'src/app/shared/services/env/env.service';

describe('GraphqlService', () => {
  let service: GraphqlService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let envServiceSpy: jasmine.SpyObj<EnvService>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', {
      post: of({}),
    });

    envServiceSpy = jasmine.createSpyObj('EnvService', {
      byKey: 'https://test',
    });

    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: EnvService, useValue: envServiceSpy },
      ],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(GraphqlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get invested balance', () => {
    service.getInvestedBalance('address', 1);
    expect(httpClientSpy.post).toHaveBeenCalledTimes(1);
  });

  it('should get all movements', () => {
    service.getAllMovements('address', 1);
    expect(httpClientSpy.post).toHaveBeenCalledTimes(1);
  });
});
