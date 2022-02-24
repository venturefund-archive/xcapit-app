import { Task } from '../task/task';
import { Observable } from 'rxjs';
import { delay, retryWhen, scan } from 'rxjs/operators';

export class Retry {
  constructor(private readonly task: Task, private readonly delay = 2000, private readonly attempts: number = 2) {}

  execute(): Observable<any> {
    return this.task.value().pipe(
      retryWhen((error) =>
        error.pipe(
          scan((acc, error) => {
            if (acc > this.attempts) throw error;
            return acc + 1;
          }, 1),
          delay(this.delay)
        )
      )
    );
  }
}
