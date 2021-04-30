import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Pipe, PipeTransform } from '@angular/core';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';

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
