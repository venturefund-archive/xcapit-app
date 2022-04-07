import { NavController } from '@ionic/angular';
import { AfterViewInit, Component, ElementRef, Input } from '@angular/core';
import { BrowserService } from '../../../../../shared/services/browser/browser.service';

@Component({
  selector: 'app-faq',
  template: `
    <div id="faq">
      <ul>
        <li>
          <input (click)="this.changeState()" type="checkbox" name="Faq" checked />
          <ion-icon name="chevron-up-outline" *ngIf="showFirst"></ion-icon>
          <ion-icon name="chevron-down-outline" *ngIf="!showFirst"></ion-icon>
          <ion-text class="ux-font-text-xs title" name="Title">{{ this.faq.title | translate }}</ion-text>
          <ion-text class="ux-font-text-base answer" name="Answer" [innerHTML]="this.faq.answer | translate">
          </ion-text>
        </li>
      </ul>
    </div>
    <div class="list-divider" *ngIf="!faq.last"></div>
  `,
  styleUrls: ['./faq.component.scss'],
})
export class FaqComponent implements AfterViewInit {
  @Input() faq;
  showFirst = false;
  anchors;
  constructor(
    private elementRef: ElementRef,
    private browserService: BrowserService,
    private navController: NavController
  ) {}

  changeState() {
    this.showFirst = !this.showFirst;
  }

  ngAfterViewInit() {
    this.anchors = this.elementRef.nativeElement.querySelectorAll('a');
    this.anchors.forEach((anchor) => {
      anchor.addEventListener('click', this.handleAnchorClick.bind(this));
    });
  }

  handleAnchorClick(event: Event) {
    event.preventDefault();
    const anchor = event.target as HTMLAnchorElement;
    this.openLink(anchor.getAttribute('href'));
  }

  async openLink(link) {
    this.isHTTPLink(link) ? await this.browseTo(link) : this.navigateTo(link);
  }

  isHTTPLink(link) {
    return /^http.*/i.test(link);
  }

  async browseTo(link) {
    await this.browserService.open({ url: link });
  }

  async navigateTo(link) {
    await this.navController.navigateForward(link);
  }
}
