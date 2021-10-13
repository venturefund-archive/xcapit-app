import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hideText',
  pure: false,
})
export class HideTextPipe implements PipeTransform {
  constructor() {}

  transform(value: string, activated: boolean): string {
    if (activated === true) {
      return value ? value.replace(value, '****') : value;
    } else {
      return value;
    }
  }
}
