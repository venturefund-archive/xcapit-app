import { isObservable, of } from 'rxjs';
import { Task } from './task';

describe('Task', () => {
  it('should create', () => {
    expect(new Task(of({}))).toBeTruthy();
  });

  it('should return observable when observable', () => {
    const task = new Task(of({}));
    expect(isObservable(task.value())).toBeTrue();
  });

  it('should return observable when promise', () => {
    const task = new Task(() => Promise.resolve({}));
    expect(isObservable(task.value())).toBeTrue();
  });
});
