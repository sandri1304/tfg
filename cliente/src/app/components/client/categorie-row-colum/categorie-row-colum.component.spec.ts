import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorieRowColumComponent } from './categorie-row-colum.component';

describe('CategorieRowColumComponent', () => {
  let component: CategorieRowColumComponent;
  let fixture: ComponentFixture<CategorieRowColumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategorieRowColumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategorieRowColumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
