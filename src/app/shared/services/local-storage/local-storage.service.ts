import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  @Output() hideFundsHasChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  hideFunds : boolean;

  constructor() { 
    this.hideFunds = this.getHideFunds();
  }

  toggleHideFunds() {
    this.hideFunds = !this.hideFunds;
    this.setHideFunds(this.hideFunds);
  }

  getHideFunds() : boolean {
    return localStorage.getItem("hideFunds") == "true";
  }

  setHideFunds(hideFunds : boolean) {
    localStorage.setItem("hideFunds", hideFunds.toString());
    this.hideFundsHasChanged.emit(this.hideFunds);
  }
}
