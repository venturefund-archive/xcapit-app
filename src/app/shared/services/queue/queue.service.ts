import { Injectable } from '@angular/core';
import { defer, isObservable, Observable, of, Subject } from 'rxjs';
import { delay, mergeAll } from 'rxjs/operators';

type Task = Observable<any> | (() => Promise<any>);

export class Queue {}

@Injectable({
  providedIn: 'root',
})
export class QueueService {
  private _concurrency: number = 2;
  queue: Subject<any>;
  results: any;

  constructor() {
    this.clear();
    this.setResults();
  }

  private setResults() {
    this.results = this.queue.pipe(mergeAll(this._concurrency));
  }

  set concurrency(concurrency: number) {
    this._concurrency = concurrency;
    this.setResults();
  }

  add(aTask: Task): void {
    this.queue.next(isObservable(aTask) ? aTask : defer(() => aTask()));
  }

  clear(): void {
    this.queue = new Subject();
  }

  async test() {
    // Subscribe to results
    this.results.subscribe((res) => {
      console.log(res);
    });

    for (let i = 0; i < 10; i++) {
      // function that returns promise
      this.add(() => new Promise<string>((resolve) => setTimeout(() => resolve('Promise ' + i), 3000)));
      // observable
      this.add(of('observable ' + i).pipe(delay(3000)));
    }
  }
}
