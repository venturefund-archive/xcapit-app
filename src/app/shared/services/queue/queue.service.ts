import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Queue } from './queue';
import { ObservableOrPromise } from '../../types/observable-or-promise.type';

@Injectable({
  providedIn: 'root',
})
export class QueueService {
  queues: { [name: string]: Queue } = {};

  constructor() {}

  create(name: string, concurrency: number): void {
    this.queues[name] = new Queue(concurrency);
  }

  enqueue(queue: string, task: ObservableOrPromise): void {
    this.queues[queue].enqueue(task);
  }

  results(queue: string): Observable<any> {
    return this.queues[queue].results;
  }

  dequeueAll() {
    this.queues = {};
  }
}
