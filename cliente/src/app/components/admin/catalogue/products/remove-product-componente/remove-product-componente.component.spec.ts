import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveProductComponenteComponent } from './remove-product-componente.component';

describe('RemoveProductComponenteComponent', () => {
  let component: RemoveProductComponenteComponent;
  let fixture: ComponentFixture<RemoveProductComponenteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveProductComponenteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveProductComponenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
