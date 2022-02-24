import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-network-select-card',
  template: `
    <div class="nsc ion-padding">
      <div class="nsc__title">
        <ion-text class="ux-font-titulo-xs">{{ this.title }}</ion-text>
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
        <ion-text class="ux-font-text-xxs">{{ this.disclaimer }}</ion-text>
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
  @Output() networkChanged: EventEmitter<string> = new EventEmitter<string>();
  constructor() {}

  ngOnInit() {}
}
