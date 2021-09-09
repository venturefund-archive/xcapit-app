import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-ux-segment',
  template: `
    <div class="us">
      <ion-button
        class="us__button"
        name="Select Segment"
        size="small"
        appTrackClick
        [dataToTrack]="{ description: item }"
        color="uxprimary"
        *ngFor="let item of this.data"
        (click)="this.selectItem(item)"
        [ngClass]="{ selected: item === this.selected, 'not-selected': item !== this.selected }"
        >{{ item }}</ion-button
      >
    </div>
  `,
  styleUrls: ['./ux-segment.component.scss'],
})
export class UxSegmentComponent implements OnInit {
  @Input() data: string[];
  @Output() clickEvent: EventEmitter<string> = new EventEmitter<string>();
  selected: string;
  constructor() {}

  selectItem(item) {
    this.clickEvent.emit(item);
    this.selected = item;
  }
  ngOnInit() {
    this.selected = this.data[0];
  }
}
