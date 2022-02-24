import { of, throwError } from 'rxjs';
import { Task } from '../task/task';
import { Retry } from './retry';

describe('Retry', () => {
  let taskSpy: jasmine.SpyObj<Task>;
  beforeEach(() => {
    taskSpy = jasmine.createSpyObj('Task', { value: of('it passed') });
  });

  it('should create', () => {
    expect(new Retry(taskSpy, 2000, 2)).toBeTruthy();
  });

  it('should not retry if not errors attempts', () => {
    const retry = new Retry(taskSpy, 2000, 3);
    retry.execute().subscribe((res) => {
      expect(res).toBe('it passed');
    });
  });

  it('should throw error after 2 attempts', (done) => {
    taskSpy.value.and.returnValue(throwError('testError'));
    const retry = new Retry(taskSpy, 2, 2);
    retry.execute().subscribe(
      () => {},
      (error) => {
        expect(error).toBe('testError');
        done();
      }
    );
  });
});
