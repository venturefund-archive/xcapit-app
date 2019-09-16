import { Component, OnInit } from '@angular/core';
import { ApiTacService } from '../shared-terms-and-conditions/services/api-tac/api-tac.service';
import { Observable } from 'rxjs';
import { NavController } from '@ionic/angular';
import { FundFormActions } from '../../funds/shared-funds/enums/fund-form-actions.enum';
import { TacHelperService } from '../shared-terms-and-conditions/services/tac-helper/tac-helper.service';

@Component({
  selector: 'app-accept',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/funds/list"></ion-back-button>
        </ion-buttons>
        <ion-title>
          {{ 'terms_and_conditions.accept.header' | translate }}
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
      doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo
      inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
      Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut
      fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem
      sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit
      amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora
      incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad
      minima veniam, quis nostrum exercitationem ullam corporis suscipit
      laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum
      iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae
      consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur
      <p>
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem
        accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab
        illo inventore veritatis et quasi architecto beatae vitae dicta sunt
        explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
        odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
        voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum
        quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam
        eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat
        voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam
        corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?
        Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse
        quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo
        voluptas nulla pariatur
      </p>
      <p>
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem
        accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab
        illo inventore veritatis et quasi architecto beatae vitae dicta sunt
        explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
        odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
        voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum
        quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam
        eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat
        voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam
        corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?
        Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse
        quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo
        voluptas nulla pariatur
      </p>
    </ion-content>
    <ion-footer class="ion-no-padding ion-no-margin">
      <div class="button_wrapper">
        <ion-button
          appTrackClick
          name="I agree"
          type="button"
          expand="full"
          size="large"
          fill="clear"
          routerDirection="back"
          [routerLink]="['/funds/list']"
          class="ion-no-padding ion-no-margin"
        >
          {{ 'terms_and_conditions.accept.cancel_button' | translate }}
        </ion-button>
      </div>
      <div class="button_wrapper">
        <ion-button
          appTrackClick
          name="I agree"
          type="button"
          expand="full"
          size="large"
          color="success"
          (click)="this.iAgreeTermsAndConditions()"
          class="ion-no-padding ion-no-margin"
        >
          {{ 'terms_and_conditions.accept.i_agree_button' | translate }}
        </ion-button>
      </div>
    </ion-footer>
  `,
  styleUrls: ['./accept.page.scss']
})
export class AcceptPage implements OnInit {
  tac: any;

  constructor(
    private tacHelper: TacHelperService,
    private apiTac: ApiTacService,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.apiTac.crud.get().subscribe(data => (this.tac = data));
  }

  iAgreeTermsAndConditions() {
    const acceptedObj = { accepted: true };
    let request$: Observable<any>;
    if (this.tac && this.tac.id) {
      request$ = this.apiTac.crud.update(acceptedObj, this.tac.id);
    } else {
      request$ = this.apiTac.crud.create(acceptedObj);
    }
    request$.subscribe(() => {
      const url = this.tacHelper.urlToAccess
        ? [this.tacHelper.urlToAccess]
        : ['/funds/action', FundFormActions.NewFund];
      this.navController.navigateForward(url, { replaceUrl: true });
    });
  }
}
