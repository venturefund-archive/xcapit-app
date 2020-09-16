import { Component, Input, OnInit } from '@angular/core';
import { FundDataStorageService } from '../../../shared-funds/services/fund-data-storage/fund-data-storage.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-fund-finished-card',
  template: `
    <ion-item>
      <ion-label>
          <h2>
              {{ this.fundName }}
          </h2>
          <!-- h3>
              Fecha del fondo
          </h3 -->
      </ion-label>
      <div class="ff__renew">
        <ion-button 
          appTrackClick
          fill="clear"
          name="Renovate Fund"
          (click)="this.renewFund()">
            <ion-icon name="sync" color="uxmedium"></ion-icon>
        </ion-button>
      </div>
    </ion-item>
  `,
  styleUrls: ['./fund-finished-card.component.scss'],
})
export class FundFinishedCardComponent implements OnInit {
  @Input() fundName: string;

  constructor(
    private fundDataStorage: FundDataStorageService,
    private navController: NavController
  ) { }

  ngOnInit() {}

  async renewFund(){
    this.fundDataStorage.setData('fundName', {fund_name: this.fundName});
    this.fundDataStorage.setData('fundRenew', true);
    this.navController.navigateForward(['funds/fund-risk']);
  }

}
