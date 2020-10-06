import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailClientComponent } from './product-detail-client.component';

describe('ProductDetailClientComponent', () => {
  let component: ProductDetailClientComponent;
  let fixture: ComponentFixture<ProductDetailClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductDetailClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
