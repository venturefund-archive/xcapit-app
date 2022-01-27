import { defer, isObservable, Observable, Subject } from 'rxjs';
import { mergeAll } from 'rxjs/operators';
import { Task } from './task.type';

export class Queue {
  private readonly _concurrency: number = 2;
  private queue: Subject<any>;
  public results: Observable<any>;

  constructor(private concurrency: number) {
    this._concurrency = concurrency;
    this.setQueue();
    this.setResults();
  }

  private setQueue(): void {
    this.queue = new Subject<any>();
  }

  private setResults() {
    this.results = this.queue.pipe(mergeAll(this._concurrency));
  }

  enqueue(aTask: Task): void {
    this.queue.next(isObservable(aTask) ? aTask : defer(() => aTask()));
  }
}
