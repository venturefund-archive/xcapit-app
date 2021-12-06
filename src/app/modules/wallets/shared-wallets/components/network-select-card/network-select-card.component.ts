import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-network-select-card',
  template: `
    <div [appSelectStyle]="this.selectorStyle">
      <div class="nsc ion-padding">
        <div class="nsc__title">
          <ion-text class="ux-font-lato ux-fweight-bold ux-fsize-12">{{ this.title }}</ion-text>
        </div>
        <div class="nsc__networks">
          <app-ux-segment
            [selectedNetwork]="this.selectedNetwork"
            (clickEvent)="this.networkChanged.emit($event)"
            [data]="this.networks"
          >
          </app-ux-segment>
        </div>
        <div class="nsc__disclaimer" *ngIf="this.disclaimer">
          <ion-text class="ux-font-lato ux-fweight-regular ux-fsize-12">{{ this.disclaimer }}</ion-text>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./network-select-card.component.scss'],
})
export class NetworkSelectCardComponent implements OnInit {
  @Input() title: string;
  @Input() disclaimer: string;
  @Input() networks: string[];
  @Input() selectedNetwork: string;
  @Input() selectorStyle = 'classic';
  @Output() networkChanged: EventEmitter<string> = new EventEmitter<string>();
  constructor() {}

  ngOnInit() {}
}
