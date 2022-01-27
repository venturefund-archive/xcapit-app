import { Queue } from './queue';
import { of } from 'rxjs';

describe('Queue', () => {
  let service: Queue;
  beforeEach(() => {
    service = new Queue(2);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should enqueue a promise function and observable task', async () => {
    const spyPromiseFn = jasmine.createSpy('PromiseFn', () => Promise.resolve({}));
    service.results.subscribe();
    service.enqueue(spyPromiseFn);
    service.enqueue(of({}));
    service.enqueue(spyPromiseFn);
    expect(spyPromiseFn).toHaveBeenCalledTimes(2);
  });

});
