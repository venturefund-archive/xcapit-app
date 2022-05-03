import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FixedFooterComponent } from './fixed-footer.component';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

describe('FixedFooterComponent', () => {
  let component: FixedFooterComponent;
  let fixture: ComponentFixture<FixedFooterComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [FixedFooterComponent],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(FixedFooterComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly', () => {
    const textEl = fixture.debugElement.query(By.css('ion-footer.ff > ion-text.ff__text'));
    expect(textEl.nativeElement.innerHTML).toContain('fiat_ramps.shared.fixed_footer.text');
  });
});
