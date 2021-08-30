import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { UxListCardComponent } from './ux-list-card.component';
import { By } from '@angular/platform-browser';
import { TrackClickDirectiveTestHelper } from '../../../../testing/track-click-directive-test.helper';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TrackClickDirective } from '../../directives/track-click/track-click.directive';

const exampleData = [
  { label: 'test-label1', icon: 'icon1' },
  { label: 'test-label2', icon: 'icon2' },
];

describe('UxListCardComponent', () => {
  let component: UxListCardComponent;
  let fixture: ComponentFixture<UxListCardComponent>;
  let trackClickDirectiveHelper: TrackClickDirectiveTestHelper<UxListCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UxListCardComponent, TrackClickDirective],
      imports: [IonicModule, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(UxListCardComponent);
    component = fixture.componentInstance;
    component.data = exampleData;
    fixture.detectChanges();
    trackClickDirectiveHelper = new TrackClickDirectiveTestHelper(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render data items when label and icon name are defined', () => {
    component.iconName = 'icon';
    component.labelName = 'label';
    fixture.detectChanges();

    const items = fixture.debugElement.queryAll(By.css('ion-item'));

    for (const item of items) {
      expect(item.children[0].nativeElement.src).toContain('icon');
      expect(item.children[1].nativeElement.innerText).toContain('test-label');
    }
  });

  it('should render data items when flat array and label and icon name are not defined', () => {
    component.iconName = '';
    component.labelName = '';
    component.data = ['test-label1', 'test-label2'];
    fixture.detectChanges();

    const items = fixture.debugElement.queryAll(By.css('ion-item'));

    for (const item of items) {
      expect(item.children[0].nativeElement.innerText).toContain('test-label');
    }
  });

  it('should emit itemClicked event when selectable is true and item clicked', () => {
    component.data = ['test-label1', 'test-label2'];
    fixture.detectChanges();
    const spy = spyOn(component.itemClicked, 'emit');
    const item = fixture.debugElement.query(By.css('ion-item'));
    item.nativeElement.click();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should not emit itemClicked event when selectable is false and item clicked', () => {
    component.data = ['test-label1', 'test-label2'];
    component.selectable = false;
    fixture.detectChanges();
    const spy = spyOn(component.itemClicked, 'emit');
    const item = fixture.debugElement.query(By.css('ion-item'));
    item.nativeElement.click();
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should call trackEvent on trackService when Item Clicked is clicked', () => {
    const el = trackClickDirectiveHelper.getByElementByName('ion-item', 'Item Clicked');
    const directive = trackClickDirectiveHelper.getDirective(el);
    const spyClickEvent = spyOn(directive, 'clickEvent');
    el.nativeElement.click();
    fixture.detectChanges();
    expect(spyClickEvent).toHaveBeenCalledTimes(1);
  });
});
