import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { SliderNewsCardComponent } from './slider-news.component';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserService } from '../../services/browser/browser.service';

describe('SliderNewsCardComponent', () => {
  let component: SliderNewsCardComponent;
  let fixture: ComponentFixture<SliderNewsCardComponent>;
  let browserServiceSpy: jasmine.SpyObj<BrowserService>;
  beforeEach(
    waitForAsync(() => {
      browserServiceSpy = jasmine.createSpyObj('BrowserService', { open: Promise.resolve() });
      TestBed.configureTestingModule({
        declarations: [SliderNewsCardComponent],
        imports: [IonicModule, TranslateModule.forRoot()],
        providers: [{ provide: BrowserService, useValue: browserServiceSpy }],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(SliderNewsCardComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call window.open when goToNew is called', () => {
    component.goToWeb('test_slug');
    expect(browserServiceSpy.open).toHaveBeenCalledOnceWith({ url: 'https://www.xcapit.com/xcapit-academy/test_slug' });
  });
});
