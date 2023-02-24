import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { NoConnectionBannerComponent } from './no-connection-banner.component';
import { TranslateModule } from '@ngx-translate/core';

describe('NoConnectionBannerComponent', () => {
  let component: NoConnectionBannerComponent;
  let fixture: ComponentFixture<NoConnectionBannerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [NoConnectionBannerComponent],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(NoConnectionBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
