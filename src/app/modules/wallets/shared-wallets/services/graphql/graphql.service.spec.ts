import { TestBed } from '@angular/core/testing';
import { GraphqlService } from './graphql.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('GraphqlService', () => {
  let service: GraphqlService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', {
      post: of({}),
    });
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: httpClientSpy }],
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
});
