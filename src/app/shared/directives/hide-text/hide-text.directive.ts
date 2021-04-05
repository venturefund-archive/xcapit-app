import { ChangeDetectorRef, Directive,ElementRef,HostListener } from '@angular/core';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { TrackService } from '../../services/track/track.service';


@Directive({
  selector: '[appHideText]'
})
export class HideTextDirective {
  constructor(private el: ElementRef, private localStorageService: LocalStorageService) { 
    this.localStorageService.hideFundsHasChanged.subscribe(
      (hideFunds) => this.onLocalStorageHasChanged(hideFunds)
    );
  }

  @HostListener('click')
  onClick() {
    this.localStorageService.toggleHideFunds();
  }
  
  onLocalStorageHasChanged(hideFunds : boolean) {
    console.log("Cambió a " + hideFunds);
    if (hideFunds) {
      this.hideFunds();
    } else {
      this.showFunds();
    }
  }

  hideFunds() {

  }

  showFunds() {

  }

}
