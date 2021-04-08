import { Directive, ElementRef, EventEmitter, Output } from '@angular/core';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';

@Directive({
  selector: '[appHideText]',
})
export class HideTextDirective {
  @Output() hideTextHasChanged: EventEmitter<boolean>;

  constructor(private localStorageService: LocalStorageService) {
    this.hideTextHasChanged = new EventEmitter<boolean>();

    this.hideTextHasChanged.emit(this.localStorageService.getHideFunds());

    this.localStorageService.hideFundsHasChanged.subscribe((hideFunds) =>
      this.onLocalStorageHasChanged(hideFunds)
    );
  }

  onLocalStorageHasChanged(hideFunds: boolean) {
    this.hideTextHasChanged.emit(hideFunds);
  }
}
