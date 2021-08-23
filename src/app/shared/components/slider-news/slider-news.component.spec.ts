import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { SliderNewsCardComponent } from './slider-news.component';
import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('SliderNewsCardComponent', () => {
  let component: SliderNewsCardComponent;
  let fixture: ComponentFixture<SliderNewsCardComponent>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SliderNewsCardComponent],

        imports: [IonicModule, TranslateModule.forRoot()],
        providers: [],
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
    spyOn(window, 'open');
    component.goToWeb('test_slug');
    expect(window.open).toHaveBeenCalledTimes(1);
  });
});
