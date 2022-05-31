import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { SwiperComponent } from 'swiper/angular';

import { BackupInformationCardComponent } from './backup-information-card.component';

describe('BackupInformationCardComponent', () => {
  let component: BackupInformationCardComponent;
  let fixture: ComponentFixture<BackupInformationCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BackupInformationCardComponent ],
      imports: [IonicModule.forRoot(),TranslateModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BackupInformationCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly', () => {
    component.text= 'testText';
    component.textClass = 'testUxHomeBackupCard'
    fixture.detectChanges();
    const textEl = fixture.debugElement.query(By.css('div.bic__information__text ion-text'));
    const imgEl = fixture.debugElement.query(By.css('div.bic__information img'));

    expect(textEl.nativeElement.innerHTML).toContain('testText');
    expect(imgEl.attributes['src']).toContain('assets/img/wallets/backup-information-circle.svg');
  });
});
