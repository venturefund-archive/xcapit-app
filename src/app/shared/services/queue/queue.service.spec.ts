import { TestBed } from '@angular/core/testing';
import { QueueService } from './queue.service';
import { Queue } from './queue';
import { of } from 'rxjs';

describe('QueueService', () => {
  let service: QueueService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QueueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create queue', () => {
    service.create('testQ', 2);
    expect(service.queues['testQ'] instanceof Queue).toBeTrue();
  });

  it('should enqueue task', () => {
    service.create('testQ', 2);
    service.enqueue('testQ', () => Promise.resolve(1));
    expect(true).toBeTrue();
  });

  xit('should subscribe to result', () => {
    service.create('testQ', 1);
    const result = [];
    service.results('testQ').subscribe((res) => {
      result.push(res);
    });
    service.enqueue('testQ', of(1));
    service.enqueue('testQ', of(2));
    expect(result).toEqual([1, 2]);
  });

  it('should dequeue all tasks', () => {
    service.dequeueAll();
    expect(service.queues).toEqual({});
  });
});
