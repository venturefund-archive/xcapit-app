import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'splitString',
})
export class SplitStringPipe implements PipeTransform {
  transform(input: any, separator: string = ' ', limit?: number): any {
    return typeof input === 'string' ? input.split(separator, limit) : input;
  }
}
