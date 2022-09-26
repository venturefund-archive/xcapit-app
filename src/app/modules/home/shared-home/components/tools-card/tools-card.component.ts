import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tools-card',
  template: `
    <ion-item lines="none" class="main ux-card-new" appTrackClick [dataToTrack]="{ eventLabel: this.data.trackClickEventNamePrimaryAction }" (click)="this.primaryAction()">
    <div class="main__content">
      <div class="main__ux-icon">
          <img class="main__ux-icon__img" [src]="this.data.icon" />
        </div>
        <div class="main__primary-text">
          <ion-text class="ux-font-text-lg">{{ this.data.textPrimary | translate }}</ion-text>
        </div>
        <div class="main__secondary-text">
          <ion-text class="ux-font-text-xxs" color="neutral80">{{ this.data.textSecondary | translate }}</ion-text>
        </div>
      </div>  
    </ion-item>
  `,
  styleUrls: ['./tools-card.component.scss'],
})
export class ToolsCardComponent implements OnInit {
  @Input() data: any;
  @Output() primaryActionEvent: EventEmitter<void> = new EventEmitter<void>();

  constructor(private navController: NavController) { }

  ngOnInit() {}

  async primaryAction() {
    if (this.data.urlPrimaryAction) {
      this.navController.navigateForward([this.data.urlPrimaryAction]);
    }
    this.primaryActionEvent.emit(this.data.trackClickEventNamePrimaryAction);
  }
}
