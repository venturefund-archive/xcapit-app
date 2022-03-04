import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-ux-segment',
  template: `
    <div class="us">
      <ion-button
        class="us__button ux-font-text-xs"
        name="Select Segment"
        size="small"
        appTrackClick
        [dataToTrack]="{ description: item }"
        color="uxsecondary"
        *ngFor="let item of this.data"
        (click)="this.selectItem(item)"
        [ngClass]="{ selected: item === this.selectedNetwork, 'not-selected': item !== this.selectedNetwork }"
        >{{ item }}</ion-button
      >
    </div>
  `,
  styleUrls: ['./ux-segment.component.scss'],
})
export class UxSegmentComponent implements OnInit {
  @Input() data: string[];
  @Output() clickEvent: EventEmitter<string> = new EventEmitter<string>();
  @Input() selectedNetwork: string;
  constructor() {}

  selectItem(item) {
    this.clickEvent.emit(item);
    this.selectedNetwork = item;
  }

  ngOnInit() {
    if (!this.selectedNetwork)
      this.selectedNetwork = this.data[0];
  }
}
