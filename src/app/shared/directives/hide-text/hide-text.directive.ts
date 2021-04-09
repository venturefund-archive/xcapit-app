import { Directive, ElementRef, EventEmitter, Output } from '@angular/core';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';

@Directive({
  selector: '[appHideText]',
})
export class HideTextDirective {
  @Output() hideTextHasChanged: EventEmitter<boolean>;

  constructor(private localStorageService: LocalStorageService, private el : ElementRef) {
    this.hideTextHasChanged = new EventEmitter<boolean>();

    

    this.localStorageService.hideFundsHasChanged.subscribe((hideFunds) =>
      this.onLocalStorageHasChanged(hideFunds)
    );
  }

  ngAfterContentInit() {
    this.hideTextHasChanged.emit(this.localStorageService.getHideFunds());
  }

  onLocalStorageHasChanged(hideFunds: boolean) {
    this.hideTextHasChanged.emit(hideFunds);
  }
}
