import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'localizedDate',
  pure: true, // required false to update the value when currentLang is changed
})
export class LocalizedDatePipe implements PipeTransform {
  constructor(
    private translate: TranslateService,
    private datePipe: DatePipe
  ) {}

  transform(date: string, pattern: string = 'mediumDate'): string {
    return this.datePipe.transform(
      date,
      pattern,
      undefined,
      this.translate.currentLang
    );
  }
}
