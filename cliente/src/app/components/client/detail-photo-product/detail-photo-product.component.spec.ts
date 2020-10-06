import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPhotoProductComponent } from './detail-photo-product.component';

describe('DetailPhotoProductComponent', () => {
  let component: DetailPhotoProductComponent;
  let fixture: ComponentFixture<DetailPhotoProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailPhotoProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailPhotoProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
