import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';

import { EmbedVideoComponent } from './embed-video.component';

describe('EmbedVideoComponent', () => {
  let component: EmbedVideoComponent;
  let fixture: ComponentFixture<EmbedVideoComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [EmbedVideoComponent],
        imports: [IonicModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(EmbedVideoComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set url on iframe src attribute', () => {
    const iframe = fixture.debugElement.query(By.css('iframe'));
    const src = iframe.nativeElement.attributes.src.value;
    expect(src).toBe('https://www.youtube.com/embed/2tr-aQ78Ohg');
  });
});
