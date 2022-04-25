import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FiatRampOperation } from '../../models/fiat-ramp-operation';

@Component({
  selector: 'app-operations-list-item',
  template: `
    <ion-item [lines]="this.linesValue" appTrackClick name="Operation Item" slot="content" class="row" (click)="viewOperationDetail()">
      <ion-label>
        <ion-text class="ux-font-text-xs">
          <img [src]="operation._aProvider.logoRoute" alt="{{ operation._aProvider.name }}" />
          {{ operation._aCoin.value }}
        </ion-text>
      </ion-label>
      <ion-label>
        <ion-text class="ux-font-titulo-xs">{{ operation._anAmount | currency }}</ion-text>
      </ion-label>
      <ion-label>
        <ion-text class="ux-font-text-xs">
          {{ operation._aCreationDate | date: 'dd/MM/yy' }}
        </ion-text>
      </ion-label>
      <ion-label class="end">
        <app-operation-status-chip [status]="operation._anOperationStatus"></app-operation-status-chip>
      </ion-label>
    </ion-item>
  `,
  styleUrls: ['./operations-list-item.component.scss'],
})
export class OperationsListItemComponent implements OnInit {
  @Input() operation: FiatRampOperation;
  @Input() isLast: boolean;

  get linesValue(): string {
    if (this.isLast) {
      return 'none';
    }

    return;
  }

  constructor(private navController: NavController) {}

  ngOnInit() {}

  viewOperationDetail() {
    this.navController.navigateForward([`/fiat-ramps/operation-detail/provider/${this.operation._aProvider.id}/operation/${this.operation._anId}`]);
  }
}
