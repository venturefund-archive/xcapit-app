import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { NftCardComponent } from './nft-card.component';

describe('NftCardComponent', () => {
  let component: NftCardComponent;
  let fixture: ComponentFixture<NftCardComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [NftCardComponent],
        imports: [IonicModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(NftCardComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly of nft card', () => {
    component.data = {
      name: 'TitleExample',
      description: 'XcapitMexico',
      image: 'https://gateway.pinata.cloud/ipfs/QmaVGgzWF7WEQvWzbx9q93f4zXqseGBJfSp7anjidLHcjm',
    };
    fixture.detectChanges();
    const imageEl = fixture.debugElement.query(By.css('img.nv__img'));
    const titleEl = fixture.debugElement.query(By.css('ion-text.ux-font-titulos-xs'));
    const descriptionEl = fixture.debugElement.query(By.css('ion-text.ux-font-text-xs'));
    expect(imageEl.attributes.src).toEqual(component.data.image);
    expect(titleEl.nativeElement.innerHTML).toContain(component.data.name);
    expect(descriptionEl.nativeElement.innerHTML).toContain(component.data.description);
  });
});
