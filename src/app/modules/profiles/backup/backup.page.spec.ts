import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { BackupPage } from './backup.page';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';

describe('BackupPage', () => {
  let component: BackupPage;
  let fixture: ComponentFixture<BackupPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BackupPage],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot(), ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(BackupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly texts and toggle', async () => {
    await fixture.whenRenderingDone();
    await fixture.whenStable();
    fixture.detectChanges();
    const titleEl = fixture.debugElement.query(By.css('.b__title'));
    const labelEl = fixture.debugElement.query(By.css('.b__item__toggle__labels ion-text'));
    const toggle = fixture.debugElement.query(By.css('ion-toggle[name="ux_backup"]'));
    expect(titleEl.nativeElement.innerHTML).toContain('profiles.backup.title');
    expect(labelEl.nativeElement.innerHTML).toContain('profiles.backup.toggle_text');
    expect(toggle).toBeTruthy();
  });
});
