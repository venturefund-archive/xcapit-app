import { Pipe, PipeTransform } from '@angular/core';
let visibleChars = 3;
@Pipe({
  name: 'hideReferral'
})

export class HideReferralPipe implements PipeTransform {
  transform(value: string, ): string {
     return value
      ? value.replace(/[a-z0-9\-_.]+@/ig, (c) => c.substr(0, visibleChars) + c.split('').slice(visibleChars, -1).map(v => '*').join('') + '@') 
      : value;
  }
}
