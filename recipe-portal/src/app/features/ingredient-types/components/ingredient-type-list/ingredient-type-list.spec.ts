import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientTypeList } from './ingredient-type-list';

describe('IngredientTypeList', () => {
  let component: IngredientTypeList;
  let fixture: ComponentFixture<IngredientTypeList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngredientTypeList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IngredientTypeList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
