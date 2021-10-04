import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { SafeURLPipe } from '../../pipes/safe-url/safe-url.pipe';

import { EmbedVideoComponent } from './embed-video.component';

describe('EmbedVideoComponent', () => {
  let component: EmbedVideoComponent;
  let fixture: ComponentFixture<EmbedVideoComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [EmbedVideoComponent, SafeURLPipe],
        imports: [IonicModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(EmbedVideoComponent);
      component = fixture.componentInstance;
      component.url = '';
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set url on iframe src attribute', () => {
    const iframe = fixture.debugElement.query(By.css('iframe'));
    const src = iframe.nativeElement.attributes.src.value;
    expect(src).toBe('');
  });
});
