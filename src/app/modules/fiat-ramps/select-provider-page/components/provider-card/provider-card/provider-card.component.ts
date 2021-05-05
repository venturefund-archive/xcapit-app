import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-provider-card',
  template:`
      <div class="pcc">
        <div class="pcc__content">
          <div class="pcc__content__id ">
            <div class="ux-font-lato ux-fweight-regular ux-fsize-12">
              <ion-text color="uxmedium">0{{ this.id}}</ion-text>
            </div>
          </div>
          <div class="pcc__content__image">
                <img [src]="this.img" alt=" Provider Logo" />
          </div>
          <div class="pcc__content__name">
            <div class="ux-font-lato ux-fweight-regular ux-fsize-12">
              <ion-text class="name_text" color="uxdark"> {{ this.name }}</ion-text>  
            </div>
          </div>
          <div class="pcc__button">
            <div class="button">
              <ion-button
                appTrackClick
                name="Manage"
                fill="clear"
                color = "uxmedium"
                size="small"
                slot="end"
                class="ux-font-lato ux-fweight-semibold ux-fsize-14"
                (click)="this.useProvider(this.id)"
              >
              <ion-icon slot="end" name="chevron-forward-outline"></ion-icon>
            </ion-button>
          </div>
          
          </div>
      </div>
  `,
  styleUrls: ['./provider-card.component.scss'],
})
export class ProviderCardComponent implements OnInit {
  @Input() id: number;
  @Input() name: string;
  @Input() img: string;
  @Output() useButtonClicked: EventEmitter<number> = new EventEmitter<number>();
  
  constructor() { }

  ngOnInit() {}

  useProvider(id: number) {
    this.useButtonClicked.emit(id);
  }

}
