import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  template: `
    <ion-searchbar
      class="search-bar"
      [placeholder]="'shared.search_bar.placeholder' | translate"
      clear-icon="ux-clear-button"
      (ionChange)="handleChange($event)"
    ></ion-searchbar>
  `,
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit {
  @Output() search: EventEmitter<string> = new EventEmitter<string>();
  
  constructor() {}

  ngOnInit() {}

  handleChange(event) {
    this.search.emit(event);
  }
}
