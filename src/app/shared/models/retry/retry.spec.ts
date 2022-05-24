import { of, throwError } from 'rxjs';
import { Task } from '../task/task';
import { Retry } from './retry';
import { discardPeriodicTasks, fakeAsync, flush, flushMicrotasks, tick } from '@angular/core/testing';

describe('Retry', () => {
  let taskSpy: jasmine.SpyObj<Task>;
  beforeEach(() => {
    taskSpy = jasmine.createSpyObj('Task', { value: of('it passed') });
  });

  it('should create', () => {
    expect(new Retry(taskSpy, 2, 2)).toBeTruthy();
  });

  it('should not retry if not errors attempts', fakeAsync(() => {
    const retry = new Retry(taskSpy, 2, 3);
    let result: string;
    retry.execute().subscribe((res) => (result = res));
    tick(10);
    expect(result).toBe('it passed');
  }));

  it('should throw error after 2 attempts', fakeAsync(() => {
    let error: string;
    taskSpy.value.and.returnValue(throwError('testError'));
    const retry = new Retry(taskSpy, 2, 2);
    retry.execute().subscribe(
      () => {},
      (e) => (error = e)
    );
    tick(10);
    expect(error).toEqual('testError');
  }));
});
