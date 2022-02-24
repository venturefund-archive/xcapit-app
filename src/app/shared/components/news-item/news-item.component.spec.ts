import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { NewsItemComponent } from './news-item.component';
import { News } from '../../interfaces/news.interface';
import { By } from '@angular/platform-browser';

describe('NewsItemComponent', () => {
  let component: NewsItemComponent;
  let fixture: ComponentFixture<NewsItemComponent>;
  let testItem: News;
  beforeEach(
    waitForAsync(() => {
      testItem = {
        badge: 'testBadge',
        title: 'testTitle',
        description: 'testDescription',
        url: '/test/url',
      };
      TestBed.configureTestingModule({
        declarations: [NewsItemComponent],
        imports: [IonicModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(NewsItemComponent);
      component = fixture.componentInstance;
      component.item = testItem;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit clicked event', async () => {
    const spy = spyOn(component.clicked, 'emit');
    fixture.debugElement.query(By.css('ion-item')).nativeElement.click();
    await fixture.whenStable();
    expect(spy).toHaveBeenCalledOnceWith('/test/url');
  });
});
