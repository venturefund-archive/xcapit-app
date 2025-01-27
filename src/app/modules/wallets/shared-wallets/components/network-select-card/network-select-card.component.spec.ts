import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { NetworkSelectCardComponent } from './network-select-card.component';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SelectStyleDirective } from 'src/app/shared/directives/select-style/select-style.directive';

describe('NetworkSelectCardComponent', () => {
  let component: NetworkSelectCardComponent;
  let fixture: ComponentFixture<NetworkSelectCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NetworkSelectCardComponent, SelectStyleDirective],
      imports: [IonicModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(NetworkSelectCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly', async () => {
    component.title = 'Test title';
    component.disclaimer = 'Test Disclaimer';
    component.networks = ['BTC', 'BEP2', 'BEP20'];

    fixture.detectChanges();
    await fixture.whenStable();
    await fixture.whenRenderingDone();

    const titleEl = fixture.debugElement.query(By.css('.nsc__title')).query(By.css('ion-text'));
    expect(titleEl.nativeElement.innerHTML).toContain('Test title');

    const networksEl = fixture.debugElement.queryAll(By.css('app-ux-segment'));
    expect(networksEl).toBeTruthy();

    const disclaimerEl = fixture.debugElement.query(By.css('.nsc__disclaimer'));
    expect(disclaimerEl.nativeNode.innerHTML).toContain('Test Disclaimer');
  });
});
