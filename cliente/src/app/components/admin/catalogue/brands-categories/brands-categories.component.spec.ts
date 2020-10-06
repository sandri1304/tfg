import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandsCategoriesComponent } from './brands-categories.component';

describe('BrandsCategoriesComponent', () => {
  let component: BrandsCategoriesComponent;
  let fixture: ComponentFixture<BrandsCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrandsCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandsCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
