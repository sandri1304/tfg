import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveBrandComponent } from './remove-brand.component';

describe('RemoveBrandComponent', () => {
  let component: RemoveBrandComponent;
  let fixture: ComponentFixture<RemoveBrandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveBrandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveBrandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
