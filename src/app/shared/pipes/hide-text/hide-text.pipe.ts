import { Pipe, PipeTransform } from '@angular/core';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';

@Pipe({
  name: 'hideText',
  pure: false,
})
export class HideTextPipe implements PipeTransform {
  public activated: boolean = false;

  constructor(private localStorageService: LocalStorageService) {}

  activate() {
    this.activated = true;
    this.transform;
  }

  desactivate() {
    this.activated = false;
    this.transform;
  }

  transform(value: string): string {
    if ((this.activated = true)) {
      return value ? value.replace(value, '****') : value;
    } else {
      return value;
    }
  }
}
