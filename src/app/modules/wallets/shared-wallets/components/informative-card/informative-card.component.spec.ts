import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { InformativeCardComponent } from './informative-card.component';

describe('InformativeCardComponent', () => {
  let component: InformativeCardComponent;
  let fixture: ComponentFixture<InformativeCardComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [InformativeCardComponent],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(InformativeCardComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
