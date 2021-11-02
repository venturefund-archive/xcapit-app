import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NftDetailPage } from './nft-detail.page';

describe('NftDetailPage', () => {
  let component: NftDetailPage;
  let fixture: ComponentFixture<NftDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NftDetailPage],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(NftDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
