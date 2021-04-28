import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hideReferral'
})
export class HideReferralPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
