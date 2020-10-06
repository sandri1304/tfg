import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorieHomeComponent } from './categorie-home.component';

describe('CategorieHomeComponent', () => {
  let component: CategorieHomeComponent;
  let fixture: ComponentFixture<CategorieHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategorieHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategorieHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
