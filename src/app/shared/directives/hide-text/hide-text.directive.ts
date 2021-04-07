import { ChangeDetectorRef, Directive,ElementRef,HostListener } from '@angular/core';
import { HideTextPipe } from '../../pipes/hide-text/hide-text.pipe';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { TrackService } from '../../services/track/track.service';


@Directive({
  selector: '[appHideText]'
})
export class HideTextDirective {
  constructor(private el: ElementRef, private localStorageService: LocalStorageService, private hideTextPipe:HideTextPipe ) { 
    this.localStorageService.hideFundsHasChanged.subscribe(
      (hideFunds) => this.onLocalStorageHasChanged(hideFunds)
    );
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
    this.hideTextPipe.activate();
  }

  showFunds() {
    this.hideTextPipe.desactivate();

  }

}
