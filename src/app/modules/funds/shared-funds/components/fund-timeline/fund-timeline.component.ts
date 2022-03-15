import { Component, OnInit, Input } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-fund-timeline',
  template: `
    <div class="ftl">
      <div class="ftl__content ion-padding">
        <div
          class="ftl__content__item active"
          *ngFor="let run of this.runs"
          [ngClass]="this.run.estado"
          (click)="this.goToDetail(run.id_corrida)"
        >
          <div class="ftl__content__item__side">
            <div class="ftl__content__item__side__dot-container">
              <div class="ftl__content__item__side__dot-container__dot"></div>
            </div>
            <div class="ftl__content__item__side__line-container">
              <div class="ftl__content__item__side__line-container__line"></div>
            </div>
          </div>
          <div class="ftl__content__item__content" *ngIf="this.run.estado === 'active'">
            <div class="ftl__content__item__content__info">
              <ion-text color="neutral90" class="ux-font-text-xs semibold">
                {{ this.run.fecha_inicio | date: 'dd/MM/yyyy' }}
              </ion-text>
            </div>
            <div class="ftl__content__item__content__label">
              <ion-text color="neutral80" class="ux-font-text-xxs regular">
                {{ 'funds.fund_timeline.active_fund' | translate }}
              </ion-text>
            </div>
          </div>
          <div class="ftl__content__item__content" *ngIf="this.run.estado === 'finalizado'">
            <div class="ftl__content__item__content__info">
              <div>
                <ion-label color="primary" class="ux-font-text-xs semibold">
                  {{ this.run.fecha_inicio | date: 'dd/MM/yyyy' }}
                </ion-label>
              </div>
              <div class="ftl__content__item__content__info__percentage">
                <ion-label *ngIf="this.run.percentage">
                  <ion-text class="ux-font-text-xxs regular extrasmall positive" *ngIf="this.run.percentage >= 0">
                    {{ this.run.percentage | number: '1.0-2' }}%
                  </ion-text>
                  <ion-text class="ux-font-text-xxs regular extrasmall negative" *ngIf="this.run.percentage < 0">
                    {{ this.run.percentage | number: '1.0-2' }}%
                  </ion-text>
                </ion-label>
              </div>
            </div>
            <div class="ftl__content__item__content__label">
              <ion-text color="neutral80" class="ux-font-text-xxs extrasmall regular">
                {{ 'funds.fund_timeline.finished_fund' | translate }}
              </ion-text>
            </div>
          </div>
        </div>
        <div class="ftl__content__item initial">
          <div class="ftl__content__item__side">
            <div class="ftl__content__item__side__dot-container">
              <div class="ftl__content__item__side__dot-container__dot"></div>
            </div>
          </div>
          <div class="ftl__content__item__content">
            <ion-label color="neutral50" class="ux-font-text-xxs semibold">
              {{ 'funds.fund_timeline.start_of' | translate }}
              {{ this.fundName }}</ion-label
            >
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./fund-timeline.component.scss'],
})
export class FundTimelineComponent implements OnInit {
  @Input() runs: any;
  @Input() fundName: string;
  @Input() isOwner: boolean;

  constructor(private navController: NavController) {}

  ngOnInit() {}

  goToDetail(runID) {
    if (this.isOwner === true) {
      this.navController.navigateForward([`/funds/fund-timeline-detail/${this.fundName}/${runID}`]);
    }
  }
}
