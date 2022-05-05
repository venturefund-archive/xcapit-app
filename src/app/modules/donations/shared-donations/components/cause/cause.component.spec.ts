import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { CauseComponent } from './cause.component';

const testCause = {
  image: 'assets/img/donations/causes/cause_1/image.jpg',
  title: 'UNHCR',
  logo: 'assets/img/donations/causes/cause_1/logo.svg',
  type: 'humanitary',
};

describe('CauseComponent', () => {
  let component: CauseComponent;
  let fixture: ComponentFixture<CauseComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CauseComponent],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(CauseComponent);
      component = fixture.componentInstance;
      component.cause = testCause;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly', async () => {
    component.ngOnInit();
    await fixture.whenStable();
    await fixture.whenRenderingDone();
    const imgEl = fixture.debugElement.query(By.css('.cc__image img'));
    expect(imgEl.attributes.src).toContain('assets/img/donations/causes/cause_1/image.jpg');

    const logoEl = fixture.debugElement.query(By.css('.cc__logo img'));
    expect(logoEl.attributes.src).toContain('assets/img/donations/causes/cause_1/logo.svg');

    const textEl = fixture.debugElement.query(By.css('.cc__text-badge__text ion-text'));
    expect(textEl.nativeElement.innerHTML).toContain('UNHCR');

    const badgeEl = fixture.debugElement.query(By.css('.cc__text-badge__badge'));
    expect(badgeEl.nativeNode.innerHTML).toContain('donations.causes.types.humanitary');
  });
});
