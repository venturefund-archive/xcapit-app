import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-new-apikeys',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>new-apikeys</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="ion-padding">
        <app-stepper
          [steps]="this.steps"
          [activeStep]="this.activeStep"
          (clickStep)="this.testOutput($event)"
        ></app-stepper>
      </div>
      <div class="ion-padding">
        <ion-card>
          <ion-card-content>
            <ion-slides [options]="{ allowTouchMove: false }">
              <ion-slide>
                <h1>Slide 1</h1>
              </ion-slide>
              <ion-slide>
                <h1>Slide 2</h1>
              </ion-slide>
              <ion-slide>
                <h1>Slide 3</h1>
              </ion-slide>
              <ion-slide>
                <h1>Slide 4</h1>
              </ion-slide>
              <ion-slide>
                <h1>Slide 5</h1>
              </ion-slide>
              <ion-slide>
                <h1>Slide 6</h1>
              </ion-slide>
              <ion-slide>
                <h1>Slide 7</h1>
              </ion-slide>
            </ion-slides>
          </ion-card-content>
        </ion-card>
        <div class="ion-text-center">
          <ion-button (click)="this.test(1)">1</ion-button>
          <ion-button (click)="this.test(2)">2</ion-button>
          <ion-button (click)="this.test(3)">3</ion-button>
          <ion-button (click)="this.test(4)">4</ion-button>
          <ion-button (click)="this.test(5)">5</ion-button>
          <ion-button (click)="this.test(6)">6</ion-button>
          <ion-button (click)="this.test(7)">7</ion-button>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./new-apikeys.page.scss']
})
export class NewApikeysPage implements OnInit {
  action: string;
  activeStep: number;
  steps: number;

  @ViewChild(IonSlides, { static: true }) slides: IonSlides;

  constructor(private route: ActivatedRoute) {}

  async ngOnInit() {
    this.action = this.route.snapshot.paramMap.get('action');
  }

  ionViewDidEnter() {
    this.setStepper();
  }

  async setStepper() {
    this.steps = await this.slides.length();
    this.activeStep = (await this.slides.getActiveIndex()) + 1;
  }

  test(point: number) {
    this.activeStep = point;
    this.slides.slideTo(this.activeStep - 1);
  }

  testOutput(stepClicked: any) {
    this.test(stepClicked);
  }
}
